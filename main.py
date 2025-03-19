import os
from dotenv import load_dotenv
from src.processor import BookistProcessor

load_dotenv()

def main():
    root_folder = os.getcwd()
    pdf_path = os.path.join(root_folder, "TheLeanStartup.pdf")
    processor = BookistProcessor(pdf_path)
    text_chunks = processor.extract_text()
    processor.process(text_chunks)

if __name__ == "__main__":
    main()