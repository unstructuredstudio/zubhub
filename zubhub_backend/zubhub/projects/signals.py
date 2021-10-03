from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
from projects.tasks import delete_file_task
from .models import Project, Image
from zubhub.models import Hero, StaticAssets
from django.conf import settings


@receiver(post_save, sender=Project)
def project_saved(sender, instance, **kwargs):
    instance.creator.projects_count = instance.creator.projects.count()
    instance.creator.save()


@receiver(pre_delete, sender=Project)
def project_to_be_deleted(sender, instance, **kwargs):
    if instance.video.find("cloudinary.com") > -1:
        delete_file_task.delay(instance.video)
    elif instance.video.startswith("{0}://{1}".format(settings.DEFAULT_MEDIA_SERVER_PROTOCOL,
                                                      settings.DEFAULT_MEDIA_SERVER_DOMAIN)):
        delete_file_task.delay(instance.video)


@receiver(pre_delete, sender=Image)
def image_to_be_deleted(sender, instance, **kwargs):
    delete_file_task.delay(instance.image_url)


@receiver(pre_delete, sender=Hero)
def hero_to_be_deleted(sender, instance, **kwargs):
    delete_file_task.delay(instance.image_url)


@receiver(pre_delete, sender=StaticAssets)
def static_assets_to_be_deleted(sender, instance, **kwargs):
    delete_file_task.delay(instance.header_logo_url)
    delete_file_task.delay(instance.footer_logo_url)
