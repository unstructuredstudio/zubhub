from contextlib import contextmanager
from celery.five import monotonic
from django.core.cache import cache
from django.conf import settings
from akismet import Akismet
from .models import Comment
from creators.tasks import send_mass_email, send_mass_text
from creators.models import Creator, Setting

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
                  
def send_staff_pick_notification(staff_pick):
    subscribed = Setting.objects.filter(subscribe=True)
    email_contexts = []
    phone_contexts = []
    template_name = "new_staff_pick_notification"
    for each in subscribed:
        if each.creator.email:
            email_contexts.append(
                {"title": staff_pick.title,
                 "user": each.creator.username,
                 "email": each.creator.email,
                 "staff_pick_id": staff_pick.id
                 }
            )

        if each.creator.phone:
            phone_contexts.append(
                {
                    "phone": each.creator.phone,
                    "staff_pick_id": staff_pick.id


def send_spam_notification(comment_id, staffs):
    email_contexts = []
    phone_contexts = []
    template_name = "spam_notification"
    for each in staffs:
        if each.email:
            email_contexts.append(
                {"user": each.username,
                 "email": each.email,
                 "comment_id": comment_id
                 }
            )

        if each.phone:
            phone_contexts.append(
                {
                    "phone": each.phone,
                    "comment_id": comment_id
                }
            )

    if len(email_contexts) > 0:
        send_mass_email.delay(
            template_name=template_name,
            ctxs=email_contexts
        )

    if len(phone_contexts) > 0:
        send_mass_text.delay(
            template_name=template_name,
            ctxs=phone_contexts
        )


def filter_spam(ctx):

    site_url = settings.DEFAULT_BACKEND_PROTOCOL + \
        "://"+settings.DEFAULT_BACKEND_DOMAIN

    if site_url.find("localhost") != -1:
        return

    comment = Comment.objects.get(id=ctx.get("comment_id"))

    if ctx.get("method") == 'POST' and comment.published:
        akismet_api = Akismet(key=settings.AKISMET_API_KEY,
                              blog_url=site_url)

        is_spam = akismet_api.comment_check(
            user_ip=ctx.get("REMOTE_ADDR"),
            user_agent=ctx.get("HTTP_USER_AGENT"),
            comment_type='comment',
            comment_content=ctx.get("text"),
            blog_lang=ctx.get("lang"),
        )

        if is_spam:
            comment.published = False
            comment.save()

            staffs = Creator.objects.filter(is_staff=True)

            send_spam_notification(ctx.get("comment_id"), staffs)

            
def project_changed(obj, instance):
    changed = False

    if not obj.creator == instance.creator:
        changed = True
    elif not obj.title == instance.title:
        changed = True
    elif not obj.description == instance.description:
        changed = True
    elif not obj.video == instance.video:
        changed = True
    elif not obj.materials_used == instance.materials_used:
        changed = True
    elif not obj.published == instance.published:
        changed = True
    else:
        obj_images = obj.images.all()
        instance_images = instance.images.all()

        if not obj_images.count() == instance_images.count():
            changed = True
        else:
            obj_image_dict = {}
            instance_image_dict = {}

            for image in obj_images:
                obj_image_dict[image.pk] = True

            for image in instance_images:
                instance_image_dict[image.pk] = True

            for pk in list(obj_image_dict.keys()):
                if not instance_image_dict.get(pk, None):
                    changed = True

    return changed
