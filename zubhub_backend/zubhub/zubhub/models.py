from django.utils import timezone
from django.db import models


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
