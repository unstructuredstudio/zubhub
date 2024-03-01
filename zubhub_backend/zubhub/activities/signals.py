import os

from django.conf import settings
from django.db.models.signals import pre_delete
from django.dispatch import receiver

from .models import Activity, ActivityImage, Image


@receiver(pre_delete, sender=Activity)
def delete_activity_images(sender, instance, **kwargs):
    ActivityImage.objects.filter(activity=instance).delete()

    images = Image.objects.filter(activity=instance)
    for image in images:
        if os.path.isfile(os.path.join(settings.MEDIA_ROOT, str(image.file))):
            os.remove(os.path.join(settings.MEDIA_ROOT, str(image.file)))
    images.delete()
