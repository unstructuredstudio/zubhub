# Generated by Django 3.2 on 2022-10-04 00:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zubhub', '0006_hero_tinkering_resource_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ambassadors',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ambassadors', models.TextField(blank=True, null=True)),
                ('edited_on', models.DateTimeField(blank=True, null=True)),
            ],
            options={
                'verbose_name': 'Ambassadors',
                'verbose_name_plural': 'Ambassadors',
            },
        ),
    ]
