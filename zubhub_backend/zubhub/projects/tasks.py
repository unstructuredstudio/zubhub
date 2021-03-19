import boto3
from django.conf import settings
from celery import shared_task

from random import uniform


@shared_task(bind=True, acks_late=True, max_retries=10)
def delete_image_from_DO_space(self, bucket, key):
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=settings.DOSPACE_REGION,
                            endpoint_url=settings.DOSPACE_ENDPOINT_URL,
                            aws_access_key_id=settings.DOSPACE_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.DOSPACE_ACCESS_SECRET_KEY)

    try:
        client.delete_object(Bucket=bucket, Key=key)
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))


@shared_task(bind=True, acks_late=True, max_retries=10)
def filter_spam_task(self, ctx):
    from projects.utils import filter_spam
    try:
        filter_spam(ctx)
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))
