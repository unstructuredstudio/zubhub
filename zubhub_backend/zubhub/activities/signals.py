from django.core.exceptions import ObjectDoesNotExist
from django.db.models.signals import m2m_changed, post_delete, pre_delete, pre_save
from django.dispatch import receiver
from projects.tasks import delete_file_task

from .models import (
    Activity,
    ActivityImage,
    ActivityMakingStep,
    Image,
    InspiringArtist,
    InspiringExample,
)


@receiver(pre_save, sender=Image)
def image_to_be_saved(sender, instance, **kwargs):
    if not instance.id:
        return

    prev = sender.objects.filter(id=instance.id)
    if prev.count() < 1:
        return

    try:
        if prev[0].file_url != instance.file_url:
            delete_file_task.delay(prev[0].file_url)
    except ObjectDoesNotExist:
        pass  # ignore if image has already been deleted


@receiver(post_delete, sender=Image)
def image_deleted(sender, instance, **kwargs):
    delete_file_task.delay(instance.file_url)


@receiver(m2m_changed, sender=ActivityMakingStep.image.through)
def activity_step_many2many_changed(sender, instance, action, **kwargs):
    if action in ["pre_remove", "pre_clear"]:
        for image in instance.image.all():
            image.delete()


@receiver(pre_delete, sender=ActivityMakingStep)
def activity_step_to_be_deleted(sender, instance, **kwargs):
    for image in instance.image.all():
        image.delete()


@receiver(pre_save, sender=ActivityImage)
@receiver(pre_save, sender=InspiringExample)
@receiver(pre_save, sender=InspiringArtist)
def instance_to_be_saved(sender, instance, **kwargs):
    if not instance.id:
        return

    prev = sender.objects.filter(id=instance.id)
    if prev.count() < 1:
        return

    try:
        if prev[0].image.id != instance.image.id:
            prev[0].image.delete()
    except ObjectDoesNotExist:
        pass  # ignore if image has already been deleted


@receiver(post_delete, sender=ActivityImage)
@receiver(post_delete, sender=InspiringExample)
@receiver(post_delete, sender=InspiringArtist)
def instance_deleted(sender, instance, **kwargs):
    try:
        instance.image.delete()
    except sender.DoesNotExist:
        pass  # ignore if image has already been deleted
    except ObjectDoesNotExist:
        pass  # ignore if image has already been deleted


@receiver(pre_save, sender=Activity)
def activity_to_be_saved(sender, instance, **kwargs):
    if not instance.id:
        return

    prev = sender.objects.filter(id=instance.id)
    if prev.count() < 1:
        return

    try:
        if prev[0].materials_used_image.id != instance.materials_used_image.id:
            prev[0].materials_used_image.delete()
    except ObjectDoesNotExist:
        pass  # ignore if image has already been deleted
    except AttributeError:
        pass  # ignore if image has already been deleted

    if prev[0].video != instance.video:
        delete_file_task.delay(prev[0].video)


@receiver(post_delete, sender=Activity)
def activity_deleted(sender, instance, **kwargs):
    try:
        instance.materials_used_image.delete()
    except ObjectDoesNotExist:
        pass  # ignore if image has already been deleted
    delete_file_task.delay(instance.video)
