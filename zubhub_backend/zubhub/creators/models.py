from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import uuid
from django.utils.text import slugify
from math import floor



class Location(models.Model):
    name = models.CharField(max_length = 100)
    slug = models.SlugField(unique = True, max_length = 106)

    def save(self,*args,**kwargs):
        if self.slug:
            pass
        else:
            uid = str(uuid.uuid4())
            uid = uid[0: floor(len(uid)/6)]
            self.slug = slugify(self.name) + "-" + uid
        super().save(*args,**kwargs)

    def __str__(self):
        return self.name

class Creator(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    avatar = models.URLField(max_length=1000, blank=True, null=True)
    phone = models.CharField(unique=True, max_length=17, blank=True, null = True)
    dateOfBirth = models.DateField(blank=True, null=True)
    location = models.ForeignKey(Location, null=True, on_delete=models.SET_NULL)
    bio = models.CharField(max_length=255, blank=True, null=True)
    followers = models.ManyToManyField("self",symmetrical=False)
    def save(self,*args,**kwargs):
        self.avatar = 'https://robohash.org/{0}'.format(self.username)
        super().save(*args,**kwargs)






class ActivityLog(models.Model):
    creator = models.ForeignKey(Creator, null=True, on_delete=models.CASCADE)
    activity = models.CharField(max_length=255)
    created_on = models.DateTimeField(default=timezone.now, blank=True)
