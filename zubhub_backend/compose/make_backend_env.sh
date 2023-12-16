#!/usr/bin/env bash
# Generate a .env file for backend local development
mkpass() {
    head /dev/urandom | LC_ALL=C tr -dc A-Za-z0-9 | head -c ${1:-20}
}
cat > ${1:?Missing target file} << _EOF
ENVIRONMENT=production

DEFAULT_FRONTEND_DOMAIN=localhost:3000
DEFAULT_BACKEND_DOMAIN=localhost:8000
DEFAULT_DISPLAY_NAME=ZubHub
DEFAULT_FRONTEND_PROTOCOL=http
DEFAULT_BACKEND_PROTOCOL=http

SECRET_KEY=$(mkpass 48)
DEBUG=1
STORE_MEDIA_LOCALLY=1
MEDIA_SECRET=$(mkpass 48)
DEFAULT_MEDIA_SERVER_PROTOCOL=http
DEFAULT_MEDIA_SERVER_DOMAIN=localhost:8001

POSTGRES_NAME=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(mkpass)
POSTGRES_HOST=db

#GF_ADMIN_USER=admin
#GF_ADMIN_PASSWORD=admin

#CLOUDINARY_CLOUD_NAME=<cloudinary cloud name>
#CLOUDINARY_API_KEY=<cloudinary api key>
#CLOUDINARY_API_SECRET=<cloudinary api secret>

#SENDGRID_API_KEY=<sendgrid api key here>

#DEFAULT_FROM_PHONE=<twilio default phone number>
#TWILIO_ACCOUNT_SID=<twilio account side>
#TWILIO_AUTH_TOKEN=<twilio auth token>
#TWILIO_NOTIFY_SERVICE_SID=<twilio notifiy sid>

#AKISMET_API_KEY=<akismet api key>

#DOSPACE_ACCESS_KEY_ID=<access key>
#DOSPACE_ACCESS_SECRET_KEY=<secret>
#DOSPACE_REGION=<region>
#DOSPACE_ENDPOINT_URL=<endpoint url>
#DOSPACE_BUCKETNAME=<bucket name>

RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=admin
# https://github.com/bitnami/containers/issues/53771
RABBITMQ_MANAGEMENT_ALLOW_WEB_ACCESS=true

CELERY_BROKER=amqp://admin:admin@rabbitmq:5672/
CELERY_BACKEND=django-db

CELERY_FLOWER_USER=admin
CELERY_FLOWER_PASSWORD=admin


PROXY_COUNT=0
DETECT_MISCONFIG=0

#DANGER: don't forget to delete this user after you have created a proper superuser!!!
SUPERUSER_PASSWORD=$(mkpass)
_EOF
