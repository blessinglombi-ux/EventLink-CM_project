import os
from pathlib import Path
import dj_database_url
from dotenv import load_dotenv
# =========================================================
# BASE DIRECTORY
# =========================================================
BASE_DIR = Path(__file__).resolve().parent.parent
# =========================================================
# ENVIRONMENT VARIABLES
# =========================================================
load_dotenv(BASE_DIR / ".env")
# =========================================================
# SECURITY
# =========================================================
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-change-this-key"
)
DEBUG = os.getenv(
    "DEBUG",
    "True"
).lower() == "true"
# =========================================================
# ALLOWED HOSTS
# =========================================================
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        "ALLOWED_HOSTS",
        "127.0.0.1,localhost"
    ).split(",")
    if host.strip()
]
# =========================================================
# APPLICATIONS
# =========================================================
INSTALLED_APPS = [
    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    # EventLink CM
    "api",
]
# =========================================================
# MIDDLEWARE
# =========================================================
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
# =========================================================
# URL CONFIGURATION
# =========================================================
ROOT_URLCONF = "core.urls"
# =========================================================
# TEMPLATES
# =========================================================
TEMPLATES = [
    {
        "BACKEND":
            "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "templates",
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
# =========================================================
# WSGI / ASGI
# =========================================================
WSGI_APPLICATION = "core.wsgi.application"
ASGI_APPLICATION = "core.asgi.application"
# =========================================================
# DATABASE
# =========================================================
DATABASE_URL = os.getenv(
    "DATABASE_URL"
)
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    # Local fallback.
    # PostgreSQL should be configured through DATABASE_URL.
    DATABASES = {
        "default": {
            "ENGINE":
                "django.db.backends.postgresql",
            "NAME":
                os.getenv(
                    "POSTGRES_DB",
                    "eventlink_cm"
                ),
            "USER":
                os.getenv(
                    "POSTGRES_USER",
                    "postgres"
                ),
            "PASSWORD":
                os.getenv(
                    "POSTGRES_PASSWORD",
                    ""
                ),
            "HOST":
                os.getenv(
                    "POSTGRES_HOST",
                    "localhost"
                ),
            "PORT":
                os.getenv(
                    "POSTGRES_PORT",
                    "5432"
                ),
        }
    }
# =========================================================
# PASSWORD VALIDATION
# =========================================================
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME":
            "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME":
            "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]
# =========================================================
# INTERNATIONALIZATION
# =========================================================
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Douala"
USE_I18N = True
USE_TZ = True
# =========================================================
# STATIC FILES
# =========================================================
STATIC_URL = "/static/"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]
STATIC_ROOT = BASE_DIR / "staticfiles"
# =========================================================
# MEDIA FILES
# =========================================================
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
# =========================================================
# DEFAULT PRIMARY KEY
# =========================================================
DEFAULT_AUTO_FIELD = (
    "django.db.models.BigAutoField"
)
# =========================================================
# DJANGO REST FRAMEWORK
# =========================================================
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
# =========================================================
# EMAIL
# =========================================================
EMAIL_BACKEND = (
    "django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = os.getenv(
    "EMAIL_HOST",
    "smtp.gmail.com"
)
EMAIL_PORT = int(
    os.getenv(
        "EMAIL_PORT",
        "587"
    )
)
EMAIL_USE_TLS = (
    os.getenv(
        "EMAIL_USE_TLS",
        "True"
    ).lower() == "true"
)
EMAIL_HOST_USER = os.getenv(
    "EMAIL_HOST_USER",
    "blessingakoni120@gmail.com"
)
EMAIL_HOST_PASSWORD = os.getenv(
    "EMAIL_HOST_PASSWORD",
    ""
)
DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    EMAIL_HOST_USER
)
# =========================================================
# SITE URL
# =========================================================
SITE_URL = os.getenv(
    "SITE_URL",
    "http://127.0.0.1:8000"
)
# =========================================================
# LOGIN / LOGOUT
# =========================================================
LOGIN_URL = "/accounts/login/"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"
# =========================================================
# SECURITY SETTINGS FOR PRODUCTION
# =========================================================
if not DEBUG:
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = "DENY"
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
# =========================================================
# STATIC FILE STORAGE
# =========================================================
if not DEBUG:
    STATICFILES_STORAGE = (
        "whitenoise.storage.CompressedManifestStaticFilesStorage"
    )