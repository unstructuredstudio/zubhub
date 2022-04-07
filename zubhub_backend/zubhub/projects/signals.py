from django.db.models.signals import pre_delete, post_delete, post_save, pre_save
from django.dispatch import receiver
from projects.tasks import delete_file_task
from .models import Project, Image, PublishingRule, Comment
from zubhub.models import Hero, AdminSettings
from django.conf import settings


@receiver(post_save, sender=Project)
def project_saved(sender, instance, **kwargs):
    instance.creator.projects_count = instance.creator.projects.count()
    instance.creator.save()


@receiver(post_delete, sender=Project)
def project_deleted(sender, instance, **kwargs):
    if instance.video.find("cloudinary.com") > -1:
        delete_file_task.delay(instance.video)
    elif instance.video.startswith("{0}://{1}".format(settings.DEFAULT_MEDIA_SERVER_PROTOCOL,
                                                      settings.DEFAULT_MEDIA_SERVER_DOMAIN)):
        delete_file_task.delay(instance.video)

    # delete relevant publishing rule
    publish_rule_id = instance.publish.id
    PublishingRule.objects.filter(id=publish_rule_id).delete()


@receiver(post_delete, sender=Comment)
def comment_deleted(sender, instance, **kwargs):
    # delete relevant publishing rule
    publish_rule_id = instance.publish.id
    PublishingRule.objects.filter(id=publish_rule_id).delete()


@receiver(pre_delete, sender=Image)
def image_to_be_deleted(sender, instance, **kwargs):
    delete_file_task.delay(instance.image_url)


@receiver(pre_save, sender=Hero)
def hero_to_be_saved(sender, instance, **kwargs):
    if not instance.id:
        pass
    else:
        prev = Hero.objects.filter(id=instance.id)
        if prev.count() > 0 and prev[0].image.name != instance.image.name:
            delete_file_task.delay(prev[0].image.name)


@receiver(pre_save, sender=AdminSettings)
def admin_settings_to_be_saved(sender, instance, **kwargs):
    if not instance.id:
        pass
    else:
        prev = AdminSettings.objects.filter(id=instance.id)
        if prev.count() > 0:
            prev = prev[0]
        else:
            prev = None

        if prev and prev.header_logo.name and prev.header_logo.name != instance.header_logo.name:
            delete_file_task.delay(prev.header_logo.name)
        if prev and prev.footer_logo.name and prev.footer_logo.name != instance.footer_logo.name:
            delete_file_task.delay(prev.footer_logo.name)


@receiver(pre_delete, sender=Hero)
def hero_to_be_deleted(sender, instance, **kwargs):
    if instance.image.name:
        delete_file_task.delay(instance.image.name)


@receiver(pre_delete, sender=AdminSettings)
def admin_settings_to_be_deleted(sender, instance, **kwargs):

    if instance.header_logo.name:
        delete_file_task.delay(instance.header_logo.name)
    if instance.footer_logo.name:
        delete_file_task.delay(instance.footer_logo.name)