import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import DBSCAN

import numpy as np
import re
from src.utils.file_operations import load_json_file


# def preprocess_text(text):
#     text = text.lower()
#     text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
#     text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
#     return text

def remove_similar_insights(insights, threshold=0.65):
    if not insights:
        return []

    # insights = [preprocess_text(insight) for insight in insights]
    
    model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
    embeddings = model.encode(insights)

    clustering = DBSCAN(eps=1-threshold, min_samples=1, metric='cosine').fit(embeddings)

    unique_insights = {}
    for i, label in enumerate(clustering.labels_):
        if label not in unique_insights:
            unique_insights[label] = insights[i]
    
    return list(unique_insights.values())

# Example usage
insights = [
    "Consistency is key to success.",
    "Being consistent leads to success.",
    "Success comes from regular effort.",
    "Exercise daily for a healthy life.",
    "Working out every day keeps you healthy.",
    "Health improves with daily exercise.",
    "Time management is crucial for productivity.",
    "Managing time well increases productivity.",
    "Prioritizing tasks helps manage time better.",
    "Reading books enhances knowledge.",
    "Gaining knowledge is easier through reading books.",
    "Books are a great source of learning."
]
['Consistency is key to success.', 'Being consistent leads to success.', 'Success comes from regular effort.', 'Exercise daily for a healthy life.', 'Working out every day keeps you healthy.', 'Health improves with daily exercise.', 'Time management is crucial for productivity.', 'Managing time well increases productivity.', 'Prioritizing tasks helps manage time better.', 'Reading books enhances knowledge.', 'Gaining knowledge is easier through reading books.', 'Books are a great source of learning.']
steps = load_json_file("the-rudest-book-ever-shwetabh-gangwar_removed","actionable_steps.json",[])
steps = [step["step"] for step in steps["steps"]]
unique_insights = remove_similar_insights(steps)
print(unique_insights)
# print(steps)

['Earn Specialness Through Achievements', 'Redirect External Validation', 'Flip the Script on Motivation', 'Reframe Rejections as Normal', 'Avoid Being Motivated by Rejection', 'View People as Complex and Unpredictable', "Adopt a 'People Are Weird' Mindset", 'Prioritize Data Over First Impressions', 'Become More Logical, Less Emotional', 'Approach People with Caution', 'Recognize that People are Unpredictable', 'Reframe Failure as a Normal Part of Life', 'Clarify Your Motivations', 'Distinguish Between Traditional and Real Winning', 'Earn Specialness', 'Focus on Personal Achievements', 'Flip the Script', 'View Rejections as Normal', 'Reframe Negative Self-Perception', 'Find Motivation from Within', 'Perceive People as Complex and Unique', 'Rely on Data, Not Impressions', 'Reframe Failure as Normal']

['earn specialness through achievements', 'redirect external validation', 'flip the script on motivation', 'reframe rejections as normal', 'avoid being motivated by rejection', 'view people as complex and unpredictable', 'adopt a people are weird mindset', 'prioritize data over first impressions', 'become more logical less emotional', 'approach people with caution', 'reframe failure as a normal part of life', 'distinguish between traditional and real winning', 'flip the script', 'reframe negative selfperception', 'reframe failure as normal']