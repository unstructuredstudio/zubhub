from django.db.models.signals import pre_delete, pre_save, post_save, m2m_changed
from django.dispatch import Signal, receiver
from .models import Creator, CreatorGroup
from .utils import send_group_invite_notification
from projects.tasks import delete_image_from_DO_space, update_search_index
# Provides the arguments "request", "phone_number"
phone_confirmed = Signal()
# Provides the arguments "request", "confirmation", "signup"
phone_confirmation_sent = Signal()


@receiver(pre_delete, sender=Creator)
def creator_to_be_deleted(sender, instance, **kwargs):
    delete_image_from_DO_space.delay(
        "zubhub", instance.avatar.split(".com/")[1])


# @receiver(post_save, sender=Creator)
# def creator_saved(sender, instance, **kwargs):
#     update_search_index.delay("creator")


@receiver(m2m_changed, sender=CreatorGroup.members.through)
def creator_group_m2m_changed(instance, action, **kwargs):
    if action == "post_add" and instance.creator in instance.members.all():
        instance.members.remove(instance.creator)
