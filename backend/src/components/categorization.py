import time
from langchain.schema import HumanMessage
from src.utils.pdf_operations import extract_json_from_markdown
from src.utils.file_operations import save_json_file, load_json_file
from src.utils.prompts import categorization_prompt

def categorize_steps(folder_path, actionable_steps, categories, model, max_retries=5, base_delay=2):
    attempt = 0

    while attempt < max_retries:
        try:
            categories_dict = load_json_file("", "categories.json", {})
            subcategories = {
                key: value
                for category in categories
                for key, value in categories_dict.get(category, {}).get("subcategories", {}).items()
            }

            categorized_steps = load_json_file(folder_path, "categorized_steps.json", {})

            if "steps" not in actionable_steps or not isinstance(actionable_steps["steps"], list):
                raise ValueError("Invalid format: Expected a dictionary with a 'steps' key containing a list.")

            steps_data = actionable_steps["steps"]
            steps_only = [item["step"] for item in steps_data]

            prompt = categorization_prompt(subcategories.keys(), steps_only)
            response = model.invoke([HumanMessage(content=prompt)])
            new_categories = extract_json_from_markdown(response.content)

            if not isinstance(new_categories, dict):
                raise ValueError("Categorization response is not a valid dictionary.")

            for category, steps in new_categories.items():
                if not isinstance(steps, list):
                    raise ValueError(f"Steps under {category} are not a list.")

                if category not in categorized_steps:
                    categorized_steps[category] = {
                        "icon": subcategories.get(category, {}).get("icon", ""),
                        "description": subcategories.get(category, {}).get("description", ""),
                        "steps": []
                    }

                existing_steps = {item["step"] for item in categorized_steps[category]["steps"]}
                new_steps = [step for step in steps if step not in existing_steps]

                categorized_steps[category]["steps"].extend(
                    {
                        "step": step,
                        **next(
                            (
                                {
                                    "description": item.get("description", ""),
                                    "detailed_breakdown": item.get("detailed_breakdown", ""),
                                }
                                for item in steps_data if item["step"] == step
                            ),
                            {"description": "", "detailed_breakdown": ""},
                        )
                    }
                    for step in new_steps
                )

            save_json_file(folder_path, "categorized_steps.json", categorized_steps)
            return categorized_steps  # ✅ Success

        except Exception as e:
            attempt += 1
            print(f"[Attempt {attempt}] Error in categorization: {e}")
            time.sleep(base_delay * attempt)

    print("❌ Categorization failed after max retries. Returning empty categories safely.")
    return {}
