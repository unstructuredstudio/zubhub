from contextlib import contextmanager
from celery.five import monotonic
from django.core.cache import cache
from .models import Image, Tag


LOCK_EXPIRE = {"30mins": 60 * 30}


@contextmanager
def task_lock(lock_id, oid):
    timeout_at = monotonic() + LOCK_EXPIRE["30mins"] - 3
    status = cache.add(lock_id, oid, LOCK_EXPIRE["30mins"])
    try:
        yield status
    finally:
        if monotonic() < timeout_at and status:
            cache.delete(lock_id)


def update_images(project, images_data):
    images = project.images.all()

    images_to_save = []

    if len(images) != len(images_data):
        for image_dict in images_data:
            exist = False
            for image in images:
                if image_dict["image_url"] == image.image_url:
                    exist = True
            if not exist:
                images_to_save.append(image_dict)

        for image in images:
            image.delete()

    for image in images_to_save:
        Image.objects.create(project=project, **image)


def update_tags(project, tags_data):
    tags = project.tags.all()

    tags_dict = {}

    for tag in tags_data:
        tags_dict[tag["name"]] = True

    for tag in tags:
        if not tags_dict.get(tag.name, None):
            project.tags.remove(tag)

    for tag in tags_data:
        tag, created = Tag.objects.get_or_create(name=tag["name"])
        tag.projects.add(project)
