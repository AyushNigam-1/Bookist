import fitz  # PyMuPDF
import nltk
import spacy
import faiss
import os
import numpy as np
import networkx as nx
import torch

torch_dtype = torch.float16
from nltk.tokenize import sent_tokenize, word_tokenize
from sentence_transformers import SentenceTransformer
from bertopic import BERTopic
from llama_cpp import Llama
from transformers import pipeline

nltk.download('punkt')
nlp = spacy.load("en_core_web_sm")

class BookProcessor:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.text = ""
        self.sentences = []
        self.embeddings = None
        self.index = None
        self.key_learnings = []
        self.graph = nx.DiGraph()
        self.topics = []
        self.qa_model = pipeline("question-answering", model="deepset/roberta-base-squad2", device=0, torch_dtype=torch_dtype)
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0, torch_dtype=torch_dtype)

    def extract_text(self):
        doc = fitz.open(self.pdf_path)
        self.text = "\n".join([page.get_text() for page in doc])
        self.sentences = sent_tokenize(self.text)
        with open("text.txt", "w", encoding="utf-8") as f:
            f.write(self.text)

    def generate_embeddings(self, model_name="all-mpnet-base-v2"):
        if os.path.exists("book_index.faiss"):
            self.index = faiss.read_index("book_index.faiss")
        else:
            model = SentenceTransformer(model_name, device="cpu")  # Force CPU for embeddings
            self.embeddings = model.encode(self.sentences, convert_to_numpy=True, show_progress_bar=True, batch_size=16)
            dimension = self.embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(self.embeddings)
            faiss.write_index(self.index, "book_index.faiss")

    def summarize_text(self):
        key_sentences = self.extract_key_sentences()
        summary = self.summarizer(key_sentences, max_length=500, min_length=250, do_sample=False)
        self.key_learnings = summary[0]['summary_text']

        self.key_learnings = " ".join(summaries)
        
        with open("summaries.txt", "w", encoding="utf-8") as f:
            f.write(self.key_learnings)


    def create_learning_hierarchy(self):
        for sentence in self.key_learnings:
            doc = nlp(sentence)
            for token in doc:
                if token.dep_ in ["nsubj", "dobj"]:
                    self.graph.add_edge(token.head.text, token.text)
        nx.write_gpickle(self.graph, "learning_hierarchy.gpickle")

    def segment_into_topics(self):
        topic_model = BERTopic()
        self.topics, _ = topic_model.fit_transform(self.sentences)
        topic_model.save("topics_model")
        with open("topics.txt", "w", encoding="utf-8") as f:
            f.write("\n".join(map(str, self.topics)))

    def generate_hypothetical_situations(self, model_path="llama-3.gguf"):
        llm = Llama(model_path=model_path, n_gpu_layers=30, n_ctx=2048)
        prompt = "Generate hypothetical scenarios and responses based on these key learnings:\n" + "\n".join(self.key_learnings)
        response = llm(prompt, max_tokens=500)
        result = response["choices"][0]["text"]
        with open("hypothetical_scenarios.txt", "w", encoding="utf-8") as f:
            f.write(result)
        return result

    def interactive_qa(self, question):
        return self.qa_model(question=question, context=self.text)

    def process_book(self):
        self.extract_text()
        self.generate_embeddings()
        self.summarize_text()
        # self.create_learning_hierarchy()
        # self.segment_into_topics()
        # return self.generate_hypothetical_situations()

if __name__ == "__main__":
    processor = BookProcessor("1706.03762v7.pdf")
    steps = processor.process_book()
    print("\nHypothetical Scenarios:\n", steps)
    
    # while True:
    #     question = input("Ask the book a question (or type 'exit' to quit): ")
    #     if question.lower() == 'exit':
    #         break
    #     answer = processor.interactive_qa(question)
    #     print("Answer:", answer["answer"])
