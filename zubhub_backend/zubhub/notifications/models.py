from django.utils import timezone
from django.db import models
from django.core.validators import FileExtensionValidator
import uuid 

class Notification(models.Model):
    message = models.TextField(blank=False, null=True)
    recipient = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    viewed = models.BooleanField(default=False)