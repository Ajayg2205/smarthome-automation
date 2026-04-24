from django.db import models
from django.conf import settings


class Room(models.Model):
    room_name  = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.room_name


class Device(models.Model):
    STATUS_CHOICES = [("ON", "On"), ("OFF", "Off")]

    device_name = models.CharField(max_length=50)
    device_type = models.CharField(max_length=50)
    status      = models.CharField(max_length=10, choices=STATUS_CHOICES, default="OFF")
    room        = models.ForeignKey(Room, on_delete=models.SET_NULL,
                                    null=True, related_name="devices")
    is_active   = models.BooleanField(default=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.device_name} — {self.room}"

    def to_dict(self):
        return {
            "id":          self.pk,
            "device_name": self.device_name,
            "device_type": self.device_type,
            "status":      self.status,
            "room":        self.room.room_name if self.room else None,
            "updated_at":  self.updated_at.isoformat(),
        }


class DeviceLog(models.Model):
    SOURCE_CHOICES = [("api", "API"), ("mqtt", "MQTT"), ("automation", "Automation")]

    device    = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="logs")
    user      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True)
    action    = models.CharField(max_length=10)
    source    = models.CharField(max_length=20, choices=SOURCE_CHOICES, default="api")
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]