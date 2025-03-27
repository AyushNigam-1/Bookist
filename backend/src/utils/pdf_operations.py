import fitz
import json
from markdown_it import MarkdownIt
import re

def extract_text_from_pdf(pdf_path, chunk_size=5):
    doc = fitz.open(pdf_path)
    pages = [page.get_text() for page in doc][:10]  
    return ["\n".join(pages[i:i+chunk_size]) for i in range(0, len(pages), chunk_size)]

def extract_json_from_markdown(markdown_text):
    md = MarkdownIt()
    tokens = md.parse(markdown_text)

    for token in tokens:
        if token.type == "fence" and token.info.strip().lower() == "json":
            content = token.content.strip()  
            content = clean_json_string(content)  # Clean the extracted JSON

            try:
                return json.loads(content)
            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON format: {e}\nRaw JSON: {repr(content)}")

def clean_json_string(json_string):
    json_string = json_string.replace("\t", " ")  # Remove tabs
    json_string = json_string.replace("\r", "")  # Remove carriage returns
    json_string = re.sub(r"[\x00-\x1F\x7F]", "", json_string)  # Remove hidden control characters
    return json_string.strip()

