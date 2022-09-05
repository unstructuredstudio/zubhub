from django.utils import timezone
from django.db import models
import uuid

from creators.models import Creator


class Activitylog(models.Model):
    class Type(models.IntegerChoices):
        CLAP = 1
        COMMENT = 2
        FOLLOW = 3
        BOOKMARK = 4

    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    type = models.PositiveSmallIntegerField(
        choices=Type.choices,
    )
    target = models.ForeignKey(
        Creator, on_delete=models.CASCADE, null=True, related_name="activitylog_target", blank=True)
    source = models.ForeignKey(
        Creator, on_delete=models.CASCADE, null=True, related_name="activitylog_source", blank=True)
    message = models.CharField(max_length=255, blank=True, null=True)
    link = models.CharField(max_length=1000, blank=True, null=True)
    date = models.DateTimeField(default=timezone.now)

