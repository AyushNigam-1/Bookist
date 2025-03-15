import fitz  # PyMuPDF 
import json
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
import os
from dotenv import load_dotenv
from markdown_it import MarkdownIt

load_dotenv()
GROQ_API_KEY = os.getenv("groq_api_key")


def extract_json_from_markdown(markdown_text):
    md = MarkdownIt()
    tokens = md.parse(markdown_text)
    
    for token in tokens:
        if token.type == "fence" and token.info.strip() == "json":
            return json.loads(token.content)

    raise ValueError("No valid JSON block found in the Markdown") 



class BookistProcessor:
    def __init__(self, pdf_path, model_name="llama-3.3-70b-versatile", chunk_size=5):
        self.pdf_path = pdf_path
        self.model = ChatGroq(model_name=model_name)
        self.chunk_size = chunk_size
        self.structured_data = []
        self.actionable_steps = []
        self.categorized_steps = {}
        self.real_life_examples = {}
        
    def load_json_file(self,filename, default_value):
        try:
            with open(filename, "r") as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return default_value

    def save_json_file(self,filename, data):
        with open(filename, "w") as f:
            json.dump(data, f, indent=4)
                    
    def process_chunk(self, text_chunk):
        actionable_steps = self.extract_actionable_steps(text_chunk)
        categorized_steps = self.categorize_steps(actionable_steps)
        real_life_examples = self.generate_real_life_examples(categorized_steps)
        self.merge_real_life_examples(real_life_examples)
        # ordered_hierarchy = self.order_hierarchy(categorized_steps)
        return categorized_steps
    
    def extract_text(self):
        doc = fitz.open(self.pdf_path)
        pages = [page.get_text() for page in doc][:10]  
        print(len(pages))
        return ["\n".join(pages[i:i+self.chunk_size]) for i in range(0, len(pages), self.chunk_size)]

    def extract_actionable_steps(self, text_chunk):
        prompt = (
        f"""
        Extract only the most precise and actionable steps from the following text in JSON format.
        The response should be a JSON object with a key "steps" containing a list of action items.
        Ensure there is no extra text outside the JSON format.

        Text:
        {text_chunk}
        Preferred Markdown structure:
        ```json
        {{
        "steps": [
            "Actionable step 1",
            "Actionable step 2",
            "Actionable step 3"
        ]
        }}
        """
        )
        
        response = self.model.invoke([HumanMessage(content=prompt)])
        print(response.content)
        return extract_json_from_markdown(response.content)

    def categorize_steps(self , actionable_steps):
        # Load previously categorized steps if they exist
        try:
            with open("categorized_steps.json", "r") as f:
                self.categorized_steps = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            self.categorized_steps = {}

        prompt = (
            f"""
            Categorize the following actionable steps into broad topics while considering the previously categorized steps.
            - If a step fits into an existing category, append it to that category.
            - If a step does not fit any existing category, create a new category and add the step.
            - Ensure all previously categorized steps remain unchanged except for appending relevant new steps.

            Previously Categories:
            {list(self.categorized_steps.keys())}

            New Actionable Steps:
            {json.dumps(actionable_steps, indent=4)}

            Preferred Markdown structure:
            ```json
            {{
            "Category 1": [
                "Step 1",
                "Step 2"
            ],
            "Category 2": [
                "Step 3",
                "Step 4"
            ]
            }}
            """
        )

        response = self.model.invoke([HumanMessage(content=prompt)])
        new_categories = extract_json_from_markdown(response.content)

        if not isinstance(new_categories, dict):
            raise ValueError("Categorization response is not a valid dictionary.")

        for category, steps in new_categories.items():
            if not isinstance(steps, list):
                raise ValueError(f"Steps under {category} are not a list.")

            if category in self.categorized_steps:
                existing_steps = set(self.categorized_steps[category])
                new_steps = [step for step in steps if step not in existing_steps]
                self.categorized_steps[category].extend(new_steps)
            else:
                self.categorized_steps[category] = steps

        self.save_json_file("categorized_steps.json",self.categorized_steps)
        return new_categories


    def order_hierarchy(self):
        prompt = (
        f"""
        Arrange the topics in a logical order and return the ordered structure in JSON format.
        The response should be a JSON object where each key is a topic and its value is the ordered list of steps.
        Ensure there is no extra text outside the JSON format.

        Categorized Steps:
        {json.dumps(self.categorized_steps)}
        Preferred Markdown structure:
        ```json
        {{
        "Topic 1": [
            "Step 1",
            "Step 2"
        ],
        "Topic 2": [
            "Step 3",
            "Step 4"
        ]
        }}
        """
        )
        response = self.model.invoke([HumanMessage(content=prompt)])
        return extract_json_from_markdown(response.content)
    
    def generate_real_life_examples(self,categorized_steps):
        prompt = (
        f"""
        Provide real-life examples for each actionable step under their respective categories.
        The response should be a JSON object where each key is a category, and its value is a list of dictionaries.
        Each dictionary should contain a step and its corresponding real-life example.
        Ensure there is no extra text outside the JSON format.

        Categorized Steps:
        {json.dumps(categorized_steps)}
        Preferred Markdown structure:
        ```json
        {{
        "Category1": [
            {{"step": "Step 1", "Real-life example": "Example 1"}},
            {{"step": "Step 2", "Real-life example": "Example 2"}}
        ],
        "Category2": [
            {{"step": "Step 3", "Real-life example": "Example 3"}},
            {{"step": "Step 4", "Real-life example": "Example 4"}}
        ]
        }}
        """
        )
        response = self.model.invoke([HumanMessage(content=prompt)])
        return extract_json_from_markdown(response.content)
    
    def merge_real_life_examples(self, new_examples):
            for category, examples in new_examples.items():
                if category in self.real_life_examples:
                    self.real_life_examples[category].extend(examples)
                else:
                    self.real_life_examples[category] = examples

            self.save_json_file("real_life_examples.json", self.real_life_examples)
            
    def process_book(self):
        text_chunks = self.extract_text()
        for chunk in text_chunks:
            structured_chunk = self.process_chunk(chunk)
            self.structured_data.append(structured_chunk)
        
        with open("structured_data.json", "w") as f:
            json.dump(self.structured_data, f, indent=4)
        print("Processing complete.")

        # return ordered_hierarchy
    
def run_process(pdf_path):
    processor = BookistProcessor(pdf_path)
    hierarchy = processor.process_book()
    print("Final Structured Data:", json.dumps(hierarchy, indent=2))

run_process("TheLeanStartup.pdf")
