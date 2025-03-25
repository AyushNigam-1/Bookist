import fitz
import json
from markdown_it import MarkdownIt

def extract_text_from_pdf(pdf_path, chunk_size=5):
    doc = fitz.open(pdf_path)
    pages = [page.get_text() for page in doc][:20]  
    return ["\n".join(pages[i:i+chunk_size]) for i in range(0, len(pages), chunk_size)]

def extract_json_from_markdown(markdown_text):
    md = MarkdownIt()
    tokens = md.parse(markdown_text)
    
    for token in tokens:
        if token.type == "fence" and token.info.strip() == "json":
            return json.loads(token.content)

    raise ValueError("No valid JSON block found in the Markdown")