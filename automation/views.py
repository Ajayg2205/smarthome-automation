from rest_framework import viewsets
from .models import AutomationRule
from .serializers import AutomationRuleSerializer


class AutomationRuleViewSet(viewsets.ModelViewSet):
    queryset         = AutomationRule.objects.select_related("action_device")
    serializer_class = AutomationRuleSerializer