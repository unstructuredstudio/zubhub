from random import uniform
import cloudinary
from cloudinary import api
from django.contrib.postgres.search import SearchVector
from celery import shared_task
from celery.decorators import periodic_task
from celery.task.schedules import crontab
from zubhub.utils import delete_file_async


@shared_task(bind=True, acks_late=True, max_retries=10)
def delete_file_task(self, url):
    try:
        res = delete_file_async(url, self.request.id.__str__())
        try:
            if res['ResponseMetadata']['HTTPStatusCode'] != 204:
                raise Exception()
        except Exception:
            res = res.json()
            if res["result"] != "ok":
                raise Exception()

    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))


@shared_task(bind=True, acks_late=True, max_retries=10)
def update_video_url_if_transform_ready(self, dict):
    from projects.models import Project

    name = dict["url"].split("/")
    folder = name[-2]
    name = name[-1]
    if name.find(".") > -1:
        name = name.split(".")[0]

    try:
        result = api.resource(
            public_id=folder + "/" + name, resource_type="video", type="upload", max_results=500)
        result = list(filter(
            lambda each: each["transformation"] == "sp_hd/mpd", result["derived"]))
        if(len(result) > 0):
            Project.objects.filter(id=dict["project_id"]).update(
                video=result[0]["secure_url"])
        else:
            raise Exception("retry update_video_url_if_transform_ready")
    except Exception as e:
        raise self.retry(exc=e, countdown=180)


@shared_task(bind=True, acks_late=True, max_retries=10)
def delete_video_from_cloudinary(self, url):
    name = url.split("/")
    folder = name[-2]
    name = name[-1]

    if name.find(".") > -1:
        name = name.split(".")[0]
    try:
        result = cloudinary.uploader.destroy(
            public_id=folder+"/" + name, resource_type="video", invalidate=True)

    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries
        ))


# @shared_task(name="projects.tasks.update_search_index", bind=True, acks_late=True, max_retries=10)
@periodic_task(run_every=(crontab(hour="*/5")), name="projects.tasks.update_search_index",
               bind=True, acks_late=True, max_retries=5, ignore_result=True)
def update_search_index(self):
    from projects.models import Project
    from creators.models import Creator
    from projects.models import Tag
    from projects.models import Category
    # from projects.utils import task_lock

    # model_name_hexdigest = md5(model_name.encode("utf-8")).hexdigest()
    # key = '{0}-lock-{1}'.format(self.name, model_name_hexdigest)
    try:
        # is_false = task_lock(key)
        # if is_false:
        # if model_name == "category":
        Category.objects.update(search_vector=SearchVector('name'))
    # if model_name == "tag":
        Tag.objects.update(search_vector=SearchVector('name'))
    # if model_name == "creator":
        Creator.objects.update(
            search_vector=SearchVector('username'))
    # if model_name == "project":
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
