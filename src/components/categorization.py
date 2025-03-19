import json
from langchain.schema import HumanMessage
from src.utils.extract_json import extract_json_from_markdown
from src.utils.file_operations import  save_json_file , load_json_file


def categorize_steps(folder_path,actionable_steps, model):
    categorized_steps = load_json_file(folder_path ,"categorized_steps.json" , {} )

    if "steps" not in actionable_steps or not isinstance(actionable_steps["steps"], list):
        raise ValueError("Invalid format: Expected a dictionary with a 'steps' key containing a list.")

    actionable_steps = actionable_steps["steps"]
    steps_only = [item["step"] for item in actionable_steps]

    prompt = (
        f"""
        Categorize the following actionable steps into broad topics while considering the previously categorized steps.
        - If a step fits into an existing category, append it to that category.
        - If a step does not fit any existing category, create a new category and add the step.
        - Ensure all previously categorized steps remain unchanged except for appending relevant new steps.

        Previously Categories:
        {list(categorized_steps.keys())}

        New Actionable Steps:
        {json.dumps(steps_only, indent=4)}

        Preferred JSON structure:
        ```json
        {{
            "Category 1": [
                "Step 1",
                "Step 2"
            ],
            "Category 2": [
                "Step 3",
                "Step 4"
            ]
        }}
        ```
        """
    )

    response = model.invoke([HumanMessage(content=prompt)])
    new_categories = extract_json_from_markdown(response.content)

    if not isinstance(new_categories, dict):
        raise ValueError("Categorization response is not a valid dictionary.")

    for category, steps in new_categories.items():
        if not isinstance(steps, list):
            raise ValueError(f"Steps under {category} are not a list.")

        if category in categorized_steps:
            existing_steps = {item["step"] for item in categorized_steps[category]}
            new_steps = [step for step in steps if step not in existing_steps]
            categorized_steps[category].extend(
                {
                    "step": step,
                    **next(
                        (
                            {
                                "example": item.get("example", ""),
                                "description": item.get("description", ""),
                                "hypothetical_situation": item.get("hypothetical_situation", ""),
                                "recommended_response": item.get("recommended_response", ""),
                            }
                            for item in actionable_steps
                            if item["step"] == step
                        ),
                        {"example": "", "description": "", "hypothetical_situation": "", "recommended_response": ""},
                    ),
                }
                for step in new_steps
            )
        else:
            categorized_steps[category] = [
                {
                    "step": step,
                    **next(
                        (
                            {
                                "example": item.get("example", ""),
                                "description": item.get("description", ""),
                                "hypothetical_situation": item.get("hypothetical_situation", ""),
                                "recommended_response": item.get("recommended_response", ""),
                            }
                            for item in actionable_steps
                            if item["step"] == step
                        ),
                        {"example": "", "description": "", "hypothetical_situation": "", "recommended_response": ""},
                    ),
                }
                for step in steps
            ]

    save_json_file(folder_path,"categorized_steps.json", categorized_steps)
    return categorized_steps

        