import fitz

def extract_text_from_pdf(pdf_path, chunk_size=5):
    doc = fitz.open(pdf_path)
    pages = [page.get_text() for page in doc][:20]  
    return ["\n".join(pages[i:i+chunk_size]) for i in range(0, len(pages), chunk_size)]