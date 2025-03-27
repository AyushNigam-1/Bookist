import os
from dotenv import load_dotenv
from src.processor import BookistProcessor
from src.utils.file_operations import load_json_file
load_dotenv()

def main():
    root_folder = os.getcwd()
    pdf_path = os.path.join(root_folder, "The Art of Being ALONE Solitude Is My HOME, Loneliness Was My Cage_removed.pdf")
    processor = BookistProcessor(pdf_path ,"The Lean Startup" ,'Eric Ries', "The Lean Startup by Eric Ries is a guide to building and scaling startups efficiently. It introduces the **Build-Measure-Learn framework, emphasizing rapid experimentation, customer feedback, and iterative development over rigid planning. The book advocates for creating a **Minimum Viable Product (MVP)** to test ideas quickly, reducing waste and increasing adaptability. It’s essential reading for entrepreneurs looking to innovate with minimal risk and maximize growth.","https://cdn2.penguin.com.au/covers/original/9780670921607.jpg","Self-Help & Personal Development" )
    # steps_only = load_json_file("","categories.json",{})["Business & Entrepreneurship"]
    # ["Business & Entrepreneurship"]
    # print(steps_only)
    processor.process()

if __name__ == "__main__":
    main()