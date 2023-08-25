from django.contrib.auth.forms import PasswordResetForm
from rest_framework.response import Response
from datetime import date
import re
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
import csv
from .admin import badges
from .models import CreatorGroup, Creator, CreatorGroupMembership
from .models import Location, PhoneNumber
from allauth.account.models import EmailAddress
from rest_auth.registration.serializers import RegisterSerializer
from rest_auth.serializers import PasswordResetSerializer
from allauth.account.utils import setup_user_email
from .utils import setup_user_phone
from projects.models import Comment
from projects.utils import parse_comment_trees
from rest_framework.validators import UniqueValidator
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

    read_only_fields = ["id", "projects_count",
                        "following_count", "tags", "badges"]

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

        # There is a need to really start thinking about optimizing our queries
        # to limit/eliminate n+1 queries problem (i.e selecte_related and prefetch_related )
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


class CreatorGroupMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatorGroup
        fields = '__all__'

class CreatorGroupMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreatorGroupMembership
        fields = ('member', 'role')


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
    group_memberships = CreatorGroupMembershipSerializer(many=True, read_only=True)


    class Meta:
        model = Creator

        fields = ('id', 'username', 'email', 'phone', 'avatar', 'location',
                  'comments', 'dateOfBirth', 'bio', 'followers',
                  'following_count', 'projects_count', 'members_count', 'tags', 'badges', 'group_memberships')

    read_only_fields = [
        "id", "projects_count", "following_count", "dateOfBirth", "tags", "badges", "group_memberships"
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

    def validate_username(self, username):
        # Check if the value is a valid email
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if re.match(pattern, username):
            # If it's a valid email, raise an error
            raise serializers.ValidationError(_("Username cannot be an email."))
        
        return username

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


class MemberRoleSerializer(serializers.Serializer):
    member = serializers.CharField()
    role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('member', 'Member')])


class AddGroupMembersSerializer(serializers.Serializer):
    group_members = MemberRoleSerializer(many=True, required=True)

    def validate(self, data):
        group_members = data.get('group_members', [])

        if not group_members:
            raise serializers.ValidationError(_("You must submit at least one group member."))

        return data
    

class CustomPasswordResetSerializer(PasswordResetSerializer):
    password_reset_form_class = PasswordResetForm

    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(
            data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(_('Error'))

        if not Creator.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                _('No account found with this email. Verify and try again.'))
        return value


class CreatorGroupWithMembershipsSerializer(serializers.ModelSerializer):
    members = CreatorGroupMembershipSerializer(many=True)

    class Meta:
        model = CreatorGroup
        fields = ('groupname', 'description', 'members', 'created_on', 'projects_count')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['members'] = CreatorGroupMembershipSerializer(instance.memberships.all(), many=True).data
        return data


class CreatorGroupSerializer(serializers.ModelSerializer):
    members = CreatorGroupMembershipSerializer(many=True, read_only=True)
    groupname = serializers.CharField(
        max_length=150,
        validators=[UniqueValidator(queryset=CreatorGroup.objects.all())],
        error_messages={
            'unique': _('A group with that groupname already exists.'),
        }
    )

    class Meta:
        model = CreatorGroup
        fields = ('groupname', 'description', 'projects','members', 'created_on', 'projects_count', 'avatar')

    def create(self, validated_data):
        members_data = validated_data.pop('members', [])
        group = CreatorGroup.objects.create(**validated_data)
        for member_data in members_data:
            member = member_data['member']
            role = member_data.get('role', 'member')  # Default role is 'member' if not provided
            CreatorGroupMembership.objects.create(group=group, member=member, role=role)
        return group
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['members'] = CreatorGroupMembershipSerializer(instance.memberships.all(), many=True).data
        return data

    def update(self, instance, validated_data):
        instance.groupname = validated_data.get('groupname', instance.groupname)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        members_data = validated_data.pop('members', [])
        existing_members = set(instance.members.all())

        for member_data in members_data:
            member = member_data['member']
            role = member_data.get('role', 'member')  # Default role is 'member' if not provided

            # Check if the member is already part of the group
            if member in existing_members:
                membership = CreatorGroupMembership.objects.get(group=instance, member=member)
                membership.role = role
                membership.save()
            else:
                # If the member is not part of the group, add them with the specified role
                CreatorGroupMembership.objects.create(group=instance, member=member, role=role)

        # Remove any members who were not included in the updated data
        members_to_remove = existing_members - set([member_data['member'] for member_data in members_data])
        CreatorGroupMembership.objects.filter(group=instance, member__in=members_to_remove).delete()

        return instance
