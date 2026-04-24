import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "smarthome.settings")

# Import websocket URL patterns AFTER setting the env variable
from websocket.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http":      get_asgi_application(),         # normal HTTP requests
    "websocket": AuthMiddlewareStack(            # WebSocket connections
        URLRouter(websocket_urlpatterns)
    ),
})