from django.db.models.signals import pre_delete, post_save
from django.dispatch import Signal, receiver
from projects.tasks import delete_image_from_DO_space, update_search_index
from .models import Creator
# Provides the arguments "request", "phone_number"
phone_confirmed = Signal()
# Provides the arguments "request", "confirmation", "signup"
phone_confirmation_sent = Signal()


@receiver(pre_delete, sender=Creator)
def creator_to_be_deleted(sender, instance, **kwargs):
    delete_image_from_DO_space.delay(
        "zubhub", instance.avatar.split(".com/")[1])


@receiver(post_save, sender=Creator)
def creator_saved(sender, instance, **kwargs):
    update_search_index.delay("creator")
