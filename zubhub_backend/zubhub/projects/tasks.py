from random import uniform
from hashlib import md5
import boto3
from django.conf import settings
from django.contrib.postgres.search import SearchVector
from celery import shared_task


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


@shared_task(name="projects.tasks.update_search_index", bind=True, acks_late=True, max_retries=10)
def update_search_index(self, model_name):
    from projects.models import Project
    from creators.models import Creator
    from projects.models import Tag
    from projects.models import Category
    from projects.utils import task_lock

    model_name_hexdigest = md5(model_name.encode("utf-8")).hexdigest()
    lock_id = '{0}-lock-{1}'.format(self.name, model_name_hexdigest)
    try:
        with task_lock(lock_id, self.app.oid) as acquired:
            if acquired:
                if model_name == "category":
                    Category.objects.update(search_vector=SearchVector('name'))
                if model_name == "tag":
                    Tag.objects.update(search_vector=SearchVector('name'))
                if model_name == "creator":
                    Creator.objects.update(
                        search_vector=SearchVector('username'))
                if model_name == "project":
                    search_vector = SearchVector(
                        'title', weight='A') + SearchVector('description', weight='B')
                    Project.objects.update(search_vector=search_vector)

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
