import os
from pathlib import Path
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ["SECRET_KEY"]

DEBUG = os.environ.get("DEBUG", "True") == "True"

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "channels",
    "corsheaders",
    "accounts",
    "devices",
    "automation",
    "mqtt_client",
    "websocket",
]

AUTH_USER_MODEL = "accounts.User"          # tells Django to use YOUR User model

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "smarthome.urls"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME":     os.environ.get("DB_NAME", "smart_home"),
        "USER":     os.environ.get("DB_USER", "root"),
        "PASSWORD": os.environ.get("DB_PASSWORD", ""),
        "HOST":     os.environ.get("DB_HOST", "localhost"),
        "PORT":     os.environ.get("DB_PORT", "3306"),
    }
}

# Django REST Framework — JWT auth on all endpoints by default
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME":  timedelta(hours=1),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# Django Channels — uses Redis to pass messages between WebSocket clients
ASGI_APPLICATION = "smarthome.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(os.environ.get("REDIS_HOST", "localhost"), 6379)],
        },
    }
}

# MQTT broker settings
MQTT_BROKER_URL  = os.environ.get("MQTT_BROKER_URL", "localhost")
MQTT_BROKER_PORT = int(os.environ.get("MQTT_BROKER_PORT", 1883))

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"           # change to your timezone
USE_TZ = True

STATIC_URL = "/static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

STATIC_ROOT = BASE_DIR / "staticfiles"