import json
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from creators.serializers import CreatorSerializer
from .models import Project, Image, Comment
from .utils import parse_comment_trees


Creator = get_user_model()


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    creator = serializers.SerializerMethodField('get_creator')
    created_on = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "creator",
            "text",
            "created_on"
        ]

    def get_creator(self, obj):
        return {"id": str(obj.creator.id), "username": obj.creator.username, "avatar": obj.creator.avatar}


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
    comments = serializers.SerializerMethodField('get_comments')
    images = ImageSerializer(many=True, required=False)
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
            "likes",
            "saved_by",
            "views_count",
            "comments",
            "created_on",
        ]

    def get_comments(self, obj):
        all_comments = obj.comments.all()
        root_comments = []
        creators_dict = {}

        for comment in all_comments:
            if comment.is_root():
                root_comments.append(comment)

        all_comments = CommentSerializer(all_comments, many=True).data

        for comment in all_comments:
            creators_dict[comment["creator"]["id"]] = comment["creator"]

        root_comments = list(
            map(lambda x: Comment.dump_bulk(x)[0], root_comments))

        return parse_comment_trees(root_comments, creators_dict)

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

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        project = Project.objects.create(**validated_data)
        for image in images_data:
            Image.objects.create(project=project, **image)
        return project

    def update(self, project, validated_data):
        images_data = validated_data.pop('images')

        project.title = validated_data.pop("title")
        project.description = validated_data.pop("description")
        project.video = validated_data.pop("video")
        project.materials_used = validated_data.pop("materials_used")

        project.save()

        images = project.images.all()
        images_to_save = []
        if len(images) != len(images_data):
            for image_dict in images_data:
                exist = False
                for image in images:
                    if image_dict["image_url"] == image.image_url:
                        exist = True
                if not exist:
                    images_to_save.append(image_dict)

            for image in images:
                image.delete()

        for image in images_to_save:
            Image.objects.create(project=project, **image)

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
