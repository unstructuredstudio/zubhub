import uuid
from math import floor

from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.utils import timezone


Creator = get_user_model()


class Project(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    creator = models.ForeignKey(
        Creator, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=1000)
    description = models.CharField(max_length=10000, blank=True, null=True)
    video = models.URLField(max_length=1000, blank=True, null=True)
    materials_used = models.CharField(max_length=5000)
    views = models.ManyToManyField(
        Creator, blank=True, related_name="projects_viewed")
    views_count = models.IntegerField(blank=True, default=0)
    likes = models.ManyToManyField(
        Creator, blank=True, related_name="projects_liked")
    likes_count = models.IntegerField(blank=True, default=0)
    comments_count = models.IntegerField(blank=True, default=0)
    saved_by = models.ManyToManyField(
        Creator, blank=True, related_name="saved_for_future")
    slug = models.SlugField(unique=True, max_length=1000)
    created_on = models.DateTimeField(default=timezone.now)
    published = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if isinstance(self.video, str):
            if self.video.find("m.youtube.com") != -1:
                self.video = "youtube.com/embed/".join(
                    self.video.split("m.youtube.com/watch?v="))

            elif self.video.find("youtube.com") != -1:
                self.video = "embed/".join(self.video.split("watch?v="))

            elif self.video.find("youtu.be") != -1:
                self.video = "youtube.com/embed".join(
                    self.video.split("youtu.be"))

            elif self.video.find("m.youtube.com") != -1:
                self.video = "youtube.com/embed/".join(
                    self.video.split("m.youtube.com/watch?v="))

            elif self.video.find("https://vimeo.com") != -1:
                self.video = "player.vimeo.com/video".join(
                    self.video.split("vimeo.com"))

            elif self.video.find("drive.google.com") != -1 and self.video.find("/view") != -1:
                self.video = self.video.split("/view")[0] + "/preview"

        if self.id:
            self.likes_count = self.likes.count()
            self.comments_count = self.comments.count()

        if self.slug:
            pass
        else:
            uid = str(uuid.uuid4())
            uid = uid[0: floor(len(uid)/6)]
            self.slug = slugify(self.title) + "-" + uid
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Image(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, null=True, related_name="images", blank=True)
    image_url = models.URLField(max_length=1000)
    public_id = models.CharField(max_length=1000, null=True, blank=True)

    def __str__(self):
        try:
            image = self.image_url
        except AttributeError:
            image = ''
        return "Photo <%s:%s>" % (self.public_id, image)


class Comment(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="comments")
    creator = models.ForeignKey(
        Creator, on_delete=models.CASCADE, related_name="comments")
    text = models.CharField(max_length=10000)
    created_on = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.text

    def save(self, *args, **kwargs):
        self.project.save()
        super().save(*args, **kwargs)


class StaffPick(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=1000)
    description = models.CharField(max_length=1000)
    projects = models.ManyToManyField(
        Project, related_name="staff_picks")
    slug = models.SlugField(unique=True, max_length=1000)
    created_on = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if self.slug:
            pass
        else:
            uid = str(uuid.uuid4())
            uid = uid[0: floor(len(uid)/6)]
            self.slug = slugify(self.title) + "-" + uid
        super().save(*args, **kwargs)
