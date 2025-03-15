import fitz  # PyMuPDF 


def extract_text(self):
        doc = fitz.open(self.pdf_path)
        pages = [page.get_text() for page in doc][:40]  
        print(len(pages))
        return ["\n".join(pages[i:i+self.chunk_size]) for i in range(0, len(pages), self.chunk_size)]