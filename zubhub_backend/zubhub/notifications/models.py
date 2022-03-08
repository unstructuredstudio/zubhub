from django.utils import timezone
from django.db import models
import uuid

from creators.models import Creator


class Notification(models.Model):
    class Type(models.IntegerChoices):
        CLAP = 1
        COMMENT = 2
        SAVE = 3
        FOLLOW = 4

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    type = models.PositiveSmallIntegerField(
        choices=Type.choices,
    )
    recipient = models.ForeignKey(
        Creator, on_delete=models.CASCADE, null=True, related_name="notification_recipient", blank=True)
    source = models.ForeignKey(
        Creator, on_delete=models.CASCADE, null=True, related_name="notification_source", blank=True)
    link = models.URLField(max_length=1000)
    viewed = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now)
