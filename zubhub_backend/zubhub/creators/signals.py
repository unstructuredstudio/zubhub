from django.db.models.signals import pre_delete
from django.dispatch import Signal, receiver
from .models import Creator
# from django.contrib.auth import get_user_model
from projects.tasks import delete_image_from_DO_space
# Provides the arguments "request", "phone_number"
phone_confirmed = Signal()
# Provides the arguments "request", "confirmation", "signup"
phone_confirmation_sent = Signal()


@receiver(pre_delete, sender=Creator)
def creator_to_be_deleted(sender, instance, **kwargs):
    delete_image_from_DO_space.delay(
        "zubhub", instance.avatar.split(".com/")[1])
