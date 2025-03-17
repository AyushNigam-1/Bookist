from playwright.sync_api import sync_playwright

class PlaywrightManager:
    _instance = None

    def __init__(self):
        if PlaywrightManager._instance is None:
            self.playwright = sync_playwright().start()
            PlaywrightManager._instance = self
        else:
            raise Exception("Use get_instance() instead of creating a new object.")

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = PlaywrightManager()
        return cls._instance

    def stop(self):
        if self.playwright:
            self.playwright.stop()
            PlaywrightManager._instance = None
