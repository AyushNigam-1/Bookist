import fitz  # PyMuPDF 


def extract_text(pdf_path , chunk_size):
        doc = fitz.open(pdf_path)
        pages = [page.get_text() for page in doc][:10]  
        print(len(pages))
        return ["\n".join(pages[i:i+chunk_size]) for i in range(0, len(pages), chunk_size)]