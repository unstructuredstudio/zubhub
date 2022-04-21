from django.db.models.signals import pre_delete, post_save,  m2m_changed
from django.dispatch import Signal, receiver
from .models import Creator, CreatorGroup, CreatorTag
from projects.tasks import delete_file_task
from .utils import enforce_creator__creator_tags_constraints


# Provides the arguments "request", "phone_number"
phone_confirmed = Signal()
# Provides the arguments "request", "confirmation", "signup"
phone_confirmation_sent = Signal()


@receiver(post_save, sender=Creator)
def creator_saved(sender, instance, **kwargs):
    """ creatortag should default to 'creator' if instance.tags.all() is empty """
    if instance.tags.all().count() < 1:
        instance.tags.set(CreatorTag.objects.filter(name="creator"))

@receiver(pre_delete, sender=Creator)
def creator_to_be_deleted(sender, instance, **kwargs):
    if instance.avatar.find("robohash.org") == -1:
        delete_file_task.delay(instance.avatar)


@receiver(m2m_changed, sender=CreatorGroup.members.through)
def creator_group_m2m_changed(instance, action, **kwargs):
    if action == "post_add" and instance.creator in instance.members.all():
        instance.members.remove(instance.creator)
