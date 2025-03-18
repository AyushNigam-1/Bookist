import json
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from utils.extract_json import extract_json_from_markdown
from utils.file_operations import load_json_file, save_json_file

def extract_actionable_steps(pdf_name, folder_path, model, text_chunk):
    prompt = f"""
    Extract only the most precise and actionable steps in JSON format.
    {json.dumps(text_chunk)}
    """
    response = model.invoke([HumanMessage(content=prompt)])
    new_data = extract_json_from_markdown(response.content)
    existing_data = load_json_file(folder_path, "actionable_steps.json", {"steps": []})
    existing_steps = {step["step"] for step in existing_data["steps"]}
    
    for step in new_data["steps"]:
        if step["step"] not in existing_steps:
            existing_data["steps"].append(step)
    
    save_json_file(folder_path, "actionable_steps.json", existing_data)
    return new_data
