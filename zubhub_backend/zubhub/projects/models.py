from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
import uuid
from math import floor


Creator = get_user_model()

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    creator = models.ForeignKey(Creator,on_delete = models.CASCADE,related_name="creators")
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=10000, blank = True, null = True)
    video = models.URLField(max_length = 1000)
    materials_used = models.CharField(max_length=10000)
    slug = models.SlugField(unique = True)
    created_on = models.DateTimeField(auto_now=True)

    def save(self,*args,**kwargs):
        if self.slug:
            pass
        else:
            uid = str(uuid.uuid4())
            uid = uid[0: floor(len(uid)/2)]
            self.slug = slugify(self.title) + "-" + uid
        super().save(*args,**kwargs)

    def __str__(self):
        return self.title

