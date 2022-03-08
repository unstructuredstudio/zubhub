from notifications.models import Notification
from django.utils import timezone


def push_notification(recipient, source, type, link):
    return Notification.objects.create(recipient=recipient, source=source, type=type, link=link)
