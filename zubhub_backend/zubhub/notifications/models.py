from django.utils import timezone
from django.db import models
import uuid

from creators.models import Creator


class Notification(models.Model):
    class Type(models.IntegerChoices):
        BOOKMARK = 1
        CLAP = 2
        COMMENT = 3
        FOLLOW = 4
        FOLLOWING_PROJECT = 5

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    type = models.PositiveSmallIntegerField(
        choices=Type.choices,
    )
    recipient = models.ForeignKey(
        Creator, on_delete=models.CASCADE, null=True, related_name="notification_recipient", blank=True)
    sources = models.ManyToManyField(Creator, null=True, related_name='notification_source', blank=True)
    message = models.CharField(max_length=255, blank=True, null=True)
    link = models.CharField(max_length=1000, blank=True, null=True)
    viewed = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now)
