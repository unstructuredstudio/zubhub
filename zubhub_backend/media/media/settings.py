import cloudinary
import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENVIRONMENT = os.environ.get('ENVIRONMENT', default='production')

DEFAULT_FRONTEND_DOMAIN = os.environ.get(
    "DEFAULT_FRONTEND_DOMAIN", default="localhost:3000")
DEFAULT_BACKEND_DOMAIN = os.environ.get(
    "DEFAULT_BACKEND_DOMAIN", default="localhost:8000")
DEFAULT_FRONTEND_PROTOCOL = os.environ.get(
    "DEFAULT_FRONTEND_PROTOCOL", default="https")
DEFAULT_BACKEND_PROTOCOL = os.environ.get(
    "DEFAULT_BACKEND_PROTOCOL", default="https")
DEBUG = int(os.environ.get("DEBUG", default=0))
STORE_MEDIA_LOCALLY = bool(
    int(os.environ.get("STORE_MEDIA_LOCALLY", default=1)))
MEDIA_SECRET = os.environ.get("MEDIA_SECRET", default="")
DEFAULT_MEDIA_SERVER_PROTOCOL = os.environ.get(
    "DEFAULT_MEDIA_SERVER_PROTOCOL", default="http")
DEFAULT_MEDIA_SERVER_DOMAIN = os.environ.get(
    "DEFAULT_MEDIA_SERVER_DOMAIN", default="localhost:8001")

if DEFAULT_FRONTEND_DOMAIN.startswith("localhost"):
    FRONTEND_HOST = DEFAULT_FRONTEND_DOMAIN.split(":")[0]
else:
    FRONTEND_HOST = DEFAULT_FRONTEND_DOMAIN

if DEFAULT_BACKEND_DOMAIN.startswith("localhost"):
    BACKEND_HOST = DEFAULT_BACKEND_DOMAIN.split(":")[0]
else:
    BACKEND_HOST = DEFAULT_BACKEND_DOMAIN

if DEFAULT_MEDIA_SERVER_DOMAIN.startswith("localhost"):
    MEDIA_SERVER_HOST = DEFAULT_MEDIA_SERVER_DOMAIN.split(":")[0]
else:
    MEDIA_SERVER_HOST = DEFAULT_MEDIA_SERVER_DOMAIN


if ENVIRONMENT == 'production':
    SECURE_BROWSER_XSS_FILTER = True
    # SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 3600
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'SAMEORIGIN'

    # SESSION_COOKIE_SECURE = True
    # CSRF_COOKIE_SECURE = True

    # Quick-start development settings - unsuitable for production
    # See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

    # SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!

ALLOWED_HOSTS = ['127.0.0.1', FRONTEND_HOST, "www." +
                 FRONTEND_HOST, BACKEND_HOST, "www."+BACKEND_HOST, MEDIA_SERVER_HOST, "web", "media"]
# ALLOWED_HOSTS = ['*']

# CORS_ORIGIN_ALLOW_ALL = True

CORS_ORIGIN_WHITELIST = (
    DEFAULT_FRONTEND_PROTOCOL+"://"+DEFAULT_FRONTEND_DOMAIN,
    DEFAULT_BACKEND_PROTOCOL+"://"+DEFAULT_BACKEND_DOMAIN,
    DEFAULT_FRONTEND_PROTOCOL+"://www."+DEFAULT_FRONTEND_DOMAIN,
    DEFAULT_BACKEND_PROTOCOL+"://www."+DEFAULT_BACKEND_DOMAIN,
    DEFAULT_MEDIA_SERVER_PROTOCOL+"://"+DEFAULT_MEDIA_SERVER_DOMAIN
)

# Application definition

INSTALLED_APPS = [
    'whitenoise.runserver_nostatic',
    'cloudinary',
    'corsheaders',
    'rest_framework',
    'media',
    'django_celery_results'
]

# cloudinary
cloudinary.config(
    cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key=os.environ.get('CLOUDINARY_API_KEY'),
    api_secret=os.environ.get('CLOUDINARY_API_SECRET')
)

# digitalocean spaces
DOSPACE_ACCESS_KEY_ID = os.environ.get("DOSPACE_ACCESS_KEY_ID")
DOSPACE_ACCESS_SECRET_KEY = os.environ.get("DOSPACE_ACCESS_SECRET_KEY")
DOSPACE_REGION = os.environ.get("DOSPACE_REGION")
DOSPACE_ENDPOINT_URL = os.environ.get("DOSPACE_ENDPOINT_URL")
DOSPACE_BUCKETNAME = os.environ.get("DOSPACE_BUCKETNAME")

REST_FRAMEWORK = {
    'UNAUTHENTICATED_USER': None,
    'DEFAULT_THROTTLE_RATES': {
        'post_anon': '20/min',
        'get_anon': '25/min',
        'post_user': '30/min',
        'get_user': '40/min',
        'sustained': '1500/day'
    }
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'media.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages'
            ],
        },
    },
]

WSGI_APPLICATION = 'media.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get("POSTGRES_NAME"),
        'USER': os.environ.get("POSTGRES_USER"),
        'PASSWORD': os.environ.get("POSTGRES_PASSWORD"),
        'HOST': os.environ.get("POSTGRES_HOST"),
        'PORT': 5432
    }
}

################################################################################
# How to setup Celery with Django
################################################################################

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_BACKEND")


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

MEDIA_URL = '/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media_store')
