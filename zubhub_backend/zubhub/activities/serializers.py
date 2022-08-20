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
            "file_url",
            "public_id"
        ]


class InspiringArtistSerializer(serializers.ModelSerializer):
    image = ImageSerializer(required=False)    
    
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
    image = ImageSerializer(required=False, allow_null=True)
    step_order = serializers.IntegerField()
    
    class Meta:
        model= ActivityMakingStep
        fields = [
           "image","description","step_order"
        ]   
        
        
class InspiringExampleSerializer(serializers.ModelSerializer):
    image = ImageSerializer()   
    
    class Meta:
        model= InspiringExample
        fields = [
           "image","description","credit"
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
    publish =  serializers.BooleanField(required=False)
    inspiring_artist = InspiringArtistSerializer(required=False)
    making_steps = ActivityMakingStepSerializer(many=True, required=False)
    inspiring_examples = InspiringExampleSerializer(many=True, required=False)
    materials_used_image = ImageSerializer(required=False)
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
            "inspiring_examples",
            "materials_used_image"
        ]
    
    def create(self, validated_data):
        print('user_from_serializer',self.context["request"].user)
        print(validated_data, 'activity_validated_data')
        inspiring_artist_data = validated_data.pop('inspiring_artist')
        print('inspiringArtistData',inspiring_artist_data)
        inspiring_artist_data['image'] = Image.objects.create(**inspiring_artist_data['image'])
        
        validated_data['inspiring_artist'] = InspiringArtist.objects.create(**inspiring_artist_data)
        materials_used_image = validated_data['materials_used_image']
        if(materials_used_image):
            validated_data['materials_used_image'] = Image.objects.create(**materials_used_image)
        activity_images  = validated_data.pop('activity_images')  
        making_steps = validated_data.pop('making_steps')
        inspiring_examples = validated_data.pop('inspiring_examples')
        print('afterArtistStor', validated_data)
        activity = Activity.objects.create(**validated_data)
        for activity_image in activity_images:
            saved_image = Image.objects.create(**activity_image['image'])
            ActivityImage.objects.create(activity= activity,image= saved_image)
        for step in making_steps:
            if(step['image']):
                saved_image = Image.objects.create(**step['image'])
                step['image'] = saved_image
            ActivityMakingStep.objects.create(activity= activity,**step)
        for example in inspiring_examples:
            saved_image = Image.objects.create(**example['image'])
            example['image'] = saved_image
            InspiringExample.objects.create(activity= activity,**example)  
        activity.creators.add(self.context["request"].user)           
        return activity

   