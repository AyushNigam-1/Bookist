import json
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from utils.extract_json import extract_json_from_markdown
from utils.file_operations import load_json_file, save_json_file
def categorize_steps(folder_path, model):
    actionable_steps = load_json_file(folder_path, "actionable_steps.json", {"steps": []})["steps"]
    prompt = f"""
    Categorize these actionable steps: {json.dumps(actionable_steps)}
    """
    response = model.invoke([HumanMessage(content=prompt)])
    new_categories = extract_json_from_markdown(response.content)
    save_json_file(folder_path, "categorized_steps.json", new_categories)
    return new_categories