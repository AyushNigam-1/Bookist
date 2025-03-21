import json
from langchain.schema import HumanMessage
from src.utils.file_operations import save_json_file


def order_hierarchy( folder_name , categorized_steps,model):
    prompt = (
        f"""
    Given the following list of topics, arrange them in a logical learning hierarchy.
    The ordering should reflect the most natural progression for understanding the subject, where foundational topics come first, followed by intermediate, and then advanced topics.
    The output must be a **structured sequence**, ensuring that each topic is positioned based on its prerequisites and dependencies.

    Return only a JSON array of the correctly ordered topics with no extra text.

    Topics:
    {json.dumps(list(categorized_steps.keys()))}

    Preferred JSON format:
    ["Fundamental Topic", "Intermediate Topic", "Advanced Topic"]
    """
)
    
    response = model.invoke([HumanMessage(content=prompt)])
    ordered_topics = json.loads(response.content)

    ordered_steps = {topic: categorized_steps[topic] for topic in ordered_topics if topic in categorized_steps}

    save_json_file(folder_name,"ordered_steps.json", ordered_steps)