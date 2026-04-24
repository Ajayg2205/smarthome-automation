from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Device, Room, DeviceLog
from .serializers import DeviceSerializer, RoomSerializer, DeviceLogSerializer
from .services import control_device


class RoomViewSet(viewsets.ModelViewSet):
    queryset         = Room.objects.all()
    serializer_class = RoomSerializer


class DeviceViewSet(viewsets.ModelViewSet):
    queryset         = Device.objects.filter(is_active=True).select_related("room")
    serializer_class = DeviceSerializer

    @action(detail=True, methods=["post"], url_path="control")
    def control(self, request, pk=None):
        action_str = request.data.get("action", "")
        try:
            device = control_device(pk, action_str, user=request.user)
            return Response(DeviceSerializer(device).data)
        except Device.DoesNotExist:
            return Response({"error": "Device not found"}, status=404)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)


class DeviceLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset         = DeviceLog.objects.select_related("device", "user")
    serializer_class = DeviceLogSerializer