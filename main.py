# import fitz 
# import json
# from langchain_groq import ChatGroq
# from langchain.schema import HumanMessage
# import os
# from dotenv import load_dotenv
# from markdown_it import MarkdownIt

# load_dotenv()
# GROQ_API_KEY = os.getenv("groq_api_key")


# def extract_json_from_markdown(markdown_text):
#     md = MarkdownIt()
#     tokens = md.parse(markdown_text)
    
#     for token in tokens:
#         if token.type == "fence" and token.info.strip() == "json":
#             return json.loads(token.content)

#     raise ValueError("No valid JSON block found in the Markdown") 



# class BookistProcessor:
#     def __init__(self, pdf_path, model_name="llama-3.3-70b-versatile", chunk_size=5):
#         self.pdf_name = os.path.splitext(os.path.basename(pdf_path))[0] 
#         self.pdf_path = pdf_path
#         self.model = ChatGroq(model_name=model_name)
#         self.chunk_size = chunk_size
#         self.structured_data = []
#         self.actionable_steps = []
#         self.categorized_steps = {}
#         self.real_life_examples = {}
        
#     def load_json_file(self, filename, default_value):
#         pdf_name = os.path.splitext(os.path.basename(self.pdf_path))[0]
#         folder_path = os.path.join(os.getcwd(), pdf_name)
#         file_path = os.path.join(folder_path, filename)

#         try:
#             with open(file_path, "r") as f:
#                 return json.load(f)
#         except (FileNotFoundError, json.JSONDecodeError):
#             return default_value


#     def save_json_file(self, filename, data):
#         folder_path = os.path.join(os.getcwd(), self.pdf_name)
#         os.makedirs(folder_path, exist_ok=True)
#         file_path = os.path.join(folder_path, filename)

#         with open(file_path, "w") as f:
#             json.dump(data, f, indent=4)

                    
#     def process_chunk(self, text_chunk):
#         self.extract_actionable_steps(text_chunk)
#         self.categorize_steps()
#         self.order_hierarchy()

    
#     def extract_text(self):
#         doc = fitz.open(self.pdf_path)
#         pages = [page.get_text() for page in doc][:20]  
#         print(len(pages))
#         return ["\n".join(pages[i:i+self.chunk_size]) for i in range(0, len(pages), self.chunk_size)]

#     def extract_actionable_steps(self, text_chunk):
#         prompt = (
#             f"""
#             Extract only the most precise and actionable steps from the following text in JSON format.
#             Additionally, provide detailed information for each step to illustrate its real-life application.
#             The response should be a valid JSON list where each item is a dictionary containing:

#             - "step": The actionable step.
#             - "description": A clear explanation of what the step means.
#             - "example": A real-life example demonstrating the step in action.
#             - "hypothetical_situation": A hypothetical scenario where this step would be relevant.
#             - "recommended_response": The best response or course of action **specifically aligned with the actionable step** to handle the given situation effectively.

#             Ensure there is no extra text outside the JSON format.

#             Text:
#             {json.dumps(text_chunk)}

#             Preferred JSON structure:

#             ```json
#             {{
#                 "steps": [
#                     {{
#                         "step": "Actionable step 1",
#                         "description": "Clear description about the step",
#                         "example": "Real-life example demonstrating the step",
#                         "hypothetical_situation": "A hypothetical situation based on the extracted step",
#                         "recommended_response": "The best response specifically aligned with this step to handle the situation effectively"
#                     }},
#                     {{
#                         "step": "Actionable step 2",
#                         "description": "Clear description about the step",
#                         "example": "Real-life example demonstrating the step",
#                         "hypothetical_situation": "A hypothetical situation based on the extracted step",
#                         "recommended_response": "The best response specifically aligned with this step to handle the situation effectively"
#                     }}
#                 ]
#             }}
#             ```
#             """
#         )

#         response = self.model.invoke([HumanMessage(content=prompt)])
#         new_data = extract_json_from_markdown(response.content)
#         self.actionable_steps = new_data

#         if not isinstance(new_data, dict) or "steps" not in new_data or not isinstance(new_data["steps"], list):
#             raise ValueError("Invalid response format: Expected a dictionary with a 'steps' list.")

#         try:
#             with open(f"{self.pdf_name}/actionable_steps.json", "r") as f:
#                 existing_data = json.load(f)
#         except (FileNotFoundError, json.JSONDecodeError):
#             existing_data = {"steps": []}

#         if "steps" not in existing_data:
#             existing_data["steps"] = []

#         existing_steps = {step["step"] for step in existing_data["steps"]}

#         for step in new_data["steps"]:
#             if step["step"] not in existing_steps:
#                 existing_data["steps"].append(step)

#         self.save_json_file("actionable_steps.json", existing_data)
#         return new_data



#     def categorize_steps(self): 
#         try:
#             with open(f"{self.pdf_name}/categorized_steps.json", "r") as f:
#                 self.categorized_steps = json.load(f)
#         except (FileNotFoundError, json.JSONDecodeError):
#             self.categorized_steps = {}

#         if "steps" not in self.actionable_steps or not isinstance(self.actionable_steps["steps"], list):
#             raise ValueError("Invalid format: Expected a dictionary with a 'steps' key containing a list.")

#         actionable_steps = self.actionable_steps["steps"]
#         steps_only = [item["step"] for item in actionable_steps]

#         prompt = (
#             f"""
#             Categorize the following actionable steps into broad topics while considering the previously categorized steps.
#             - If a step fits into an existing category, append it to that category.
#             - If a step does not fit any existing category, create a new category and add the step.
#             - Ensure all previously categorized steps remain unchanged except for appending relevant new steps.

