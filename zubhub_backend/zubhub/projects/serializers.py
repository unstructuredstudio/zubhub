import re
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from django.db import transaction
from creators.serializers import CreatorMinimalSerializer
from .models import Project, Comment, Image, StaffPick, Category, Tag, PublishingRule
from projects.tasks import filter_spam_task
from .pagination import ProjectNumberPagination
from .utils import update_images, update_tags, parse_comment_trees, get_published_projects_for_user
from .tasks import update_video_url_if_transform_ready, delete_file_task
from math import ceil


Creator = get_user_model()


class PublishingRuleSerializer(serializers.ModelSerializer):
    visible_to = CreatorMinimalSerializer(read_only=True, many=True)
    class Meta:
        model = PublishingRule
        fields = [
            "type",
            "visible_to"
        ]

class CommentSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    creator = serializers.SerializerMethodField('get_creator')
    created_on = serializers.DateTimeField(read_only=True)
    publish = PublishingRuleSerializer(read_only=True)

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
            "publish"
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
    creator = CreatorMinimalSerializer(read_only=True)
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
    publish =  PublishingRuleSerializer(read_only=True)

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
            "publish"
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

        user = self.context.get("request").user
        return parse_comment_trees(user, root_comments, creators_dict)

    def validate_title(self, title):
        if self.initial_data["publish"]["type"] == PublishingRule.DRAFT:
            return title
        else:
            if (title == ""):
                raise serializers.ValidationError(
                _("You must provide a title!"))
            return title

    def validate_materials_used(self, materials_used):
        print("HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        if self.initial_data["publish"]["type"] == PublishingRule.DRAFT:
            return materials_used
        else:
            if(materials_used == None):
                raise serializers.ValidationError(
                    _("You must provide materials used!"))
            return materials_used 

    def validate_video(self, video):
        if self.initial_data["publish"]["type"] == PublishingRule.DRAFT:
            return video
        else:
            if(video == "" and len(self.initial_data.get("images")) == 0):
                raise serializers.ValidationError(
                _("You must provide either image(s), video file, or video URL to create your project!"))
            return video

    def validate_images(self, images):
        if self.initial_data["publish"]["type"] == PublishingRule.DRAFT:
            return images
        else:
            if(len(images) == 0 and len(self.initial_data["video"]) == 0):
                raise serializers.ValidationError(
                    _("You must provide either image(s), video file, or video URL to create your project!"))
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

    def validate_publish(self, publish):

        try:

            if publish["type"] not in [
                PublishingRule.DRAFT, PublishingRule.PUBLIC,
                PublishingRule.AUTHENTICATED_VIEWERS, PublishingRule.PREVIEW]:
                raise serializers.ValidationError(
                    _("publish type is not supported. must be one of 1,2,3 or 4")
                )

            if not isinstance(publish["visible_to"], list):
                raise serializers.ValidationError(
                    _("publish visible_to must be a list")
                )

            if (publish["type"] == PublishingRule.PREVIEW and
                len(publish["visible_to"]) == 0):
                raise serializers.ValidationError(
                    _("publish visible_to must not be empty when publish type is Preview")
                )

        except:
             raise serializers.ValidationError(
                 _("publish format is not supported")
             )

        return publish
        

    def create(self, validated_data):
        images_data = validated_data.pop('images')
        tags_data = self.validate_tags(self.context['request'].data.get("tags", []))
        category = None
        if validated_data.get('category', None):
            category = validated_data.pop('category')

        publish = self.validate_publish(self.context['request'].data.get("publish", {}))

        with transaction.atomic():

            rule = PublishingRule.objects.create(type=publish["type"], 
                        publisher_id=str(self.context["request"].user.id))
            
            if rule.type == PublishingRule.PREVIEW:
                rule.visible_to.set(Creator.objects.filter(username__in=publish["visible_to"]))
            
            project = Project.objects.create(**validated_data, publish=rule)


            for image in images_data:
                Image.objects.create(project=project, **image)

            for tag in tags_data:
                tag, _ = Tag.objects.get_or_create(name=tag["name"])
                project.tags.add(tag)

            if category:
                category.projects.add(project)

            if project.video != None: 
                if project.video.find("cloudinary.com") > -1 and project.video.split(".")[-1] != "mpd":
                    update_video_url_if_transform_ready.delay(
                        {"url": project.video, "project_id": project.id})

            return project

    def update(self, project, validated_data):
        print(validated_data)
        images_data = validated_data.pop('images')
        tags_data = self.validate_tags(self.initial_data.get("tags", []))
        publish = self.validate_publish(self.initial_data.get("publish", {}))

        category = None
        if validated_data.get('category', None):
            category = validated_data.pop('category')

        video_data = validated_data.pop("video")

        if (project.video.find("cloudinary.com") > -1 or
            project.video.startswith("{0}://{1}".format(
            settings.DEFAULT_MEDIA_SERVER_PROTOCOL,
            settings.DEFAULT_MEDIA_SERVER_DOMAIN)) and 
            project.video != video_data):
            delete_file_task.delay(project.video)

        with transaction.atomic():

            rule = PublishingRule.objects.create(type=publish["type"], 
                        publisher_id=str(self.context["request"].user.id))

            if rule.type == PublishingRule.PREVIEW:
                rule.visible_to.set(Creator.objects.filter(username__in=publish["visible_to"]))

            project.title = validated_data.pop("title")
            project.description = validated_data.pop("description")
            project.video = video_data
            # project.materials_used = validated_data.pop("materials_used")

            materials_used = None
            if validated_data.get('materials_used', None):
                materials_used = validated_data.pop('materials_used')

            project.publish = rule
                
            project.save()

            update_images(project, images_data)
            update_tags(project, tags_data)

            old_category = project.category
            if old_category:
                old_category.projects.remove(project)
            if category:
                category.projects.add(project)

            if project.video.find("cloudinary.com") > -1 and project.video.split(".")[-1] != "mpd":
                update_video_url_if_transform_ready.delay(
                    {"url": project.video, "project_id": project.id})

            return project


class ProjectListSerializer(serializers.ModelSerializer):
    creator = CreatorMinimalSerializer(read_only=True)
    images = ImageSerializer(many=True)
    likes = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    created_on = serializers.DateTimeField(read_only=True)
    publish =  PublishingRuleSerializer(read_only=True)

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
            "publish"
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

        projects = get_published_projects_for_user(
                    self.context['request'].user, 
                    projects)

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
