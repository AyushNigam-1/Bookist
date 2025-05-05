import fitz
import json
from markdown_it import MarkdownIt
import re
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.cluster import DBSCAN
import os
import json
from collections import Counter
from unstructured.partition.pdf import partition_pdf

# def extract_text_from_pdf(pdf_path, chunk_size=3):
#     doc = fitz.open(pdf_path)
#     pages = [page.get_text() for page in doc][:30]  
#     print(pages)
#     return ["\n".join(pages[i:i+chunk_size]) for i in range(0, len(pages), chunk_size)]

# import fitz  # PyMuPDF
# import os
# import json
# from collections import Counter

def extract_text_from_pdf(pdf_path, output_json="structured_output.json", image_dir="extracted_images",max_pages=5):
        print("started")
        os.makedirs(image_dir, exist_ok=True)
        elements = partition_pdf(pdf_path, extract_images=True,max_pages=max_pages)
        print(elements)

        md = ""
        for el in elements:
            if el.category == "Title":
                md += f"# {el.text}\n\n"
            elif el.category == "Header":
                md += f"## {el.text}\n\n"
            elif el.category == "NarrativeText":
                md += f"{el.text}\n\n"
            elif el.category == "Image":
                md += f"![{el.metadata.caption or 'Image'}]({el.metadata.image_path})\n\n"

        with open("output.md", "w", encoding="utf-8") as f:
            f.write(md)
        # Step 1: Extract text elements with unstructured
        # elements = partition_pdf(filename=pdf_path, extract_images_in_pdf=False, max_pages=max_pages)
        # output = []
        # for idx, el in enumerate(elements):
        #     if el.text:
        #         output.append({
        #             "type": el.category.lower(),
        #             "text": el.text.strip()
        #         })
        #         print(f"Processed element {idx + 1}/{len(elements)}")

        # print("elements",elements)
        # # Step 2: Extract images with PyMuPDF
        # doc = fitz.open(pdf_path)
        # for i, page in enumerate(doc):
        #     img_list = page.get_images(full=True)
        #     for j, img in enumerate(img_list):
        #         xref = img[0]
        #         base_image = doc.extract_image(xref)
        #         img_bytes = base_image["image"]
        #         img_ext = base_image["ext"]
        #         img_path = os.path.join(image_dir, f"page_{i+1}_img_{j+1}.{img_ext}")
        #         with open(img_path, "wb") as f:
        #             f.write(img_bytes)
        #         output.append({
        #             "type": "image",
        #             "page": i + 1,
        #             "path": img_path
        #         })

        # # Step 3: Save output as JSON
        # with open(output_json, "w", encoding="utf-8") as f:
        #     json.dump(output, f, ensure_ascii=False, indent=2)

        # print("Extraction complete. Output saved to", output_json)

# Example usage:
# extract_structured_content("your_book.pdf")



def extract_json_from_markdown(markdown_text):
    md = MarkdownIt()
    tokens = md.parse(markdown_text)

    for token in tokens:
        if token.type == "fence" :
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

def remove_similar_insights(insights, threshold=0.65):
    if not insights:
        return []
    
    model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
    embeddings = model.encode(insights)

    clustering = DBSCAN(eps=1-threshold, min_samples=1, metric='cosine').fit(embeddings)

    unique_insights = {}
    for i, label in enumerate(clustering.labels_):
        if label not in unique_insights:
            unique_insights[label] = insights[i]
    
    return list(unique_insights.values())