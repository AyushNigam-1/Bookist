import os
from langchain_groq import ChatGroq
from src.components.extract_text import extract_text
from src.components.step_extraction import extract_actionable_steps
from src.components.categorization import categorize_steps
from src.components.hierarchy import order_hierarchy

class BookistProcessor:
    def __init__(self, pdf_path, model_name="llama-3.3-70b-versatile", chunk_size=5):
        self.pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]
        self.pdf_path = pdf_path
        self.model = ChatGroq(model_name=model_name)
        self.chunk_size = chunk_size
        self.folder_path = os.path.join(os.getcwd(), self.pdf_name)
    
    def extract_text(self):
        return extract_text(self.pdf_path, self.chunk_size)
    
    def process(self, text_chunks):
        for chunk in text_chunks:
            extracted_steps = extract_actionable_steps(self.folder_path, self.model, chunk)
            categorized_steps = categorize_steps(self.folder_path,extracted_steps, self.model)
            order_hierarchy(self.folder_path,categorized_steps, self.model)