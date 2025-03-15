import fitz  # PyMuPDF
import json
import ollama
import os
from dotenv import load_dotenv
from markdown_it import MarkdownIt
from langchain_community.chat_models import ChatOllama
from langchain.schema import HumanMessage

load_dotenv()

def extract_json_from_markdown(markdown_text):
    md = MarkdownIt()
    tokens = md.parse(markdown_text)
    
    for token in tokens:
        if token.type == "fence" and token.info.strip() == "json":
            return json.loads(token.content)

    raise ValueError("No valid JSON block found in the Markdown") 

class BookistProcessor:
    def __init__(self, pdf_path, model_name="hf.co/itlwas/Mistral-7B-Instruct-v0.1-Q4_K_M-GGUF:latest", chunk_size=5):
        self.pdf_path = pdf_path
        self.model = ChatOllama(model=model_name)
        self.chunk_size = chunk_size
        self.actionable_steps = []
        self.categorized_steps = {}

    def extract_text(self):
        doc = fitz.open(self.pdf_path)
        pages = [page.get_text() for page in doc][:10] 
        print(len(pages)) 
        return ["\n".join(pages[i:i+self.chunk_size]) for i in range(0, len(pages), self.chunk_size)]

    def call_ollama(self, prompt):
        print(prompt)
        response = self.model([HumanMessage(content=prompt)])
        return response.content

    def extract_actionable_steps(self, text_chunk):
        prompt = f"""
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
        ```
        """
        print('calling ollama')
        response = self.call_ollama(prompt)
        return extract_json_from_markdown(response)

    def categorize_steps(self):
        prompt = f"""
        Categorize the following actionable steps into broad topics and return the result in JSON format.
        The response should be a JSON object where each key is a category and the value is a list of steps.
        Ensure there is no extra text outside the JSON format.

        Actionable Steps:
        {json.dumps(self.actionable_steps)}

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
        ```
        """
        response = self.call_ollama(prompt)
        return extract_json_from_markdown(response)

    def order_hierarchy(self):
        prompt = f"""
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
        ```
        """
        response = self.call_ollama(prompt)
        return extract_json_from_markdown(response)

    def process_book(self):
        text_chunks = self.extract_text()
        
        for chunk in text_chunks:
            extracted_steps = self.extract_actionable_steps(chunk)
            self.actionable_steps.extend(extracted_steps["steps"])
        
        with open("actionable_steps.json", "w") as f:
            json.dump(self.actionable_steps, f, indent=4)

        self.categorized_steps = self.categorize_steps()
        with open("categorized_steps.json", "w") as f:
            json.dump(self.categorized_steps, f, indent=4)
        
        ordered_hierarchy = self.order_hierarchy()
        with open("ordered_hierarchy.json", "w") as f:
            json.dump(ordered_hierarchy, f, indent=4)

def run_process(pdf_path):
    processor = BookistProcessor(pdf_path)
    processor.process_book()
    print("Processing complete. Check JSON files for results.")

run_process("TheLeanStartup.pdf")
