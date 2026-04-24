from rest_framework.routers import DefaultRouter
from .views import DeviceViewSet, RoomViewSet, DeviceLogViewSet

router = DefaultRouter()
router.register("rooms",   RoomViewSet)
router.register("devices", DeviceViewSet)
router.register("logs",    DeviceLogViewSet)

urlpatterns = router.urls