from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timezone

_scheduler = None


def start():
    global _scheduler
    _scheduler = BackgroundScheduler()
    _scheduler.add_job(
        evaluate_rules,
        trigger="interval",
        minutes=1,
        id="rules_eval",
        replace_existing=True
    )
    _scheduler.start()
    print("[Rules] Scheduler started")


def evaluate_rules():
    from .models import AutomationRule
    from devices.models import Device, DeviceLog
    from mqtt_client.service import MQTTService
    from asgiref.sync import async_to_sync
    from channels.layers import get_channel_layer

    now   = datetime.now().strftime("%H:%M")
    rules = AutomationRule.objects.filter(is_active=True).select_related("action_device")

    for rule in rules:
        try:
            if not _check_trigger(rule, now):
                continue
            if not _check_conditions(rule):
                continue

            device = rule.action_device
            device.status = rule.action
            device.save(update_fields=["status", "updated_at"])

            DeviceLog.objects.create(
                device=device, action=rule.action, source="automation"
            )

            rule.last_triggered = datetime.now(timezone.utc)
            rule.save(update_fields=["last_triggered"])

            MQTTService.publish_command(device.pk, rule.action)

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)("devices", {
                "type": "rule_triggered",
                "data": {
                    "rule":   rule.name,
                    "device": device.device_name,
                    "action": rule.action,
                }
            })
            print(f"[Rules] '{rule.name}' fired → {device.device_name} {rule.action}")

        except Exception as e:
            print(f"[Rules] Rule {rule.pk} error: {e}")


def _check_trigger(rule, now: str) -> bool:
    if rule.trigger_type == "time":
        return rule.trigger_value == now
    if rule.trigger_type == "device_state":
        parts = rule.trigger_value.split(":")
        if len(parts) != 2:
            return False
        from devices.models import Device
        dev = Device.objects.filter(pk=int(parts[0])).first()
        return dev and dev.status == parts[1]
    return False


def _check_conditions(rule) -> bool:
    if not rule.condition_json:
        return True
    from devices.models import Device
    for cond in rule.condition_json:
        dev = Device.objects.filter(pk=cond["device_id"]).first()
        if not dev or dev.status != cond["status"]:
            return False
    return True