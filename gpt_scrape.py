# from playwright.sync_api import sync_playwright
# import pyperclip
# import time

# def chat_with_gpt(user_input):
#     with sync_playwright() as p:
#         browser = p.chromium.launch(headless=False)  # Set headless=True for background execution
#         page = browser.new_page()

#         # Open ChatGPT
#         page.goto("https://chat.openai.com/")

#         # Wait for ChatGPT to load
#         page.wait_for_selector("textarea")

#         # Type the user input
#         page.fill("textarea", user_input)

#         # Press Enter to send the message
#         page.keyboard.press("Enter")

#         # Wait for the response copy button to appear
#         page.wait_for_selector("button[data-testid='copy-turn-action-button']")
#         time.sleep(2)  # Ensures response is fully loaded

#         # Click the copy button
#         copy_button = page.locator("button[data-testid='copy-turn-action-button']")
#         copy_button.click()

#         # Wait a bit for text to be copied
#         time.sleep(1)

#         # Retrieve copied text from clipboard
#         response_text = pyperclip.paste()

#         # browser.close()
#         return response_text

# Example Usage
# user_query = "What is machine learning?"
# response = chat_with_gpt(user_query)
# print("ChatGPT Response:\n", response)

import time
import pyperclip
from playwright.sync_api import sync_playwright

class GPTChat:
    def chat_with_gpt(self, prompt):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False)
            page = browser.new_page()
            page.goto("https://chat.openai.com/")
            
            page.wait_for_selector("textarea", state="attached", timeout=60000)
            time.sleep(2)

            textarea_selector = "textarea"
            page.wait_for_selector(textarea_selector, state="visible", timeout=60000)
            page.fill(textarea_selector, prompt)
            page.keyboard.press("Enter")

            page.wait_for_selector("button[data-testid='copy-turn-action-button']", timeout=60000)
            time.sleep(2)

            copy_buttons = page.locator("button[data-testid='copy-turn-action-button']").all()
            if copy_buttons:
                copy_buttons[-1].click()

            time.sleep(1)
            response = pyperclip.paste()

            browser.close()
            return response



# Example Usage
# scraper = GPTScraper()
# response = scraper.chat_with_gpt("Hello, how are you?")
# print(response)
# scraper.close()

