
#from typing_extensions import Required
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from projects.serializers import CategorySerializer
from creators.serializers import CreatorMinimalSerializer

Creator = get_user_model()


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = [
            "image_url",
            "public_id"
        ]


class InspiringArtistSerializer(serializers.ModelSerializer):
    image = ImageSerializer()    
    
    class Meta:
        model = InspiringArtist
        fields = [
            "id",
            "name",
            "short_biography",
            "image"
        ]
        

class ActivityImageSerializer(serializers.ModelSerializer):
    image = ImageSerializer()
    
    class Meta:
        model = ActivityImage
        fields = [
            "image"
        ]
        
        
class ActivityMakingStepSerializer(serializers.ModelSerializer):
    image = ImageSerializer()
    step_order = serializers.IntegerField()
    
    class Meta:
        model= ActivityMakingStep
        fields = [
           "image","description","step_order"
        ]   
        
        
class InspiringExampleSerializer(serializers.ModelSerializer):
    image = ImageSerializer()
    order = serializers.IntegerField()   
    
    class Meta:
        model= InspiringExample
        fields = [
           "image","description","order"
        ]               


class ActivitySerializer(serializers.ModelSerializer):
    creators = CreatorMinimalSerializer(read_only=True, many=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    images = ActivityImageSerializer(many=True, required=False, source="activity_images")
    category = serializers.SlugRelatedField(
        slug_field="name", queryset=Category.objects.all(), required=False)
    created_on = serializers.DateTimeField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)
    saved_count = serializers.IntegerField(read_only=True)
    publish =  serializers.BooleanField()
    inspiring_artist = InspiringArtistSerializer()
    making_steps = ActivityMakingStepSerializer(many=True, required=False)
    inspiring_examples = InspiringExampleSerializer(many=True, required=False)
    
    class Meta:
        model = Activity
        fields = [
            "id",
            "creators",
            "title",
            "motivation",
            "images",
            "video",
            "materials_used",
            "facilitation_tips",
            "category",
            "learning_goals",
            "saved_by",
            "views_count",
            "saved_count",
            "inspiring_artist",
            "created_on",
            "publish",
            "making_steps",
            "inspiring_examples"
        ]
    
    def create(self, validated_data):
        print(validated_data, 'activity_validated_data')
        # images_data = validated_data.pop('images')
        # category = None
        # # if validated_data.get('category', None):
        # #     category = validated_data.pop('category')
        
        # artist_image = Image.objects.create()
        # activity = Activity.objects.create(**validated_data)

        # for image in images_data:
        #     Image.objects.create(project=project, **image)

        # for tag in tags_data:
        #     tag, _ = Tag.objects.get_or_create(name=tag["name"])
        #     project.tags.add(tag)

        # if category:
        #     category.projects.add(project)

        # if project.video.find("cloudinary.com") > -1 and project.video.split(".")[-1] != "mpd":
        #     update_video_url_if_transform_ready.delay(
        #         {"url": project.video, "project_id": project.id})

        return activity

   