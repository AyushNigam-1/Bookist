import fitz
import json
from markdown_it import MarkdownIt
import re
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.cluster import DBSCAN

def extract_text_from_pdf(pdf_path, chunk_size=5):
    doc = fitz.open(pdf_path)
    pages = [page.get_text() for page in doc][:50]  
    print(pages)
    return ["\n".join(pages[i:i+chunk_size]) for i in range(0, len(pages), chunk_size)]

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