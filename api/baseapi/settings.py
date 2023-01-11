import os
import sys
from pathlib import Path

from django.utils.translation import gettext_lazy as _

from dotenv import load_dotenv
from environ import Env

load_dotenv()
env = Env()

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, os.path.join(BASE_DIR, "apps"))

TEMPLATE_DIR = os.path.join(BASE_DIR, "apps", "tmpls")

LOCALE_PATHS = (os.path.join(BASE_DIR, "baseapi", "local"),)
LANGUAGES = [
    ("en-US", _("English")),
]

APP_NAME = "TeleDrive"

SECRET_KEY = env.str("SECRET_KEY", default="secret")

DEBUG = env.bool("DEBUG", default=True)

ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    # Django apps.
    "api",
    "auth",
    "baseapi",
    "utils",
    # Third party apps.
    "rest_framework",
    "simple_history",
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.auth.tokens.JWTAccessTokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [],
    "UNAUTHENTICATED_USER": None,
    "EXCEPTION_HANDLER": "apps.api.views.exception_handler",
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]

ROOT_URLCONF = "baseapi.urls"

AUTH_USER_MODEL = "auth.User"

TEMPLATES = []

WSGI_APPLICATION = "baseapi.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env.str("DATABASE_NAME", default="baseapi"),
        "USER": env.str("DATABASE_USER", default="baseapi"),
        "PASSWORD": env.str("DATABASE_PASSWORD", default="secret"),
        "HOST": env.str("DATABASE_HOST", default="127.0.0.1"),
        "PORT": env.int("DATABASE_PORT", default=5432),
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = env.str("LANGUAGE_CODE", "en-US")

TIME_ZONE = env.str("TIME_ZONE", "UTC")

USE_I18N = env.bool("USE_I18N", True)

USE_TZ = env.bool("USE_TZ", True)

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

APPEND_SLASH = False

VARCHAR_LENGTH_LIMIT = 200

JWT_REFRESH_TOKEN_KEY = env.str("JWT_REFRESH_TOKEN_KEY", default="jwt_refresh_token_key")
JWT_REFRESH_TOKEN_KEY_ID = "1"
JWT_REFRESH_TOKEN_EXP_HOURS = 365 * 24

JWT_ACCESS_TOKEN_KEY = env.str("JWT_ACCESS_TOKEN_KEY", default="jwt_access_token_key")
JWT_ACCESS_TOKEN_KEY_ID = "1"
JWT_ACCESS_TOKEN_EXP_HOURS = 1

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            TEMPLATE_DIR,
        ],
        "APP_DIRS": True,
    },
]

# References
# https://docs.python.org/3/library/logging.html#logrecord-attributes

LOG_LEVEL = env.str("LOG_LEVEL", default="INFO")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json_verbose": {
            "format": '{"asctime":"%(asctime)s","filename":"%(filename)s","funcName":"%(funcName)s",'
            + '"levelname":"%(levelname)s","lineno":"%(lineno)d","message":"%(message)s",'
            + '"module":"%(module)s","name":"%(name)s"}',
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json_verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": LOG_LEVEL,
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": LOG_LEVEL,
            "propagate": False,
        },
        "baseapi": {
            "handlers": ["console"],
            "level": LOG_LEVEL,
            "propagate": False,
        },
    },
}
