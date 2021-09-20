from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
from projects.tasks import delete_image_from_DO_space, delete_video_from_cloudinary
from .models import Project, Image
from zubhub.models import Hero, StaticAssets

# from .utils import project_changed


@receiver(post_save, sender=Project)
def project_saved(_, instance, **__):
    instance.creator.projects_count = instance.creator.projects.count()
    instance.creator.save()
    # update_search_index.delay("project")
# @receiver(post_save, sender=StaffPick)
# def staff_pick_saved(sender, instance, **kwargs):


@receiver(pre_delete, sender=Project)
def project_to_be_deleted(_, instance, **__):
    if instance.video.find("cloudinary.com") > -1:
        delete_video_from_cloudinary.delay(instance.video)


@receiver(pre_delete, sender=Image)
def image_to_be_deleted(_, instance, **__):
    delete_image_from_DO_space.delay("zubhub", instance.public_id)


# @receiver(post_save, sender=Tag)
# def tag_saved(_, __, **___):
#     update_search_index.delay("tag")


# @receiver(post_save, sender=Category)
# def category_saved(_, __, **___):
#     update_search_index.delay("category")


@receiver(pre_delete, sender=Hero)
def hero_to_be_deleted(_, instance, **__):
    delete_image_from_DO_space.delay(
        "zubhub", instance.image_url.split(".com/")[1])


@receiver(pre_delete, sender=StaticAssets)
def static_assets_to_be_deleted(_, instance, **__):
    delete_image_from_DO_space.delay(
        "zubhub", instance.header_logo_url.split(".com/")[1])
    delete_image_from_DO_space.delay(
        "zubhub", instance.footer_logo_url.split(".com/")[1])
