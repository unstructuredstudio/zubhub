# Generated by Django 3.2 on 2022-08-11 11:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0007_tag_tag_name_gin_idx'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=1000)),
                ('learning_goals', models.TextField(blank=True, max_length=10000)),
                ('facilitation_tips', models.TextField(blank=True, max_length=10000)),
                ('motivation', models.TextField(blank=True, max_length=10000)),
                ('video', models.URLField(blank=True, max_length=1000, null=True)),
                ('materials_used', models.CharField(max_length=5000)),
                ('views_count', models.IntegerField(blank=True, default=0)),
                ('saved_count', models.IntegerField(blank=True, default=0)),
                ('created_on', models.DateTimeField(default=django.utils.timezone.now)),
                ('publish', models.BooleanField(default=False)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='activities', to='projects.category')),
                ('creators', models.ManyToManyField(related_name='activities_created', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image_url', models.URLField(max_length=1000)),
                ('public_id', models.CharField(blank=True, max_length=1000)),
            ],
        ),
        migrations.CreateModel(
            name='InspiringExamples',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True, max_length=10000)),
                ('credit', models.CharField(blank=True, max_length=1000)),
                ('activity', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inspiring_examples', to='activities.activity')),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='activities.image')),
            ],
        ),
        migrations.CreateModel(
            name='InspiringArtist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('short_biography', models.TextField(blank=True, max_length=10000)),
                ('name', models.CharField(max_length=100)),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='activities.image')),
            ],
        ),
        migrations.CreateModel(
            name='ActivityMakingSteps',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(blank=True, max_length=10000)),
                ('order', models.IntegerField()),
                ('activity', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='making_steps', to='activities.activity')),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='activities.image')),
            ],
        ),
        migrations.CreateModel(
            name='ActivityImages',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('activity', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='activity_images', to='activities.activity')),
                ('image', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='activities.image')),
            ],
        ),
        migrations.AddField(
            model_name='activity',
            name='inspiring_artist',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='inspiring_artist_activities', to='activities.inspiringartist'),
        ),
        migrations.AddField(
            model_name='activity',
            name='materials_used_image',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='activities.image'),
        ),
        migrations.AddField(
            model_name='activity',
            name='saved_by',
            field=models.ManyToManyField(blank=True, related_name='activities_saved', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='activity',
            name='views',
            field=models.ManyToManyField(blank=True, related_name='activities_viewed', to=settings.AUTH_USER_MODEL),
        ),
    ]
