from notifications.models import Notification


def push_notification(recipient, source, notification_type, message, link):
    return Notification.objects.create(recipient=recipient, source=source, type=notification_type, message=message, link=link)
