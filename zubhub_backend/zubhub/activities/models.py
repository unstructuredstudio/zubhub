import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone
from math import floor

Creator = get_user_model()

class Category(MP_Node):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=1000, blank=True, null=True)
    slug = models.SlugField(unique=True, max_length=1000)
    search_vector = SearchVectorField(null=True)

    node_order_by = ['name']

    class Meta:
        verbose_name_plural = "categories"
        indexes = (GinIndex(fields=["search_vector"]), )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.slug:
            pass
        else:
            uid = str(uuid.uuid4())
            uid = uid[0:floor(len(uid) / 6)]
            self.slug = slugify(self.name) + "-" + uid
        super().save(*args, **kwargs)

class Image(models.Model):
    image_url = models.URLField(max_length=1000)
    public_id = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        try:
            image = self.image_url
        except AttributeError:
            image = ''
        return "Photo <%s:%s>" % (self.public_id, image)    

class Activity(models.Model):
    id = models.UUIDField(primary_key=True,
                          default=uuid.uuid4,
                          editable=False,
                          unique=True)
    creators = models.ManyToManyField(Creator,
                                on_delete=models.CASCADE,
                                related_name="activities_created")
    title = models.CharField(max_length=1000)
    learning_goals = models.CharField(max_length=10000, blank=True, null=True)
    facilitation_tips = models.CharField(max_length=10000, blank=True, null=True)
    motivation = models.CharField(max_length=10000, blank=True, null=True)
    category = models.ForeignKey(Category,
                                 on_delete=models.SET_NULL,
                                 null=True,
                                 blank=True,
                                 related_name="activities")
    video = models.URLField(max_length=1000, blank=True, null=True)
    materials_used = models.CharField(max_length=5000)
    materials_used_image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="image",
                                blank=True)
    views = models.ManyToManyField(Creator,
                                   blank=True,
                                   related_name="activities_viewed")
    views_count = models.IntegerField(blank=True, default=0)
    saved_count = models.IntegerField(blank=True, default=0)
    saved_by = models.ManyToManyField(Creator,
                                      blank=True,
                                      related_name="saved_for_future")
    created_on = models.DateTimeField(default=timezone.now)
    publish = models.models.BooleanField(default=False)

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
    

class InspiringExamples(models.Model):
    activity = models.ForeignKey(Activity,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="activity",
                                blank=True)
    image_url = models.URLField(max_length=1000)
    public_id = models.CharField(max_length=1000, null=True, blank=True)
    description = models.CharField(max_length=10000, null=True, blank=True)
    credit = models.CharField(max_length=1000, null=True, blank=True)
    
    def __str__(self):
        try:
            image = self.image_url
        except AttributeError:
            image = ''
        return "Photo <%s:%s>" % (self.public_id, image)

class ActivityImages(models.Model):
    activity = models.ForeignKey(Activity,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="activity",
                                blank=True)
    image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="image",
                                blank=True)

    def __str__(self):
        return self.image        

class ActivityMakingSteps(models.Model):
    activity = models.ForeignKey(Activity,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="activity",
                                blank=True)
    image = models.ForeignKey(Image,
                                on_delete=models.CASCADE,
                                null=True,
                                related_name="image",
                                blank=True)
    description = models.CharField(max_length=10000, blank=True, null=True)
    order = models.IntegerField(min=1, max=20)

    def __str__(self):
        return self.description        