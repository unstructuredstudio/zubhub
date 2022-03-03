from notifications.models import Notification
from django.utils import timezone


def push_notification(message, recipient, source, type):
    return Notification.objects.create(message=message, recipient=recipient, source=source, type=type)
