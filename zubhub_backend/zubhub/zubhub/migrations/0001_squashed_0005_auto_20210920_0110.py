# Generated by Django 2.2.7 on 2021-09-20 04:33

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FAQ',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.TextField(blank=True, null=True)),
                ('answer', models.TextField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'FAQ',
                'verbose_name_plural': 'FAQs',
            },
        ),
        migrations.CreateModel(
            name='Help',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('about', models.TextField(blank=True, null=True)),
                ('edited_on', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Help',
                'verbose_name_plural': 'Help',
            },
        ),
        migrations.CreateModel(
            name='Privacy',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('privacy_policy', models.TextField(blank=True, null=True)),
                ('terms_of_use', models.TextField(blank=True, null=True)),
                ('edited_on', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Privacy',
                'verbose_name_plural': 'Privacy',
            },
        ),
        migrations.CreateModel(
            name='Hero',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('description', models.CharField(max_length=100, null=True)),
                ('image', models.ImageField(null=True, upload_to='')),
                ('image_url', models.URLField(blank=True, max_length=1000)),
                ('activity_url', models.URLField(max_length=1000, null=True)),
                ('explore_ideas_url', models.URLField(max_length=1000, null=True)),
            ],
            options={
                'verbose_name': 'Hero',
                'verbose_name_plural': 'Heroes',
            },
        ),
        migrations.CreateModel(
            name='StaticAssets',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('header_logo', models.FileField(null=True, upload_to='', validators=[django.core.validators.FileExtensionValidator(['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp'])])),
                ('header_logo_url', models.URLField(blank=True, max_length=1000)),
                ('footer_logo', models.FileField(null=True, upload_to='', validators=[django.core.validators.FileExtensionValidator(['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp'])])),
                ('footer_logo_url', models.URLField(blank=True, max_length=1000)),
            ],
            options={
                'verbose_name': 'StaticAssets',
                'verbose_name_plural': 'StaticAssets',
            },
        ),
    ]
