import json
import os

def load_json_file(folder, filename, default_value):
    file_path = os.path.join(folder, filename)
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default_value

def save_json_file(folder, filename, data):
    os.makedirs(folder, exist_ok=True)
    file_path = os.path.join(folder, filename)
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)