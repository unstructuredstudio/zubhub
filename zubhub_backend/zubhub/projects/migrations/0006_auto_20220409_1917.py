# Generated by Django 3.2 on 2022-04-09 19:17

from django.db import migrations
from django.contrib.postgres.operations import TrigramExtension


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0005_data_sanitization'),
    ]

    operations = [TrigramExtension()]
