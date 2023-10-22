import uuid
from math import floor
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.db import models
from django.core.validators import FileExtensionValidator
from django.utils.text import slugify
from .utils import MediaStorage, get_upload_path, clean_summernote_html, replace_summernote_images_with_media_storage_equiv
from projects.models import Project 
from django.utils.html import strip_tags

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
        self.privacy_policy = clean_summernote_html(
            replace_summernote_images_with_media_storage_equiv(self.privacy_policy)
        )
        self.terms_of_use = clean_summernote_html(
            replace_summernote_images_with_media_storage_equiv(self.terms_of_use)
        )
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
        self.about = clean_summernote_html(
            replace_summernote_images_with_media_storage_equiv(self.about)
        )
        self.edited_on = timezone.now()
        super().save(*args, **kwargs)

class Challenge(models.Model):
    challenge = models.TextField(blank=True, null=True)
    edited_on = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Challenge"
        verbose_name_plural = "Challenges"

    def __str__(self):
        return self.edited_on.strftime("Challenges as edited on %I:%M %p, %d %b %Y %Z")

    def save(self, *args, **kwargs):
        self.challenge = clean_summernote_html(
            replace_summernote_images_with_media_storage_equiv(self.challenge)
        )
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
        self.question = clean_summernote_html(
            replace_summernote_images_with_media_storage_equiv(self.question)
        )
        self.answer = clean_summernote_html(
            replace_summernote_images_with_media_storage_equiv(self.answer)
        )
        super().save(*args, **kwargs)


class Ambassadors(models.Model):
    ambassadors = models.TextField(blank=True, null=True)
    edited_on = models.DateTimeField(blank=True, null=True)
    projects = models.ManyToManyField(Project, related_name="ambassador_project_picks")

    class Meta:
        verbose_name = "Ambassadors"
        verbose_name_plural = "Ambassadors"

    def __str__(self):
        return self.edited_on.strftime("Ambassadors as edited on %I:%M %p, %d %b %Y %Z")

    def save(self, *args, **kwargs):
        self.edited_on = timezone.now()
        super().save(*args, **kwargs)

class Theme(models.Model):
    Theme_Name = models.CharField(max_length=20)
    Primary_Color1 = models.CharField(max_length=16, help_text="Enter hexcode to replace color red", default="#DC3545")
    Primary_Color2 = models.CharField(max_length=16, help_text="Enter hexcode to replace color yellow", default="#FDCB00")
    Primary_Color3 = models.CharField(max_length=16, help_text="Enter hexcode to replace color cyan", default="#00B8C4")
    Secondary_Color1 = models.CharField(max_length=16, help_text="Enter hexcode to replace color light red", default="#FFCDD2")
    Secondary_Color2 = models.CharField(max_length=16, help_text="Enter hexcode to replace color dark red", default="#A94442")
    Secondary_Color3 = models.CharField(max_length=16, help_text="Enter hexcode to replace color light yellow", default="#FFF7D4")
    Secondary_Color4 = models.CharField(max_length=16, help_text="Enter hexcode to replace color dark yellow", default="#9F861E")
    Secondary_Color5 = models.CharField(max_length=16, help_text="Enter hexcode to replace color light cyan", default="#E0F6F4")
    Secondary_Color6 = models.CharField(max_length=16, help_text="Enter hexcode to replace color dark cyan", default="#03848C")
    Text_Color1 = models.CharField(max_length=16, help_text="Enter hexcode to replace color black", default="#212121")
    Text_Color2 = models.CharField(max_length=16, help_text="Enter hexcode to replace color dark gray", default="#757474")
    Text_Color3 = models.CharField(max_length=16, help_text="Enter hexcode to replace color light gray", default="#E4E4E4")
    status = models.PositiveSmallIntegerField(choices=((0, 'Inactive'), (1, 'Active')), default=0)

    class Meta:
        verbose_name = "Theme"
        verbose_name_plural = "Themes"

    def save(self, *args, **kwargs):
        if self.status == 1:
            Theme.objects.exclude(pk=self.pk).update(status=0)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.Theme_Name
