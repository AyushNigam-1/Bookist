from langchain.schema import HumanMessage
from src.utils.pdf_operations import extract_json_from_markdown
from src.utils.file_operations import save_json_file ,load_json_file
from src.utils.prompts import step_extraction_prompt
from src.components.duplicate_removel import remove_duplicate_steps
def extract_actionable_steps( folder_path, model, text_chunk):
    prompt = step_extraction_prompt(text_chunk)
    print(prompt)
    response = model.invoke([HumanMessage(content=prompt)])
    print(response.content)
    new_data = extract_json_from_markdown(response.content)
    print(new_data)
    if not isinstance(new_data, dict) or "steps" not in new_data or not isinstance(new_data["steps"], list):
        raise ValueError("Invalid response format: Expected a dictionary with a 'steps' list.")

    existing_data = load_json_file(folder_path ,"actionable_steps.json" , {"steps": []})

    existing_steps = {step["step"] for step in existing_data["steps"]}

    for step in new_data["steps"]:
        if step["step"] not in existing_steps:
            existing_data["steps"].append(step)

    save_json_file(folder_path,"actionable_steps.json", existing_data)
    remove_duplicate_steps(folder_path,"actionable_steps.json")
    return new_data
