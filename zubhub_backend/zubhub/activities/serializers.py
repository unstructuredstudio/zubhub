
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
from projects.serializers import CategorySerializer, ProjectSerializer
from creators.serializers import CreatorMinimalSerializer
from .utils import *

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
        model = ActivityMakingStep
        fields = [
            "image", "description", "step_order"
        ]


class InspiringExampleSerializer(serializers.ModelSerializer):
    image = ImageSerializer()

    class Meta:
        model = InspiringExample
        fields = [
            "image", "description", "credit"
        ]


class ActivitySerializer(serializers.ModelSerializer):
    creators = CreatorMinimalSerializer(read_only=True, many=True)
    saved_by = serializers.SlugRelatedField(
        many=True, slug_field='id', read_only=True)
    images = ActivityImageSerializer(
        many=True, required=False, source="activity_images")
    category = serializers.SlugRelatedField(
        slug_field="name", queryset=Category.objects.all(), required=False)
    created_on = serializers.DateTimeField(read_only=True)
    views_count = serializers.IntegerField(read_only=True)
    saved_count = serializers.IntegerField(read_only=True)
    publish = serializers.BooleanField(required=False)
    inspiring_artist = InspiringArtistSerializer(required=False)
    making_steps = ActivityMakingStepSerializer(many=True, required=False)
    inspiring_examples = InspiringExampleSerializer(many=True, required=False)
    materials_used_image = ImageSerializer(required=False)
    inspired_projects = ProjectSerializer(many=True, required=False)

    class Meta:
        model = Activity
        fields = [
            "id",
            "inspired_projects",
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
        print('validated_data===>', validated_data)
        if 'inspiring_artist' in validated_data:
            validated_data['inspiring_artist'] = create_inspiring_artist(
                validated_data.pop('inspiring_artist'))
        if 'materials_used_image' in validated_data:
            validated_data['materials_used_image'] = Image.objects.create(
                **validated_data['materials_used_image'])

        activity_images = validated_data.pop('activity_images', None)

        making_steps = validated_data.pop('making_steps', None)

        inspiring_examples = validated_data.pop('inspiring_examples', None)

        activity = Activity.objects.create(**validated_data)
        if making_steps:
            create_making_steps(activity, making_steps)
        if inspiring_examples:
            create_inspiring_examples(
                activity, inspiring_examples)
        if activity_images:
            create_activity_images(activity, activity_images)
        activity.creators.add(self.context["request"].user)
        return activity

    def update(self, activity, validated_data):
        print('activity_to_update', activity)
        print('validated_data_from_update', validated_data)
        if (activity.inspiring_artist is not None or 'inspiring_artist' in validated_data):
            if(activity.inspiring_artist is not None):
                if('inspiring_artist' in validated_data):
                    # if('image' in validated_data['inspiring_artist']):
                    if(activity.inspiring_artist.image is not None or validated_data['inspiring_artist'].get('image') is not None):
                        activity.inspiring_artist.image = update_image(
                            activity.inspiring_artist.image, validated_data['inspiring_artist'].get('image'))

                        print('updated image', activity.inspiring_artist.image)
                    # if 'name' in validated_data['inspiring_artist']:
                    activity.inspiring_artist.name = validated_data['inspiring_artist'].get(
                        'name')
                    # if 'short_biography' in validated_data['inspiring_artist']:
                    activity.inspiring_artist.short_biography = validated_data[
                        'inspiring_artist'].get('short_biography')
                    activity.inspiring_artist.save()
                    print('after_inspiring_artist_update',
                          activity.inspiring_artist)
                else:
                    activity.inspiring_artist.delete()
                    activity.inspiring_artist = None
            else:
                if('image' in validated_data['inspiring_artist']):
                    validated_data['inspiring_artist']['image'] = Image.objects.create(
                        **validated_data['inspiring_artist']['image'])
                activity.inspiring_artist = InspiringArtist.objects.create(
                    **validated_data['inspiring_artist'])
                print('new_artist_in_validated_data', activity)
        if(activity.materials_used_image is not None or 'materials_used_image' in validated_data):
            if (activity.materials_used_image is None):
                activity.materials_used_image = Image.objects.create(
                    **validated_data['materials_used_image'])
            else:
                if('materials_used_image' in validated_data):
                    image = {**validated_data['materials_used_image']}
                    print('image_of_materials', image)
                    activity.materials_used_image.file_url = image['file_url']
                    activity.materials_used_image.public_id = image['public_id']
                    activity.materials_used_image.save()
                else:
                    activity.materials_used_image.delete()
                    activity.materials_used_image = None
        if 'activity_images' in validated_data:
            update_activity_images(
                activity, validated_data.pop('activity_images'))
        if 'making_steps' in validated_data:
            update_making_steps(activity, validated_data.pop('making_steps'))
        if 'inspiring_examples' in validated_data:
            update_inspiring_examples(
                activity, validated_data.pop('inspiring_examples'))
        activity.title = validated_data.get('title')
        activity.motivation = validated_data.get('motivation')
        activity.facilitation_tips = validated_data.get('facilitation_tips')
        activity.learning_goals = validated_data.get('learning_goals')
        activity.materials_used = validated_data.get('materials_used')
        activity.video = validated_data.get('video')
        activity.save()
        return activity
