import paho.mqtt.client as mqtt
import json
from django.conf import settings


class MQTTService:
    _client = None

    @classmethod
    def start(cls):
        cls._client = mqtt.Client(client_id="django-smarthome-backend")
        cls._client.on_connect = cls._on_connect
        cls._client.on_message = cls._on_message
        try:
            cls._client.connect(
                settings.MQTT_BROKER_URL,
                settings.MQTT_BROKER_PORT,
                keepalive=60
            )
            cls._client.loop_start()
            print("[MQTT] Client started")
        except Exception as e:
            print(f"[MQTT] Could not connect to broker: {e}")

    @classmethod
    def _on_connect(cls, client, userdata, flags, rc):
        print(f"[MQTT] Connected to broker (rc={rc})")
        client.subscribe("home/devices/+/status", qos=1)

    @classmethod
    def _on_message(cls, client, userdata, msg):
        try:
            topic      = msg.topic
            device_id  = int(topic.split("/")[2])
            payload    = json.loads(msg.payload.decode())
            new_status = payload.get("status", "OFF").upper()

            from devices.models import Device, DeviceLog
            from asgiref.sync import async_to_sync
            from channels.layers import get_channel_layer

            device = Device.objects.get(pk=device_id, is_active=True)
            device.status = new_status
            device.save(update_fields=["status", "updated_at"])
            DeviceLog.objects.create(device=device, action=new_status, source="mqtt")

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "devices",
                {"type": "device.update", "data": device.to_dict()}
            )
            print(f"[MQTT] Device {device_id} → {new_status}")

        except Exception as e:
            print(f"[MQTT] Error: {e}")

    @classmethod
    def publish_command(cls, device_id: int, action: str):
        """Send ON/OFF command to physical device."""
        if cls._client is None:
            print("[MQTT] Client not started — skipping publish")
            return
        try:
            topic   = f"home/devices/{device_id}/command"
            payload = json.dumps({"action": action})
            cls._client.publish(topic, payload, qos=1)
            print(f"[MQTT] Published → {topic} : {action}")
        except Exception as e:
            print(f"[MQTT] Publish error: {e}")