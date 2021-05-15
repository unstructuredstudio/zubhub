"""
WSGI config for zubhub project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application
from .saferproxyfix import SaferProxyFix

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'zubhub.settings')
PROXY_COUNT = int(os.environ.get('PROXY_COUNT', default=1))
DETECT_MISCONFIG = bool(int(os.environ.get('DETECT_MISCONFIG', default=1)))


application = get_wsgi_application()

application = SaferProxyFix(application, PROXY_COUNT, DETECT_MISCONFIG)
