from rest_framework import serializers
from .models import Device, Room, DeviceLog


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Room
        fields = "__all__"


class DeviceSerializer(serializers.ModelSerializer):
    room_name = serializers.CharField(source="room.room_name", read_only=True)

    class Meta:
        model  = Device
        fields = ["id", "device_name", "device_type", "status",
                  "room", "room_name", "is_active", "updated_at"]
        read_only_fields = ["updated_at"]


class DeviceLogSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source="device.device_name", read_only=True)
    user_name   = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model  = DeviceLog
        fields = ["id", "device_name", "user_name", "action", "source", "timestamp"]