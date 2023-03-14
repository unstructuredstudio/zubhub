from rest_framework import serializers
from .models import Hero, FAQ, Help, Challenge, Privacy, Ambassadors
from projects.pagination import ProjectNumberPagination
from projects.utils import get_published_projects_for_user
from projects.serializers import ProjectSerializer
from math import ceil
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils.translation import gettext as _
from rest_auth.serializers import PasswordResetSerializer

UserModel = get_user_model()

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
    
class CustomPasswordResetSerializer(PasswordResetSerializer):
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm
    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(_('Error'))

        if not UserModel.objects.filter(email=value).exists():

            raise serializers.ValidationError(_('Invalid e-mail address'))
        return value
    