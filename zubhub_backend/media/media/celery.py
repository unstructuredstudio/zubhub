from __future__ import absolute_import
import os
from celery import Celery
# from celery.schedules import crontab

from django.conf import settings
# from django import setup

# this code copied from manage.py
# set the default Django settings module for the 'celery' app.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'media.settings')

# you change change the name here
app = Celery("media")

# read config from Django settings, the CELERY namespace would make celery
# config keys has `CELERY` prefix
app.config_from_object('django.conf:settings', namespace='CELERY')

# load tasks.py in django apps
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)