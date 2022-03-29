from datetime import datetime, timedelta, timezone
from notifications.models import Notification
from django.template.loader import render_to_string


grouped_notification_types = {Notification.Type.BOOKMARK, Notification.Type.CLAP, Notification.Type.COMMENT, Notification.Type.FOLLOW}
recent_notification_time = timedelta(hours=1)
def push_notification(recipient, source, notification_type, message, link, template_name):
    check_link = None
    if notification_type is not Notification.Type.FOLLOW:
        check_link = link

    prev_notifications = []
    if notification_type in grouped_notification_types:
        try:
            prev_notifications = Notification.objects.filter(recipient=recipient, type=notification_type, link=check_link).order_by('-date')[:30]
        except Notification.DoesNotExist:
            pass

    for notification in prev_notifications:
        if datetime.now(timezone.utc) - notification.date > recent_notification_time:
            break
        
        notification.sources.add(source)
        template_prefix, template_ext = template_name.rsplit('.', 1)
        template_name = f'{template_prefix}_many.{template_ext}'
        notification.message = render_to_string(
            template_name,
            {'sources': notification.sources}
        ).strip()
        notification.date = datetime.now()
        notification.viewed = False
        notification.save()
        return

    notification = Notification.objects.create(recipient=recipient, type=notification_type, message=message, link=link)
    notification.sources.set([source])
    notification.save()

    return notification
