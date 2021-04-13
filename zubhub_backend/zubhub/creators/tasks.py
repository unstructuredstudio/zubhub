from celery import shared_task
from celery.decorators import periodic_task
from celery.task.schedules import crontab
from random import uniform
from celery import shared_task
import boto3
import requests
from django.conf import settings

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


@shared_task(name="creators.tasks.upload_image_to_DO_space", bind=True, acks_late=True, max_retries=10)
def upload_image_to_DO_space(self, bucket, key, user_id):
    from creators.models import Creator

    creator = Creator.objects.filter(id=user_id)

    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=settings.DOSPACE_REGION,
                            endpoint_url=settings.DOSPACE_ENDPOINT_URL,
                            aws_access_key_id=settings.DOSPACE_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.DOSPACE_ACCESS_SECRET_KEY)

    try:
        res = requests.get(creator[0].avatar)
        res = client.put_object(Bucket=bucket, Key=key,
                                Body=res.content, ContentType=res.headers["Content-Type"], ACL="public-read")
        if res.get("ResponseMetadata") and res["ResponseMetadata"]["HTTPStatusCode"] == 200:

            avatar = 'https://{0}.{1}/{2}'.format(
                bucket, settings.DOSPACE_ENDPOINT_URL.split("https://")[1], key)

            creator.update(avatar=avatar)

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


@periodic_task(run_every=(crontab(hour=0, minute=0)), name="creators.tasks.activity_notification_task",
               bind=True, acks_late=True, max_retries=10, ignore_result=True)
def activity_notification_task(self):
    from creators.utils import activity_notification
    try:
        activity_notification(["new_creators", "new_projects", "new_comments"])
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))
