# import fitz  # PyMuPDF
# import nltk
# import spacy
# import faiss
# import os
# import numpy as np
# import networkx as nx
# import torch

# torch_dtype = torch.float16
# from nltk.tokenize import sent_tokenize, word_tokenize
# from sentence_transformers import SentenceTransformer
# from bertopic import BERTopic
# from llama_cpp import Llama
# from transformers import pipeline

# nltk.download('punkt')
# nlp = spacy.load("en_core_web_sm")

# class BookProcessor:
#     def __init__(self, pdf_path):
#         self.pdf_path = pdf_path
#         self.text = ""
#         self.sentences = []
#         self.embeddings = None
#         self.index = None
#         self.key_learnings = []
#         self.graph = nx.DiGraph()
#         self.topics = []
#         self.qa_model = pipeline("question-answering", model="deepset/roberta-base-squad2", device=0, torch_dtype=torch_dtype)
#         self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0, torch_dtype=torch_dtype)

#     # def extract_text(self):
#     #     doc = fitz.open(self.pdf_path)
#     #     self.text = "\n".join([page.get_text() for page in doc])
#     #     self.sentences = sent_tokenize(self.text)
#     #     with open("text.txt", "w", encoding="utf-8") as f:
#     #         f.write(self.text)
#     def extract_text(self):
#         doc = fitz.open(self.pdf_path)
#         max_pages = min(40, len(doc))
#         self.text = "\n".join([doc[i].get_text() for i in range(max_pages)])
#         self.sentences = sent_tokenize(self.text)
#         with open("text.txt", "w", encoding="utf-8") as f:
#             f.write(self.text)


#     # def generate_embeddings(self, model_name="all-mpnet-base-v2"):
#     #     if os.path.exists("book_index.faiss"):
#     #         self.index = faiss.read_index("book_index.faiss")
#     #     else:
#     #         model = SentenceTransformer(model_name, device="cpu")  # Force CPU for embeddings
#     #         self.embeddings = model.encode(self.sentences, convert_to_numpy=True, show_progress_bar=True, batch_size=16)
#     #         dimension = self.embeddings.shape[1]
#     #         self.index = faiss.IndexFlatL2(dimension)
#     #         self.index.add(self.embeddings)
#     #         faiss.write_index(self.index, "book_index.faiss")

#     # def summarize_text(self):
#     #     key_sentences = self.extract_key_sentences()
#     #     summary = self.summarizer(key_sentences, max_length=500, min_length=250, do_sample=False)
#     #     self.key_learnings = summary[0]['summary_text']

#     #     self.key_learnings = " ".join(summaries)
        
#     #     with open("summaries.txt", "w", encoding="utf-8") as f:
#     #         f.write(self.key_learnings)


#     def create_learning_hierarchy(self):
#         for sentence in self.key_learnings:
#             doc = nlp(sentence)
#             for token in doc:
#                 if token.dep_ in ["nsubj", "dobj"]:
#                     self.graph.add_edge(token.head.text, token.text)
#         nx.write_gpickle(self.graph, "learning_hierarchy.gpickle")

#     def segment_into_topics(self):
#         topic_model = BERTopic()
#         self.topics, _ = topic_model.fit_transform(self.sentences)
#         topic_model.save("topics_model")
#         with open("topics.txt", "w", encoding="utf-8") as f:
#             f.write("\n".join(map(str, self.topics)))

#     def generate_hypothetical_situations(self, model_path="llama-3.gguf"):
#         llm = Llama(model_path=model_path, n_gpu_layers=30, n_ctx=2048)
#         prompt = "Generate hypothetical scenarios and responses based on these key learnings:\n" + "\n".join(self.key_learnings)
#         response = llm(prompt, max_tokens=500)
#         result = response["choices"][0]["text"]
#         with open("hypothetical_scenarios.txt", "w", encoding="utf-8") as f:
#             f.write(result)
#         return result

#     def interactive_qa(self, question):
#         return self.qa_model(question=question, context=self.text)

#     def process_book(self):
#         self.extract_text()
#         # self.generate_embeddings()
#         # self.summarize_text()
#         # self.create_learning_hierarchy()
#         # self.segment_into_topics()
#         # return self.generate_hypothetical_situations()

# if __name__ == "__main__":
#     processor = BookProcessor("1706.03762v7.pdf")
#     steps = processor.process_book()
#     print("\nHypothetical Scenarios:\n", steps)
    
