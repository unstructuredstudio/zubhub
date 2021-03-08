from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from creators.serializers import CreatorSerializer
from .models import *
from .pagination import ProjectNumberPagination
import time
from math import ceil


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


class ProjectSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    likes = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
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
