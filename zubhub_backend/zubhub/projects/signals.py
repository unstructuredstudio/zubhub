from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
import cloudinary
from .models import Project


@receiver(post_save, sender=Project)
def project_saved(sender, instance, **kwargs):
    instance.creator.projects_count = instance.creator.projects.count()
    instance.creator.save()