#     # while True:
#     #     question = input("Ask the book a question (or type 'exit' to quit): ")
#     #     if question.lower() == 'exit':
#     #         break
#     #     answer = processor.interactive_qa(question)
#     #     print("Answer:", answer["answer"])


import fitz  # PyMuPDF
import json
from  langchain_groq import ChatGroq
from langchain.schema import HumanMessage
import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()

# Set API key for Groq
GROQ_API_KEY = os.getenv("groq_api_key")
class BookistProcessor:
    def __init__(self, pdf_path, model_name="llama-3.3-70b-versatile", chunk_size=5):
        self.pdf_path = pdf_path
        self.model = ChatGroq(model_name=model_name)
        self.chunk_size = chunk_size
        self.actionable_steps = []
        self.categorized_steps = {}

    def extract_text(self):
        doc = fitz.open(self.pdf_path)
        pages = [page.get_text() for page in doc][:10]  
        return ["\n".join(pages[i:i+self.chunk_size]) for i in range(0, len(pages), self.chunk_size)]

    def extract_actionable_steps(self, text_chunk):
        # file_path = "actionable_steps.json"

        # if os.path.exists(file_path):
        #     with open(file_path, "r", encoding="utf-8") as file:
        #         return json.load(file)
        prompt = (
        f"Extract only the most precise and actionable steps from the following text. "
        "Do not include explanations, general advice, or background information—focus purely on concrete actions. "
        "Present the steps in an unordered list format without any introductory or concluding text.\n\n"
        "Text:\n\n"
        f"{text_chunk}\n\n"
        "Response Format Example:\n"
        "- [Actionable Step 1]\n"
        "- [Actionable Step 2]\n"
        "- [Actionable Step 3]\n"
        "- [Actionable Step 4]"
        )
        response = self.model.invoke([HumanMessage(content=prompt)])
        return response.content.strip()

    def categorize_steps(self):
        prompt = (
            "Categorize the following actionable steps into broad, well-defined topics. "
            "Ensure the topics are meaningful, distinct, and logically grouped. "
            "Each topic should be concise and clearly labeled, followed by the relevant steps under it. "
            "Do not add any extra explanation—just the categorized steps in a structured format.\n\n"
            f"Actionable Steps:\n{json.dumps(self.actionable_steps)}\n\n"
            "Response Format Example:\n"
            "**[Category 1]**\n"
            "- Step 1\n"
            "- Step 2\n\n"
            "**[Category 2]**\n"
            "- Step 3\n"
            "- Step 4\n\n"
            "**[Category 3]**\n"
            "- Step 5\n"
            "- Step 6"
        )
        # print(prompt)
        response = self.model.invoke([HumanMessage(content=prompt)])
        return response.content.strip()


    def order_hierarchy(self):
        prompt = (
            "Rearrange the following topics in a logical, step-by-step order. "
            "Ensure the sequence flows naturally, prioritizing foundational topics before advanced ones. "
            "Maintain clarity and coherence in the structure without altering the content. "
            "Return only the reordered topics without extra commentary.\n\n"
            f"Topics to Arrange:\n{json.dumps(self.categorized_steps)}\n\n"
            "Response Format Example:\n"
            "1. [Topic 1]\n"
            "2. [Topic 2]\n"
            "3. [Topic 3]\n"
            "4. [Topic 4]"
        )
        response = self.model.invoke([HumanMessage(content=prompt)])
        return response.content.strip()

    def process_book(self):
        text_chunks = self.extract_text()
        
        for chunk in text_chunks:
            extracted_steps = self.extract_actionable_steps(chunk)
            self.actionable_steps.extend(extracted_steps.split("\n"))
        
        with open("actionable_steps.json", "w") as f:
            json.dump(self.actionable_steps, f, indent=4)

        self.categorized_steps = self.categorize_steps()
        with open("categorized_steps.json", "w") as f:
            json.dump(self.categorized_steps, f, indent=4)
        
        ordered_hierarchy = self.order_hierarchy()
        with open("ordered_hierarchy.json", "w") as f:
            json.dump(ordered_hierarchy, f, indent=4)
        
        # return ordered_hierarchy
    
    
def run_process(pdf_path):
    processor = BookistProcessor(pdf_path)
    hierarchy = processor.process_book()
    print("Final Structured Data:", json.dumps(hierarchy, indent=2))

run_process("TheLeanStartup.pdf")