from rest_framework import serializers
from .models import AutomationRule


class AutomationRuleSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(
        source="action_device.device_name", read_only=True
    )

    class Meta:
        model  = AutomationRule
        fields = ["id", "name", "trigger_type", "trigger_value",
                  "condition_json", "action_device", "device_name",
                  "action", "is_active", "last_triggered"]
        read_only_fields = ["last_triggered"]