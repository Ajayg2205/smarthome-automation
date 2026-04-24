from django.apps import AppConfig
import os


class AutomationConfig(AppConfig):
    name = "automation"

    def ready(self):
        if os.environ.get("RUN_MAIN") == "true":
            return
        from .engine import start
        start()