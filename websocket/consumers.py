import json
from channels.generic.websocket import AsyncWebsocketConsumer


class DeviceConsumer(AsyncWebsocketConsumer):
    GROUP = "devices"

    async def connect(self):
        # Add this browser connection to the "devices" group
        await self.channel_layer.group_add(self.GROUP, self.channel_name)
        await self.accept()
        await self.send(text_data=json.dumps({
            "type": "connected",
            "message": "WebSocket connected successfully"
        }))

    async def disconnect(self, code):
        # Remove from group when browser tab closes
        await self.channel_layer.group_discard(self.GROUP, self.channel_name)

    async def receive(self, text_data):
        pass    # browser → server messages handled here later

    # Triggered by channel_layer.group_send with type="device.update"
    async def device_update(self, event):
        await self.send(text_data=json.dumps({
            "type":   "device_update",
            "device": event["data"],
        }))

    # Triggered when an automation rule fires
    async def rule_triggered(self, event):
        await self.send(text_data=json.dumps({
            "type":   "rule_triggered",
            "rule":   event["data"]["rule"],
            "device": event["data"]["device"],
            "action": event["data"]["action"],
        }))