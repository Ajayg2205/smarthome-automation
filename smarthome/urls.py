from django.urls import path, include

urlpatterns = [
    path("api/auth/", include("accounts.urls")),
    path("api/",      include("devices.urls")),
    path("api/automation/", include("automation.urls")),
]