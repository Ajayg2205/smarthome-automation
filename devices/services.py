from .models import Device, DeviceLog
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


def control_device(device_id: int, action: str, user=None) -> Device:
    device = Device.objects.get(pk=device_id, is_active=True)

    action = action.upper()
    if action not in ("ON", "OFF"):
        raise ValueError("Action must be ON or OFF")

    # 1. Update DB
    device.status = action
    device.save(update_fields=["status", "updated_at"])

    # 2. Log it
    DeviceLog.objects.create(device=device, user=user, action=action, source="api")

    # 3. Send MQTT command to physical device
    from mqtt_client.service import MQTTService
    MQTTService.publish_command(device_id, action)

    # 4. Push live update to all dashboard browsers via WebSocket
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "devices",
        {"type": "device.update", "data": device.to_dict()}
    )

    return device