import json
# def step_extraction_prompt(text_chunk):
#     prompt = (
#             f"""
#             Extract only the most precise and actionable steps from the following text in JSON format.
#             Additionally, provide detailed information for each step to illustrate its real-life application.
#             The response should be a valid JSON list where each item is a dictionary containing:

#             - "step": The actionable step.
#             - "description": A clear explanation of what the step means.
#             - "example": A real-life example demonstrating the step in action.
#             - "hypothetical_situation": A hypothetical scenario where this step would be relevant.
#             - "recommended_response": The best response or course of action **specifically aligned with the actionable step** to handle the given situation effectively.

#             Ensure there is no extra text outside the JSON format.

#             Text:
#             {json.dumps(text_chunk)}

#             Preferred JSON structure:

#             ```json
#             {{
#                 "steps": [
#                     {{
#                         "step": "Actionable step 1",
#                         "description": "Clear description about the step",
#                         "example": "Real-life example demonstrating the step",
#                         "hypothetical_situation": "A hypothetical situation based on the extracted step",
#                         "recommended_response": "The best response specifically aligned with this step to handle the situation effectively"
#                     }},
#                     {{
#                         "step": "Actionable step 2",
#                         "description": "Clear description about the step",
#                         "example": "Real-life example demonstrating the step",
#                         "hypothetical_situation": "A hypothetical situation based on the extracted step",
#                         "recommended_response": "The best response specifically aligned with this step to handle the situation effectively"
#                     }}
#                 ]
#             }}
#             ```
#             """
#         )
#     return prompt

def step_extraction_prompt(text_chunk):
    markdown_example = """\
### 📌 Why This Matters
- Explanation of its real-world importance.

### 🚀 How to Apply
- Step 1: Do this
- Step 2: Do that

### ⚠️ Common Mistake
- A common mistake people make.

### ⚡ Instant Step
- One quick action to reinforce this step.

### 🧠 Memory Hack
- A short and effective trick to remember this."""

    prompt = f"""
  Extract only the **most practical, instantly actionable, and high-impact steps** from the following text in **JSON format**.  

    Each step must be **clear, easy to apply, and highly relevant to real life**.  

    **Each extracted step must include:**
    - **Step (Actionable & Clear Title)** → A short, direct name that defines the action.  
    - **Description (Simple & Concise Explanation)** → A clear and **straightforward** explanation of what this step means.  
    - **detailed_breakdown (Double-Encoded Markdown String)** → A **JSON string** containing a markdown block:  
        - 📌 **Why This Matters**: The real-world importance of this step.  
        - 🚀 **How to Apply**: A clear step-by-step guide for implementation.  
        - ⚠️ **Common Mistake**: A frequent mistake to avoid.  
        - ⚡ **Instant Step**: A small, immediate action for reinforcement.  
        - 🧠 **Memory Hack**: A short, effective trick (e.g., visualization, habit cue, or mental trigger) for better retention.  

    **JSON Output Example:**  

    ```json
    {{
        "steps": [
            {{
                "step": "Clear, Action-Oriented Step Title",
                "description": "A simple yet clear explanation of what this step means.",
                "detailed_breakdown": {repr(json.dumps(markdown_example))}
            }}
        ]
    }}
    ```

    **Text to process:**  
    {json.dumps(text_chunk)}

    **Return only the JSON output. No extra text.**
    """
    
    return prompt



def categorization_prompt(categories,steps_only):
    prompt = (
        f"""
        Categorize the following actionable steps into the predefined categories. 
        - Only use the given categories; do not create new ones.
        - If a step fits into an existing category, append it to that category.
        - If a step does not clearly belong to any category, return it under "Uncategorized".

        Categories:
        {categories}

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
    return prompt

def hierarchy_prompt(categorized_steps):
    prompt = (
        f"""
    Given the following list of topics, arrange them in a logical learning hierarchy.
    The ordering should reflect the most natural progression for understanding the subject, where foundational topics come first, followed by intermediate, and then advanced topics.
    The output must be a **structured sequence**, ensuring that each topic is positioned based on its prerequisites and dependencies.


    Topics:
    {json.dumps(list(categorized_steps.keys()))}

    Preferred JSON format:
    ["Fundamental Topic", "Intermediate Topic", "Advanced Topic"]
    **Return only a JSON array of the correctly ordered topics with no extra text.**
    """
)
    
    return prompt


