from rest_framework import serializers
from .models import Project, Comment
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


class ProjectSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    likes = serializers.SlugRelatedField(
        many=True, slug_field='username', queryset=Creator.objects.all())
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "video",
            "materials_used",
            "likes",
            "views_count",
            "comments"
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "video",
            "views_count",
            "likes_count",
            "comments_count"
        ]
