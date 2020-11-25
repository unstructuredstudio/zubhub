from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid

class Creator(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    avatar = models.URLField(max_length=1000, blank=True, null=True)
    phone = models.CharField(unique=True, max_length=17, blank=True)
    dateOfBirth = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    bio = models.CharField(max_length=255, blank=True, null=True)

    def save(self,*args,**kwargs):
        self.avatar = 'https://robohash.org/{0}'.format(self.username)
        super().save(*args,**kwargs)






class ActivityLog(models.Model):
    creator = models.ForeignKey(Creator, null=True, on_delete=models.CASCADE)
    activity = models.CharField(max_length=255)
    created_on = models.DateTimeField(default=timezone.now, blank=True)
