import fitz  # PyMuPDF
import nltk
import spacy
import faiss
import os
import numpy as np
import networkx as nx
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
        self.qa_model = pipeline("question-answering", model="deepset/roberta-base-squad2")

    def extract_text(self):
        doc = fitz.open(self.pdf_path)
        self.text = "\n".join([page.get_text() for page in doc])
        self.sentences = sent_tokenize(self.text)

    def generate_embeddings(self, model_name="hkunlp/instructor-xl"):
        if os.path.exists("book_index.faiss"):
            self.index = faiss.read_index("book_index.faiss")
        else:
            model = SentenceTransformer(model_name)
            self.embeddings = model.encode(self.sentences, convert_to_numpy=True)
            dimension = self.embeddings.shape[1]
            self.index = faiss.IndexFlatL2(dimension)
            self.index.add(self.embeddings)
            faiss.write_index(self.index, "book_index.faiss")

    def summarize_text(self, num_sentences=5):
        summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
        summary = summarizer(self.text, max_length=150, min_length=50, do_sample=False)
        self.key_learnings = summary[0]['summary_text'].split('.')[:num_sentences]

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

    def generate_hypothetical_situations(self, model_path="llama-3.gguf"):
        llm = Llama(model_path=model_path)
        prompt = "Generate hypothetical scenarios and responses based on these key learnings:\n" + "\n".join(self.key_learnings)
        response = llm(prompt, max_tokens=500)
        return response["choices"][0]["text"]

    def interactive_qa(self, question):
        return self.qa_model(question=question, context=self.text)

    def process_book(self):
        self.extract_text()
        self.generate_embeddings()
        self.summarize_text()
        self.create_learning_hierarchy()
        self.segment_into_topics()
        return self.generate_hypothetical_situations()

if __name__ == "__main__":
    processor = BookProcessor("book.pdf")
    steps = processor.process_book()
    print("\nHypothetical Scenarios:\n", steps)
    
    # Interactive Q&A Example
    while True:
        question = input("Ask the book a question (or type 'exit' to quit): ")
        if question.lower() == 'exit':
            break
        answer = processor.interactive_qa(question)
        print("Answer:", answer["answer"])
