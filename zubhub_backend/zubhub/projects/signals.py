from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
from projects.tasks import delete_image_from_DO_space, update_search_index
from .models import Project, Image


@receiver(post_save, sender=Project)
def project_saved(sender, instance, **kwargs):
    instance.creator.projects_count = instance.creator.projects.count()
    instance.creator.save()
    update_search_index.delay("project")


@receiver(pre_delete, sender=Image)
def image_to_be_deleted(sender, instance, **kwargs):
    delete_image_from_DO_space.delay("zubhub", instance.public_id)