#             Previously Categories:
#             {list(self.categorized_steps.keys())}

#             New Actionable Steps:
#             {json.dumps(steps_only, indent=4)}

#             Preferred JSON structure:
#             ```json
#             {{
#                 "Category 1": [
#                     "Step 1",
#                     "Step 2"
#                 ],
#                 "Category 2": [
#                     "Step 3",
#                     "Step 4"
#                 ]
#             }}
#             ```
#             """
#         )

#         response = self.model.invoke([HumanMessage(content=prompt)])
#         new_categories = extract_json_from_markdown(response.content)

#         if not isinstance(new_categories, dict):
#             raise ValueError("Categorization response is not a valid dictionary.")

#         for category, steps in new_categories.items():
#             if not isinstance(steps, list):
#                 raise ValueError(f"Steps under {category} are not a list.")

#             if category in self.categorized_steps:
#                 existing_steps = {item["step"] for item in self.categorized_steps[category]}
#                 new_steps = [step for step in steps if step not in existing_steps]
#                 self.categorized_steps[category].extend(
#                     {
#                         "step": step,
#                         **next(
#                             (
#                                 {
#                                     "example": item.get("example", ""),
#                                     "description": item.get("description", ""),
#                                     "hypothetical_situation": item.get("hypothetical_situation", ""),
#                                     "recommended_response": item.get("recommended_response", ""),
#                                 }
#                                 for item in actionable_steps
#                                 if item["step"] == step
#                             ),
#                             {"example": "", "description": "", "hypothetical_situation": "", "recommended_response": ""},
#                         ),
#                     }
#                     for step in new_steps
#                 )
#             else:
#                 self.categorized_steps[category] = [
#                     {
#                         "step": step,
#                         **next(
#                             (
#                                 {
#                                     "example": item.get("example", ""),
#                                     "description": item.get("description", ""),
#                                     "hypothetical_situation": item.get("hypothetical_situation", ""),
#                                     "recommended_response": item.get("recommended_response", ""),
#                                 }
#                                 for item in actionable_steps
#                                 if item["step"] == step
#                             ),
#                             {"example": "", "description": "", "hypothetical_situation": "", "recommended_response": ""},
#                         ),
#                     }
#                     for step in steps
#                 ]

#         self.save_json_file("categorized_steps.json", self.categorized_steps)
#         return new_categories

#     def order_hierarchy(self):
#         prompt = (
#             f"""
#         Given the following list of topics, arrange them in a logical learning hierarchy.
#         The ordering should reflect the most natural progression for understanding the subject, where foundational topics come first, followed by intermediate, and then advanced topics.
#         The output must be a **structured sequence**, ensuring that each topic is positioned based on its prerequisites and dependencies.

#         Return only a JSON array of the correctly ordered topics with no extra text.

#         Topics:
#         {json.dumps(list(self.categorized_steps.keys()))}

#         Preferred JSON format:
#         ["Fundamental Topic", "Intermediate Topic", "Advanced Topic"]
#         """
#     )
      
#         response = self.model.invoke([HumanMessage(content=prompt)])
#         ordered_topics = json.loads(response.content)

#         ordered_steps = {topic: self.categorized_steps[topic] for topic in ordered_topics if topic in self.categorized_steps}

#         self.save_json_file("ordered_steps.json", ordered_steps)
    
#     def generate_real_life_examples(self,categorized_steps):
#         prompt = (
#         f"""
#         Provide real-life examples for each actionable step under their respective categories.
#         The response should be a JSON object where each key is a category, and its value is a list of dictionaries.
#         Each dictionary should contain a step and its corresponding real-life example.
#         Ensure there is no extra text outside the JSON format.

#         Categorized Steps:
#         {json.dumps(categorized_steps)}
#         Preferred Markdown structure:
#         ```json
#         {{
#         "Category1": [
#             {{"step": "Step 1", "Real-life example": "Example 1"}},
#             {{"step": "Step 2", "Real-life example": "Example 2"}}
#         ],
#         "Category2": [
#             {{"step": "Step 3", "Real-life example": "Example 3"}},
#             {{"step": "Step 4", "Real-life example": "Example 4"}}
#         ]
#         }}
#         """
#         )
#         response = self.model.invoke([HumanMessage(content=prompt)])
#         return extract_json_from_markdown(response.content)
    
#     def merge_real_life_examples(self, new_examples):
#             for category, examples in new_examples.items():
#                 if category in self.real_life_examples:
#                     self.real_life_examples[category].extend(examples)
#                 else:
#                     self.real_life_examples[category] = examples

#             self.save_json_file("real_life_examples.json", self.real_life_examples)
            
#     def process_book(self):
#         text_chunks = self.extract_text()
#         for chunk in text_chunks:
#             structured_chunk = self.process_chunk(chunk)
#             self.structured_data.append(structured_chunk)
        
#         with open("structured_data.json", "w") as f:
#             json.dump(self.structured_data, f, indent=4)
#         print("Processing complete.")

    
# def run_process(pdf_path):
#     processor = BookistProcessor(pdf_path)
#     hierarchy = processor.process_book()
#     print("Final Structured Data:", json.dumps(hierarchy, indent=2))

# run_process("TheLeanStartup.pdf")


import os
from dotenv import load_dotenv
from src.processor import BookistProcessor

load_dotenv()

def main():
    pdf_path = "TheLeanStartup.pdf"
    processor = BookistProcessor(pdf_path)
    text_chunks = processor.extract_text()
    processor.process(text_chunks)

if __name__ == "__main__":
    main()