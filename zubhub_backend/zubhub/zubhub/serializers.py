from rest_framework import serializers
from .models import FAQ, Help, Privacy


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
