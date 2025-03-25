from langchain.schema import HumanMessage
from src.utils.file_operations import save_json_file
from src.utils.prompts import hierarchy_prompt
import json

def order_hierarchy( folder_name , categorized_steps,model):
    prompt = hierarchy_prompt(categorized_steps)
    print(prompt)
    response = model.invoke([HumanMessage(content=prompt)])
    ordered_topics = json.loads(response.content)
    print(ordered_topics)

    ordered_steps = {topic: categorized_steps[topic] for topic in ordered_topics if topic in categorized_steps}

    save_json_file(folder_name,"ordered_steps.json", ordered_steps)