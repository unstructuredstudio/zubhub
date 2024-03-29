# Generated by Django 3.2 on 2022-03-08 11:40

import django.contrib.postgres.indexes
import django.contrib.postgres.search
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('creators', '0006_remove_creator_role_squashed_0007_alter_creator_followers'),
    ]

    operations = [
        migrations.AddField(
            model_name='creatortag',
            name='search_vector',
            field=django.contrib.postgres.search.SearchVectorField(null=True),
        ),
        migrations.AddIndex(
            model_name='creatortag',
            index=django.contrib.postgres.indexes.GinIndex(fields=['search_vector'], name='creators_cr_search__659ff3_gin'),
        ),
    ]
