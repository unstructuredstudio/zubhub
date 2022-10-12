import uuid
from math import floor
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils.text import slugify
from .utils import MediaStorage, get_upload_path, clean_summernote_html


class AdminSettings(models.Model):
    PUBLIC = 1
    PRIVATE = 2

    MODE_CHOICES = (
        (PUBLIC, 'PUBLIC'),
        (PRIVATE, 'PRIVATE')
    )
    MEDIA_PATH = "zubhub"


    header_logo = models.ImageField(upload_to=get_upload_path, storage=MediaStorage(),
                                    blank=True, null=True, validators=[
                                   FileExtensionValidator(["", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"])])
    footer_logo = models.ImageField(upload_to=get_upload_path, storage=MediaStorage(),
                                    blank=True, null=True, validators=[
                                   FileExtensionValidator(["", "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"])])
    site_mode = models.PositiveSmallIntegerField(
        choices=MODE_CHOICES, blank=False, null=False, default=PUBLIC)
    edited_by_id = models.CharField(max_length=100, blank=True, null=True)
    edited_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "AdminSettings"
        verbose_name_plural = "AdminSettings"

    def __str__(self):
        formatted_edit_date =  self.edited_on.strftime("%I:%M %p, %d %b %Y %Z")
        edited_by = get_user_model().objects.filter(id=self.edited_by_id)
        if edited_by.count() > 0:
            edited_by = edited_by[0].username
        else:
            edited_by = "Anonymous User"

        return  "Administration Settings as edited on {0} by {1}".format(formatted_edit_date, edited_by)





class Hero(models.Model):
    MEDIA_PATH = "hero_images"

    title = models.CharField(max_length=50)
    description = models.CharField(max_length=100, null=True)
    image = models.ImageField(blank=True, null=True, upload_to=get_upload_path, storage=MediaStorage(),
            validators=[FileExtensionValidator(["","jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"])])
    activity_url = models.URLField(max_length=1000, blank=True, null=True)
    explore_ideas_url = models.URLField(max_length=1000, blank=True, null=True)
    tinkering_resource_url = models.URLField(max_length=1000, blank=True, null=True)

    class Meta:
        verbose_name = "Hero"
        verbose_name_plural = "Heroes"

    def __str__(self):
        return self.title


class Privacy(models.Model):
    privacy_policy = models.TextField(blank=True, null=True)
    terms_of_use = models.TextField(blank=True, null=True)
    edited_on = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Privacy"
        verbose_name_plural = "Privacy"

    def __str__(self):
        return self.edited_on.strftime("ZubHub's Guildlines, Policies and Terms of use as edited on %I:%M %p, %d %b %Y %Z")

    def save(self, *args, **kwargs):
        self.privacy_policy = clean_summernote_html(self.privacy_policy)
        self.terms_of_use = clean_summernote_html(self.terms_of_use)
        self.edited_on = timezone.now()
        super().save(*args, **kwargs)


class Help(models.Model):
    about = models.TextField(blank=True, null=True)
    edited_on = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Help"
        verbose_name_plural = "Help"

    def __str__(self):
        return self.edited_on.strftime("About Zubhub as edited on %I:%M %p, %d %b %Y %Z")

    def save(self, *args, **kwargs):
        self.about = clean_summernote_html(self.about)
        self.edited_on = timezone.now()
        super().save(*args, **kwargs)


class FAQ(models.Model):
    question = models.TextField(blank=True, null=True)
    answer = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question

    def save(self, *args, **kwargs):
        self.question = clean_summernote_html(self.question)
        self.answer = clean_summernote_html(self.answer)
        super().save(*args, **kwargs)


class Ambassadors(models.Model):
    ambassadors = models.TextField(blank=True, null=True)
    edited_on = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Ambassadors"
        verbose_name_plural = "Ambassadors"

    def __str__(self):
        return self.edited_on.strftime("Ambassadors as edited on %I:%M %p, %d %b %Y %Z")

    def save(self, *args, **kwargs):
        self.edited_on = timezone.now()
        super().save(*args, **kwargs)
