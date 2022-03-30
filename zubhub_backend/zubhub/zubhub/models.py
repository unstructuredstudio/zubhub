from django.utils import timezone
from django.db import models
from django.core.validators import FileExtensionValidator
from zubhub.utils import clean_summernote_html


class StaticAssets(models.Model):
    header_logo = models.FileField(blank=False, null=True, validators=[
                                   FileExtensionValidator(["jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"])])
    header_logo_url = models.URLField(max_length=1000, blank=True, null=False)
    footer_logo = models.FileField(blank=False, null=True, validators=[
                                   FileExtensionValidator(["jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "svg", "webp"])])
    footer_logo_url = models.URLField(max_length=1000, blank=True, null=False)

    class Meta:
        verbose_name = "StaticAssets"
        verbose_name_plural = "StaticAssets"

    def __str__(self):
        return self.header_logo_url


class Hero(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=100, null=True)
    image = models.ImageField(blank=False, null=True)
    image_url = models.URLField(max_length=1000, blank=True, null=False, default='')
    activity_url = models.URLField(max_length=1000, null=True)
    explore_ideas_url = models.URLField(max_length=1000, null=True)

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

class TinkeringResources(models.Model):
    # handle changes in Tinkering Resources URL
    url = models.URLField(blank=True, null=True)
    
    class Meta:
        verbose_name = "Tinkering Resources"

    def __str__(self):
        return self.url

    def save(self, *args, **kwargs):
        self.url = clean_summernote_html(self.url)
        super().save(*args, **kwargs)