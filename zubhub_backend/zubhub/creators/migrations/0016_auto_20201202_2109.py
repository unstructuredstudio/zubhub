# Generated by Django 2.2.7 on 2020-12-02 21:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('creators', '0015_auto_20201130_1439'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='creator',
            name='followers',
        ),
        migrations.DeleteModel(
            name='ActivityLog',
        ),
    ]
