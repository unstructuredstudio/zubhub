from rest_framework import serializers
from .models import Project, Comment, Image
from django.contrib.auth import get_user_model
from creators.serializers import CreatorSerializer

Creator = get_user_model()


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    creator = serializers.SlugRelatedField(
        slug_field='username', read_only=True)
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


class ProjectSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    likes = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True)

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
            "likes",
            "saved_by",
            "views_count",
            "comments"
        ]

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        project = Project.objects.create(**validated_data)
        for image in images_data:
            Image.objects.create(project=project, **image)
        return project


class ProjectListSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    likes = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "video",
            "views_count",
            "likes",
            "saved_by",
            "comments_count"
        ]
