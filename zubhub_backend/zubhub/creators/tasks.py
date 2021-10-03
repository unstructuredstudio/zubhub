from celery import shared_task
from celery.decorators import periodic_task
from celery.task.schedules import crontab
from random import uniform
from celery import shared_task
import requests
from zubhub.utils import upload_file_to_media_server

try:
    from allauth.account.adapter import get_adapter
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")


@shared_task(name="creators.tasks.send_text", bind=True, acks_late=True, max_retries=10)
def send_text(self, phone, template_name, ctx):
    try:
        get_adapter().send_text(template_name, phone, ctx)
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))


@shared_task(name="creators.tasks.send_mass_email", bind=True, acks_late=True, max_retries=10)
def send_mass_email(self, template_name, ctxs):
    try:
        get_adapter().send_mass_email(template_name, ctxs)
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))


@shared_task(name="creators.tasks.send_mass_text", bind=True, acks_late=True, max_retries=10)
def send_mass_text(self, template_name, ctxs):
    try:
        get_adapter().send_mass_text(template_name, ctxs)
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))


@shared_task(name="creators.tasks.upload_file_task", bind=True, acks_late=True, max_retries=10)
def upload_file_task(self, user_id, username):
    from creators.models import Creator

    creator = Creator.objects.filter(id=user_id)

    key = 'avatar/{0}'.format(username)

    try:
        res = requests.get(creator[0].avatar)
        res = upload_file_to_media_server(res.content, key)
        res = res.json()
        res = res["url"]

        if isinstance(res, str):
            creator.update(avatar=res)
        else:
            raise Exception()

    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))


@periodic_task(run_every=(crontab(hour=0, minute=0)), name="creators.tasks.activity_notification_task",
               bind=True, acks_late=True, max_retries=10, ignore_result=True)
def activity_notification_task(self):
    from creators.utils import activity_notification
    try:
        activity_notification(["new_creators", "new_projects", "new_comments"])
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))
