import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone
from math import floor
from projects.models import Category

Creator = get_user_model()

class Image(models.Model):
    file_url = models.URLField(max_length=1000)
    public_id = models.TextField(max_length=1000, blank=True)

    def __str__(self):
        try:
            image = self.file_url
        except AttributeError:
            image = ''
        return "Photo <%s:%s>" % (self.public_id, image)    

class InspiringArtist(models.Model):
    '''this should be having more fields to distinguish an artist '''
    image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                blank=True)
    short_biography = models.TextField(max_length=10000, blank=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Activity(models.Model):
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False,
                          unique=True)
    creators = models.ManyToManyField(Creator,
                                      related_name="activities_created")
    title = models.CharField(max_length=500)
    learning_goals = models.TextField(max_length=10000, blank=True)
    facilitation_tips = models.TextField(max_length=10000, blank=True)
    motivation = models.TextField(max_length=10000, blank=True)
    category = models.ForeignKey(Category,
                                 on_delete=models.SET_NULL,
                                 null=True,
                                 blank=True,
                                 related_name="activities")
    video = models.URLField(max_length=1000, blank=True, null=True)
    materials_used = models.TextField(max_length=5000)
    materials_used_image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                blank=True)
    inspiring_artist = models.ForeignKey(InspiringArtist,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="inspiring_artist_activities",
                                blank=True)
    views = models.ManyToManyField(Creator,
                                   blank=True,
                                   related_name="activities_viewed")
    views_count = models.IntegerField(blank=True, default=0)
    saved_count = models.IntegerField(blank=True, default=0)
    saved_by = models.ManyToManyField(Creator,
                                      blank=True,
                                      related_name="activities_saved")
    created_on = models.DateTimeField(default=timezone.now, null=True)
    publish = models.BooleanField(default=False, null= True)
    slug = models.SlugField(unique=True, max_length=1000)
    
    def save(self, *args, **kwargs):
        if self.slug:
            pass
        else:
            uid = str(uuid.uuid4())
            uid = uid[0:floor(len(uid) / 6)]
            self.slug = slugify(self.title) + "-" + uid
            
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    

class InspiringExample(models.Model):
    activity = models.ForeignKey(Activity,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="inspiring_examples",
                                blank=True)
    description = models.TextField(max_length=10000, blank=True)
    credit = models.TextField(max_length=1000, blank=True)
    image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                blank=True)

    def __str__(self):
        return self.image

class ActivityImage(models.Model):
    activity = models.ForeignKey(Activity,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="activity_images",
                                blank=True)
    image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                blank=True)

    def __str__(self):
        return self.image       

class ActivityMakingStep(models.Model):
    activity = models.ForeignKey(Activity,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="making_steps",
                                blank=True)
    image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                blank=True)
    description = models.TextField(max_length=10000, blank=True)
    step_order = models.IntegerField()

    def __str__(self):
        return self.description        
    
