from django.apps import AppConfig
import os
import sys


class AutomationConfig(AppConfig):
    name = "automation"

    def ready(self):
        if any(cmd in sys.argv for cmd in ['collectstatic', 'migrate', 'makemigrations', 'shell']):
            return
        if os.environ.get("RUN_MAIN") == "true":
            return
        from .engine import start
        start()