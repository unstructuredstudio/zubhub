from datetime import date
import re
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model

from .admin import badges
from .models import Location, PhoneNumber
from allauth.account.models import EmailAddress
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account.utils import setup_user_email
from .utils import setup_user_phone
from projects.models import Comment
from projects.utils import parse_comment_trees

Creator = get_user_model()


class CreatorMinimalSerializer(serializers.ModelSerializer):
    followers = serializers.SlugRelatedField(slug_field="id",
                                             read_only=True,
                                             many=True)
    comments = serializers.SerializerMethodField('get_profile_comments')
    projects_count = serializers.SerializerMethodField()
    following_count = serializers.IntegerField(read_only=True)
    members_count = serializers.SerializerMethodField('get_members_count')
    tags = serializers.SlugRelatedField(slug_field="name",
                                        read_only=True,
                                        many=True)
    badges = serializers.SlugRelatedField(slug_field="badge_title",
                                            read_only=True,
                                            many=True)

    class Meta:
        model = Creator

        fields = ('id', 'username', 'avatar', 'comments', 'bio', 'followers',
                  'following_count', 'projects_count', 'members_count', 'tags', 'badges')

    read_only_fields = ["id", "projects_count", "following_count", "tags", "badges"]

    def get_members_count(self, obj):
        if hasattr(obj, "creatorgroup"):
            return obj.creatorgroup.members.count()
        else:
            return None

    def get_projects_count(self, obj):
        if hasattr(obj, "creatorgroup"):
            return obj.creatorgroup.projects_count
        else:
            return obj.projects_count

    def get_profile_comments(self, obj):
        from projects.serializers import CommentSerializer

        ## There is a need to really start thinking about optimizing our queries
        ## to limit/eliminate n+1 queries problem (i.e selecte_related and prefetch_related )
        all_comments = obj.profile_comments.all()
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


class CreatorSerializer(CreatorMinimalSerializer):
    phone = serializers.CharField(allow_blank=True, default="")
    email = serializers.EmailField(allow_blank=True, default="")
    dateOfBirth = serializers.DateField(read_only=True)
    location = serializers.SlugRelatedField(slug_field='name',
                                            queryset=Location.objects.all())
    tags = serializers.SlugRelatedField(slug_field="name",
                                        read_only=True,
                                        many=True)
    badges = serializers.SlugRelatedField(slug_field="badge_title",
                                            read_only=True,
                                            many=True)
    class Meta:
        model = Creator

        fields = ('id', 'username', 'email', 'phone', 'avatar', 'location',
                  'comments', 'dateOfBirth', 'bio', 'followers',
                  'following_count', 'projects_count', 'members_count', 'tags', 'badges')

    read_only_fields = [
        "id", "projects_count", "following_count", "dateOfBirth", "tags", "badges"
    ]

    def validate_email(self, email):

        if (len(email) == 0 and len(self.initial_data.get("phone", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if (Creator.objects.filter(email=email).count() > 0 and email != ""):
            if email == self.context.get("request").user.email:
                return email
            raise serializers.ValidationError(
                _("a user with that email address already exists"))

        if (self.context.get("request").user.email):
            raise serializers.ValidationError(
                _("to edit this field mail hello@unstructured.studio"))

        return email

    def validate_phone(self, phone):
        if (len(phone) == 0 and len(self.initial_data.get("email", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if re.search(r'^\+\d{9,15}$', phone) == None and phone != "":
            raise serializers.ValidationError(
                _("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
                  ))

        if (Creator.objects.filter(phone=phone).count() > 0 and phone != ""):
            if phone == self.context.get("request").user.phone:
                return phone
            raise serializers.ValidationError(
                _("a user with that phone number already exists"))

        if (self.context.get("request").user.phone):
            raise serializers.ValidationError(
                _("to edit this field mail hello@unstructured.studio"))

        return phone

    def update(self, user, validated_data):
        creator = super().update(user, validated_data)
        phone_number = PhoneNumber.objects.filter(user=creator)
        email_address = EmailAddress.objects.filter(user=creator)

        if (len(phone_number) < 1):
            setup_user_phone(creator)

        if (len(email_address) < 1):
            setup_user_email(self.context.get("request"), creator, [])

        return creator


class CreatorListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Creator

        fields = [
            "id",
            "avatar",
            "phone",
            "username",
            "bio",
            "followers",
            "followers_count",
            "following_count",
            "projects_count",
            "tags",
        ]


class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = ('name', )


class CustomRegisterSerializer(RegisterSerializer):
    phone = serializers.CharField(allow_blank=True, default="")
    email = serializers.EmailField(allow_blank=True, default="")
    dateOfBirth = serializers.DateField()
    location = serializers.SlugRelatedField(slug_field='name',
                                            queryset=Location.objects.all())
    bio = serializers.CharField(allow_blank=True, default="", max_length=255)
    subscribe = serializers.BooleanField(default=False)

    def validate_email(self, email):
        if (len(email) == 0 and len(self.initial_data.get("phone", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if (Creator.objects.filter(email=email).count() > 0 and email != ""):
            raise serializers.ValidationError(
                _("A user with that email address already exists"))

        return email

    def validate_phone(self, phone):
        if (len(phone) == 0 and len(self.initial_data.get("email", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if re.search(r'^\+\d{9,15}$', phone) == None and phone != "":
            raise serializers.ValidationError(
                _("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
                  ))

        if (Creator.objects.filter(phone=phone).count() > 0 and phone != ""):
            raise serializers.ValidationError(
                _("A user with that phone number already exists"))

        return phone

    def validate_dateOfBirth(self, dateOfBirth):
        if ((date.today() - dateOfBirth).days < 0):
            raise serializers.ValidationError(
                _("Date of Birth must be less than today's date"))
        return dateOfBirth

    def validate_location(self, location):
        if (len(location.name) < 1):
            raise serializers.ValidationError(_("Location is required"))
        return location

    def get_cleaned_data(self):
        data_dict = super().get_cleaned_data()
        data_dict['phone'] = self.validated_data.get('phone', '')
        data_dict['dateOfBirth'] = self.validated_data.get('dateOfBirth', '')
        data_dict['location'] = self.validated_data.get('location', '')
        data_dict['bio'] = self.validated_data.get('bio', '')
        data_dict['subscribe'] = self.validated_data.get('subscribe', '')

        return data_dict

    def save(self, request):
        creator = super().save(request)
        setup_user_phone(creator)
        return creator


class VerifyPhoneSerializer(serializers.Serializer):
    key = serializers.CharField()


class ConfirmGroupInviteSerializer(serializers.Serializer):
    key = serializers.CharField()


class AddGroupMembersSerializer(serializers.Serializer):
    group_members = serializers.JSONField(required=False, allow_null=True)
    csv = serializers.FileField(required=False,
                                allow_null=True,
                                allow_empty_file=True)

    def validate_group_members(self, group_members):
        if (len(group_members) == 0 and not self.initial_data.get("csv")):
            raise serializers.ValidationError(
                _("you must submit group member usernames either through the form or as csv"
                  ))
        return group_members

    def validate_csv(self, csv):
        if (not csv and len(self.initial_data.get("group_members")) == 0):
            raise serializers.ValidationError(
                _("you must submit group member usernames either through the form or as csv"
                  ))
        return csv
