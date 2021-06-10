import json
import re
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from creators.serializers import CreatorSerializer
from .models import Project, Comment, Image, StaffPick, Category, Tag
from projects.tasks import filter_spam_task
from .pagination import ProjectNumberPagination
from .utils import update_images, update_tags, parse_comment_trees
import time
from math import ceil


Creator = get_user_model()


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    creator = serializers.SerializerMethodField('get_creator')
    created_on = serializers.DateTimeField(read_only=True)

    def save(self, **kwargs):
        comment = super().save(**kwargs)
        request = self.context.get("request")

        if comment and comment.id:
            ctx = {
                "comment_id": comment.id,
                "text": comment.text,
                "method": request.method,
                "REMOTE_ADDR": request.META["REMOTE_ADDR"],
                "HTTP_USER_AGENT": request.META["HTTP_USER_AGENT"],
                "lang": request.LANGUAGE_CODE
            }

            filter_spam_task.delay(ctx)
            return comment

    class Meta:
        model = Comment
        fields = [
            "id",
            "creator",
            "text",
            "created_on",
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
    comments = serializers.SerializerMethodField('get_comments')
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

    read_only_fields = ["created_on", "views_count"]

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

        for tag in tags:
            if (not re.fullmatch("[0-9A-Za-z\s\-]+", tag["name"])) or (tag["name"] == " "):
                raise serializers.ValidationError(
                    _("tags support only letters, numbers, spaces, and dashes")
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
        category = None
        if validated_data.get('category', None):
            category = validated_data.pop('category')

        project = Project.objects.create(**validated_data)

        for image in images_data:
            Image.objects.create(project=project, **image)

        for tag in tags_data:
            tag, created = Tag.objects.get_or_create(name=tag["name"])
            project.tags.add(tag)

        if category:
            category.projects.add(project)

        return project

    def update(self, project, validated_data):
        images_data = validated_data.pop('images')
        tags_data = self.validate_tags(self.initial_data["tags"])
        category = None
        if validated_data.get('category', None):
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
        if category:
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


class StaffPickSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField('paginated_projects')

    class Meta:
        model = StaffPick
        fields = [
            'id',
            'title',
            'description',
            'projects',
            'created_on',
        ]

    def paginated_projects(self, obj):
        projects = obj.projects.all()
        paginator = ProjectNumberPagination()
        page = paginator.paginate_queryset(
            projects, self.context['request'])
        serializer = ProjectSerializer(page, read_only=True, many=True, context={
            'request': self.context['request']})
        count = projects.count()
        num_pages = ceil(count/paginator.page_size)
        current_page = int(
            self.context["request"].query_params.get("page", "1"))
        if current_page != 1:
            prev_page = current_page - 1
        else:
            prev_page = None

        if current_page != num_pages:
            next_page = current_page + 1
        else:
            next_page = None

        return {"results": serializer.data, "prev": prev_page, "next": next_page, "count": count}
