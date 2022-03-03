from notifications.models import Notification
from django.utils import timezone


def push_notification(message, recipient, source):
    return Notification.objects.create(message=message, recipient=recipient, source=source)
