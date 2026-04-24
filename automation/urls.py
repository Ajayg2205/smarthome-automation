from rest_framework.routers import DefaultRouter
from .views import AutomationRuleViewSet

router = DefaultRouter()
router.register("rules", AutomationRuleViewSet)

urlpatterns = router.urls