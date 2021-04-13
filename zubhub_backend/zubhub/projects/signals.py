from django.db.models.signals import pre_delete, post_save, pre_save
from django.dispatch import receiver
from projects.tasks import delete_image_from_DO_space, update_search_index
from .models import Project, Image, StaffPick, Tag
from .utils import project_changed


@receiver(post_save, sender=Project)
def project_saved(sender, instance, **kwargs):
    instance.creator.projects_count = instance.creator.projects.count()
    instance.creator.save()
    update_search_index.delay("project")


@receiver(pre_delete, sender=Image)
def image_to_be_deleted(sender, instance, **kwargs):
    delete_image_from_DO_space.delay("zubhub", instance.public_id)


@receiver(post_save, sender=Tag)
def tag_saved(sender, instance, **kwargs):
    update_search_index.delay("tag")
