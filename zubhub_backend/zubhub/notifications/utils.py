from notifications.models import Notification


def push_notification(recipient, source, notification_type, link):
    return Notification.objects.create(recipient=recipient, source=source, type=notification_type, link=link)
