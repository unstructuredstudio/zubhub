# from django.db.models.signals import pre_delete, pre_save
# from django.dispatch import receiver
# from projects.tasks import delete_file_task
# from .models import Hero, AdminSettings
# from django.conf import settings


# @receiver(pre_save, sender=Hero)
# def hero_to_be_saved(sender, instance, **kwargs):
#     if instance.id:
#         pass
#     else:
#         prev = Hero.objects.get(id=instance.id)
#         if prev.image.name:
#             delete_file_task.delay(prev.image.name)


# @receiver(pre_save, sender=AdminSettings)
# def admin_settings_to_be_saved(sender, instance, **kwargs):
#     if instance.id:
#         pass
#     else:
#         prev = AdminSettings.objects.get(id=instance.id)
#         if prev.header_logo.name:
#             delete_file_task.delay(prev.header_logo.name)
#         if prev.footer_logo.name:
#             delete_file_task.delay(prev.header_logo.name)


# @receiver(pre_delete, sender=Hero)
# def hero_to_be_deleted(sender, instance, **kwargs):
#     if instance.image.name:
#         delete_file_task.delay(instance.image.name)


# @receiver(pre_delete, sender=AdminSettings)
# def admin_settings_to_be_deleted(sender, instance, **kwargs):

#     if instance.header_logo.name:
#         delete_file_task.delay(instance.header_logo.name)
#     if instance.footer_logo.name:
#         delete_file_task.delay(instance.footer_logo.name)

      