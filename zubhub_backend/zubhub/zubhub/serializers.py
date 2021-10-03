from rest_framework import serializers
from .models import StaticAssets, Hero, FAQ, Help, Privacy


class HeroSerializer(serializers.ModelSerializer):
    header_logo_url = serializers.SerializerMethodField('getHeaderLogoURL')
    footer_logo_url = serializers.SerializerMethodField('getFooterLogoURL')
    _cache_static_assets = None

    class Meta:
        model = Hero
        fields = [
            "id",
            "title",
            "description",
            "image_url",
            "activity_url",
            "explore_ideas_url",
            "header_logo_url",
            "footer_logo_url"
        ]

    def getHeaderLogoURL(self, _):
        if(self._cache_static_assets):
            if len(self._cache_static_assets) > 0:
                return self._cache_static_assets.last().header_logo_url
            else:
                return None
        else:
            self._cache_static_assets = StaticAssets.objects.all()
            if len(self._cache_static_assets) > 0:
                return self._cache_static_assets.last().header_logo_url
            else:
                return None

    def getFooterLogoURL(self, _):
        if(self._cache_static_assets):
            if len(self._cache_static_assets) > 0:
                return self._cache_static_assets.last().footer_logo_url
            else:
                return None
        else:
            self._cache_static_assets = StaticAssets.objects.all()
            if len(self._cache_static_assets) > 0:
                return self._cache_static_assets.last().footer_logo_url
            else:
                return None


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
