# Generated by Django 3.2 on 2023-08-31 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('activities', '0015_alter_activity_learning_goals'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activity',
            name='facilitation_tips',
            field=models.TextField(blank=True, max_length=10000, null=True),
        ),
        migrations.AlterField(
            model_name='activity',
            name='motivation',
            field=models.TextField(blank=True, max_length=10000, null=True),
        ),
    ]
