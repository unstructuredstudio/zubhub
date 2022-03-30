from rest_framework import serializers
from .models import Hero, FAQ, Help, Privacy, TinkeringResources


class HeroSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Hero
        fields  = [
            "id",
            "title",
            "description",
            "image_url",
            "activity_url",
            "explore_ideas_url"
        ]


class PrivacySerializer(serializers.ModelSerializer):

    class Meta:
        model = Privacy
        fields = [
            "privacy_policy",
            "terms_of_use",
            "edited_on"
        ]


class HelpSerializer(serializers.ModelSerializer):

    class Meta:
        model = Help
        fields = [
            "about",
        ]


class FAQListSerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQ
        fields = [
            "question",
            "answer"
        ]

class TinkeringResSerializer(serializers.ModelSerializer):

    class Meta:
        model = TinkeringResources
        fields = [
            "url",
        ]