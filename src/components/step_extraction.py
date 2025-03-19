import json
from langchain.schema import HumanMessage
from src.utils.extract_json import extract_json_from_markdown
from src.utils.file_operations import save_json_file ,load_json_file

def extract_actionable_steps( folder_path, model, text_chunk):
    prompt = (
            f"""
            Extract only the most precise and actionable steps from the following text in JSON format.
            Additionally, provide detailed information for each step to illustrate its real-life application.
            The response should be a valid JSON list where each item is a dictionary containing:

            - "step": The actionable step.
            - "description": A clear explanation of what the step means.
            - "example": A real-life example demonstrating the step in action.
            - "hypothetical_situation": A hypothetical scenario where this step would be relevant.
            - "recommended_response": The best response or course of action **specifically aligned with the actionable step** to handle the given situation effectively.

            Ensure there is no extra text outside the JSON format.

            Text:
            {json.dumps(text_chunk)}

            Preferred JSON structure:

            ```json
            {{
                "steps": [
                    {{
                        "step": "Actionable step 1",
                        "description": "Clear description about the step",
                        "example": "Real-life example demonstrating the step",
                        "hypothetical_situation": "A hypothetical situation based on the extracted step",
                        "recommended_response": "The best response specifically aligned with this step to handle the situation effectively"
                    }},
                    {{
                        "step": "Actionable step 2",
                        "description": "Clear description about the step",
                        "example": "Real-life example demonstrating the step",
                        "hypothetical_situation": "A hypothetical situation based on the extracted step",
                        "recommended_response": "The best response specifically aligned with this step to handle the situation effectively"
                    }}
                ]
            }}
            ```
            """
        )
    response = model.invoke([HumanMessage(content=prompt)])
    new_data = extract_json_from_markdown(response.content)
    
    if not isinstance(new_data, dict) or "steps" not in new_data or not isinstance(new_data["steps"], list):
        raise ValueError("Invalid response format: Expected a dictionary with a 'steps' list.")

    existing_data = load_json_file(folder_path ,"actionable_steps.json" , {"steps": []})

    existing_steps = {step["step"] for step in existing_data["steps"]}

    for step in new_data["steps"]:
        if step["step"] not in existing_steps:
            existing_data["steps"].append(step)

    save_json_file(folder_path,"actionable_steps.json", existing_data)
    return new_data
