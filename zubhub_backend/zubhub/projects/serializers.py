from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from creators.serializers import CreatorSerializer
from .models import Project, Comment, Image, Category, Tag
from .utils import update_images, update_tags
import time


Creator = get_user_model()


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    creator = CreatorSerializer(read_only=True)
    created_on = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "creator",
            "text",
            "created_on"
        ]


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = [
            "image_url",
            "public_id"
        ]


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = [
            "name"
        ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = [
            "id",
            "name"
        ]


class ProjectSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    likes = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, required=False)
    tags = TagSerializer(many=True, required=False, read_only=True)
    category = serializers.SlugRelatedField(
        slug_field="name", queryset=Category.objects.all(), required=False)
    created_on = serializers.DateTimeField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "images",
            "video",
            "materials_used",
            "tags",
            "category",
            "likes",
            "saved_by",
            "views_count",
            "comments",
            "created_on",
        ]

    def validate_video(self, video):
        if(video == "" and len(self.initial_data.get("images")) == 0):
            raise serializers.ValidationError(
                _("you must provide either image(s) or video url"))
        return video

    def validate_images(self, images):
        if(len(images) == 0 and len(self.initial_data["video"]) == 0):
            raise serializers.ValidationError(
                _("you must provide either image(s) or video url"))
        return images

    def validate_tags(self, tags):
        if not isinstance(tags, list):
            raise serializers.ValidationError(
                _("tags format not supported")
            )

        try:
            if len(tags) > 0:
                # attempt parsing tags
                list(map(lambda x: x["name"], tags))
        except:
            raise serializers.ValidationError(
                _("tags format not supported")
            )

        if len(tags) > 5:
            raise serializers.ValidationError(
                _("tags must not be more than 5")
            )
        return tags

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        tags_data = self.validate_tags(
            self.context['request'].data.get("tags", []))
        category = validated_data.pop('category')

        project = Project.objects.create(**validated_data)

        for image in images_data:
            Image.objects.create(project=project, **image)

        for tag in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag["name"])
            project.tags.add(tag)

        category.projects.add(project)

        return project

    def update(self, project, validated_data):
        images_data = validated_data.pop('images')
        tags_data = self.validate_tags(self.initial_data["tags"])
        category = validated_data.pop('category')

        project.title = validated_data.pop("title")
        project.description = validated_data.pop("description")
        project.video = validated_data.pop("video")
        project.materials_used = validated_data.pop("materials_used")

        project.save()

        update_images(project, images_data)
        update_tags(project, tags_data)

        old_category = project.category
        if old_category:
            old_category.projects.remove(project)
        category.projects.add(project)

        return project


class ProjectListSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    images = ImageSerializer(many=True)
    likes = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    created_on = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "video",
            "images",
            "views_count",
            "likes",
            "saved_by",
            "comments_count",
            "created_on",
        ]
