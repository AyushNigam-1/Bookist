import json
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from utils.file_operations import load_json_file, save_json_file


def order_hierarchy(folder_path, model):
    categories = load_json_file(folder_path, "categorized_steps.json", {})
    prompt = f"""
    Order these topics in a logical learning hierarchy: {json.dumps(list(categories.keys()))}
    """
    response = model.invoke([HumanMessage(content=prompt)])
    ordered_topics = json.loads(response.content)
    ordered_steps = {topic: categories[topic] for topic in ordered_topics if topic in categories}
    save_json_file(folder_path, "ordered_steps.json", ordered_steps)