from django.db.models.signals import pre_delete
from django.dispatch import receiver
import cloudinary
from .models import Image


@receiver(pre_delete, sender=Image)
def image_deleted(sender, instance, **kwargs):
    cloudinary.uploader.destroy(instance.public_id)
