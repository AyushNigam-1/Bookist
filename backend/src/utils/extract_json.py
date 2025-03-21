import json
from markdown_it import MarkdownIt

def extract_json_from_markdown(markdown_text):
    md = MarkdownIt()
    tokens = md.parse(markdown_text)
    
    for token in tokens:
        if token.type == "fence" and token.info.strip() == "json":
            return json.loads(token.content)

    raise ValueError("No valid JSON block found in the Markdown")