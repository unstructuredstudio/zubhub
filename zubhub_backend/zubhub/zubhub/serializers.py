from rest_framework import serializers
from .models import Hero, FAQ, Help, Challenge, Privacy, Ambassadors, Theme
from projects.pagination import ProjectNumberPagination
from projects.utils import get_published_projects_for_user
from projects.serializers import ProjectSerializer
from math import ceil



class HeroSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    class Meta:
        model = Hero
        fields  = [
            "id",
            "title",
            "description",
            "image_url",
            "activity_url",
            "explore_ideas_url",
            "tinkering_resource_url",
        ]

    def get_image_url(self, instance):
        return instance.image.name


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

class ChallengeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Challenge
        fields = [
            "challenge",
        ]

class FAQListSerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQ
        fields = [
            "question",
            "answer"
        ]


class AmbassadorsSerializer(serializers.ModelSerializer):
    projects = serializers.SerializerMethodField('paginated_projects')

    class Meta:
        model = Ambassadors
        fields = [
            "ambassadors",
            "projects"
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
    
class ThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Theme
        fields = '__all__'