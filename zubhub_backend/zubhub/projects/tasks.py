from random import uniform
from django.contrib.postgres.search import SearchVector
from celery import shared_task
from celery.decorators import periodic_task
from celery.task.schedules import crontab


@shared_task(bind=True, acks_late=True, max_retries=10)
def delete_file_task(self, url):
    from zubhub.utils import delete_file_from_media_server, get_cloudinary_resource_info
    try:
        res = delete_file_from_media_server(url)

        res = res.json()
        if res["result"] != "ok" and res["result"]['HTTPStatusCode'] != 204:
            raise Exception()

    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))


@shared_task(bind=True, acks_late=True, max_retries=10)
def update_video_url_if_transform_ready(self, dict):
    pass
    # from projects.models import Project

    # try:
    #     result = get_cloudinary_resource_info(dict["url"])
    #     result = result.json()
    #     result = result["result"]
    #     result = list(filter(
    #         lambda each: each["transformation"] == "sp_hd/mpd", result["derived"]))
    #     if(result.count() > 0):
    #         Project.objects.filter(id=dict["project_id"]).update(
    #             video=result[0]["secure_url"])
    #     else:
    #         raise Exception("retry update_video_url_if_transform_ready")
    # except Exception as e:
    #     raise self.retry(exc=e, countdown=180)


@periodic_task(run_every=(crontab(hour="*/5")), name="projects.tasks.update_search_index",
               bind=True, acks_late=True, max_retries=5, ignore_result=True)
def update_search_index(self):
    from creators.models import Creator
    from creators.models import CreatorTag
    from projects.models import Project
    from projects.models import Tag
    from projects.models import Category

    try:
        Category.objects.update(search_vector=SearchVector('name'))
        Tag.objects.update(search_vector=SearchVector('name'))
        Creator.objects.update(
            search_vector=SearchVector('username'))
        CreatorTag.objects.update(
            search_vector=SearchVector('name')
        )
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
