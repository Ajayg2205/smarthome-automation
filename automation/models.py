from django.db import models
from devices.models import Device


class AutomationRule(models.Model):
    TRIGGER_TYPES = [
        ("time",         "Time-based"),
        ("device_state", "Device state"),
    ]

    name           = models.CharField(max_length=100)
    trigger_type   = models.CharField(max_length=20, choices=TRIGGER_TYPES)
    trigger_value  = models.CharField(max_length=100)
    condition_json = models.JSONField(null=True, blank=True)
    action_device  = models.ForeignKey(Device, on_delete=models.CASCADE)
    action         = models.CharField(max_length=10)
    is_active      = models.BooleanField(default=True)
    last_triggered = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name