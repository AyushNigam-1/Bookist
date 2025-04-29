from langchain.schema import HumanMessage
from src.utils.pdf_operations import extract_json_from_markdown
from src.utils.file_operations import save_json_file, load_json_file
from src.utils.prompts import categorization_prompt

def categorize_steps(folder_path, actionable_steps, categories, model):
    categories_dict = load_json_file("", "categories.json", {})

    subcategories = {key: value
    for category in categories
    for key, value in categories_dict[category]["subcategories"].items()
    }

    categorized_steps = load_json_file(folder_path, "categorized_steps.json", {})

    if "steps" not in actionable_steps or not isinstance(actionable_steps["steps"], list):
        raise ValueError("Invalid format: Expected a dictionary with a 'steps' key containing a list.")

    actionable_steps = actionable_steps["steps"]
    steps_only = [item["step"] for item in actionable_steps]

    prompt = categorization_prompt(subcategories.keys(), steps_only)
    response = model.invoke([HumanMessage(content=prompt)])
    new_categories = extract_json_from_markdown(response.content)

    if not isinstance(new_categories, dict):
        raise ValueError("Categorization response is not a valid dictionary.")
    print(new_categories)
    for category, steps in new_categories.items():
        if not isinstance(steps, list):
            raise ValueError(f"Steps under {category} are not a list.")

        if category in categorized_steps:
            print("if")
            existing_steps = {item["step"] for item in categorized_steps[category]['steps']}
            new_steps = [step for step in steps if step not in existing_steps]
            categorized_steps[category]['steps'].extend(
                {
                    "step": step,
                    **next(
                        (
                            {
                                "description": item.get("description", ""),
                                "detailed_breakdown": item.get("detailed_breakdown", ""),
                            }
                            for item in actionable_steps
                            if item["step"] == step
                        ),
                        {"description": "", "detailed_breakdown": ""},
                    ),
                }
                for step in new_steps
            )
        else:
            categorized_steps[category] = {}
            categorized_steps[category]['icon'] = subcategories[category]['icon']
            categorized_steps[category]['description'] = subcategories[category]['description']
            categorized_steps[category]['steps'] = [
                {
                    "step": step,
                    **next(
                        (
                            {
                                "description": item.get("description", ""),
                                "detailed_breakdown": item.get("detailed_breakdown", ""),
                            }
                            for item in actionable_steps
                            if item["step"] == step
                        ),
                        {"description": "", "detailed_breakdown": ""},
                    ),
                }
                for step in steps
            ]

    save_json_file(folder_path, "categorized_steps.json", categorized_steps)
    return categorized_steps
