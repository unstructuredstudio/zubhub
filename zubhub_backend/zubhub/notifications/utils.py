from typing import cast
from datetime import datetime, timedelta
from notifications.models import Notification
from creators.models import Setting
from django.template.loader import render_to_string


html_based_contacts = {Setting.WEB}
def get_notification_template_name(
        contact_method: int, notification_type: Notification.Type) -> str:
    file_extension = '.html' if contact_method in html_based_contacts else '.txt'
    if contact_method == Setting.EMAIL:
        file_extension = ''
    return (f'notifications/{notification_type.name.lower()}'
            f'/{Setting.CONTACT_CHOICES[cast(int, contact_method) - 1][1].lower()}{file_extension}')


grouped_notification_types = {Notification.Type.BOOKMARK, Notification.Type.CLAP, Notification.Type.COMMENT, Notification.Type.FOLLOW}
recent_notification_time = timedelta(hours=1)
def push_notification(recipient, source, notification_type, link, context):
    template_name = get_notification_template_name(Setting.WEB, notification_type)

    check_link = None
    if notification_type is not Notification.Type.FOLLOW:
        check_link = link

    notification = None
    if notification_type in grouped_notification_types:
        try:
            filters = {
                'recipient': recipient,
                'type': notification_type,
                'date__gt': datetime.utcnow() - recent_notification_time
            }
            if check_link:
                filters['link'] = check_link
            notification = Notification.objects.filter(**filters).order_by('-date').first()
        except Notification.DoesNotExist:
            pass

    if notification is not None:
        notification.sources.add(source)
        template_prefix, template_ext = template_name.rsplit('.', 1)
        template_name = f'{template_prefix}_many.{template_ext}'
        context = {**context, 'sources': notification.sources.all()}
        notification.message = render_to_string(
            template_name,
            context
        ).strip()
        notification.date = datetime.now()
        notification.viewed = False
        notification.save()
        return

    message = render_to_string(
        template_name,
        context
    )
    notification = Notification.objects.create(recipient=recipient, type=notification_type, message=message, link=link)
    notification.sources.set([source])
    notification.save()
