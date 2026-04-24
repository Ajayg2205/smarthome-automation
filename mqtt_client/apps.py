from django.apps import AppConfig
import os


class MqttClientConfig(AppConfig):
    name = "mqtt_client"

    def ready(self):
        if os.environ.get("RUN_MAIN") == "true":
            return
        from .service import MQTTService
        mqtt = MQTTService()
        mqtt.start()