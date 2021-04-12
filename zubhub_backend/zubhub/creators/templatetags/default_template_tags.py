from django import template
from django.conf import settings

register = template.Library()


@register.simple_tag
def default_frontend_domain():
    return settings.DEFAULT_FRONTEND_DOMAIN


@register.simple_tag
def default_backend_domain():
    return settings.DEFAULT_BACKEND_DOMAIN


@register.simple_tag
def default_display_name():
    return settings.DEFAULT_DISPLAY_NAME


@register.simple_tag
def default_frontend_protocol():
    return settings.DEFAULT_FRONTEND_PROTOCOL


@register.simple_tag
def default_backend_protocol():
    return settings.DEFAULT_BACKEND_PROTOCOL
