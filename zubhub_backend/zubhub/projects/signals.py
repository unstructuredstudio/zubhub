from django.db.models.signals import pre_delete, post_save
from django.dispatch import receiver
import boto3
from django.conf import settings
from .models import Project, Image


@receiver(post_save, sender=Project)
def project_saved(sender, instance, **kwargs):
    instance.creator.projects_count = instance.creator.projects.count()
    instance.creator.save()


@receiver(pre_delete, sender=Image)
def image_to_be_deleted(sender, instance, **kwargs):
    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=settings.DOSPACE_REGION,
                            endpoint_url=settings.DOSPACE_ENDPOINT_URL,
                            aws_access_key_id=settings.DOSPACE_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.DOSPACE_ACCESS_SECRET_KEY)

    client.delete_object(Bucket="zubhub", Key=instance.public_id)
