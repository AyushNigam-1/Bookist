import os
from langchain_groq import ChatGroq
from src.components import extract_text_from_pdf
from src.components import extract_actionable_steps
from src.components import categorize_steps
from src.components import order_hierarchy

class BookistProcessor:
    def __init__(self, pdf_path, model_name="llama-3.3-70b-versatile", chunk_size=5):
        self.pdf_name = os.path.splitext(os.path.basename(pdf_path))[0]
        self.pdf_path = pdf_path
        self.model = ChatGroq(model_name=model_name)
        self.chunk_size = chunk_size
        self.folder_path = os.path.join(os.getcwd(), self.pdf_name)
    
    def extract_text(self):
        return extract_text_from_pdf(self.pdf_path, self.chunk_size)
    
    def process(self, text_chunks):
        for chunk in text_chunks:
            extract_actionable_steps(self.pdf_name, self.folder_path, self.model, chunk)
            categorize_steps(self.folder_path, self.model)
            order_hierarchy(self.folder_path, self.model)