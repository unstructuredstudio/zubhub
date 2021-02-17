from datetime import date

import re
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Location, PhoneNumber, Setting
from allauth.account.models import EmailAddress
from rest_auth.registration.serializers import RegisterSerializer
from allauth.account.utils import setup_user_email
from .utils import setup_user_phone

Creator = get_user_model()


class CreatorSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    phone = serializers.CharField(allow_blank=True, default="")
    email = serializers.EmailField(allow_blank=True, default="")
    followers = serializers.SlugRelatedField(
        slug_field="id", read_only=True, many=True)
    projects_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)
    dateOfBirth = serializers.DateField(read_only=True)
    location = serializers.SlugRelatedField(
        slug_field='name', queryset=Location.objects.all())

    class Meta:
        model = Creator
        fields = ('id', 'username', 'email', 'phone', 'avatar', 'location',
                  'dateOfBirth', 'bio', 'followers', 'following_count', 'projects_count')

    def validate_email(self, email):

        if(len(email) == 0 and len(self.initial_data.get("phone", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if(len(Creator.objects.filter(email=email)) > 0 and email != ""):
            if email == self.context.get("request").user.email:
                return email
            raise serializers.ValidationError(
                _("a user with that email address already exists"))

        if(self.context.get("request").user.email):
            raise serializers.ValidationError(
                _("to edit this field mail hello@unstructured.studio"))

        return email

    def validate_phone(self, phone):
        if(len(phone) == 0 and len(self.initial_data.get("email", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if re.search(r'^\+\d{9,15}$', phone) == None and phone != "":
            raise serializers.ValidationError(
                _("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."))

        if(len(Creator.objects.filter(phone=phone)) > 0 and phone != ""):
            if phone == self.context.get("request").user.phone:
                return phone
            raise serializers.ValidationError(
                _("a user with that phone number already exists"))

        if(self.context.get("request").user.phone):
            raise serializers.ValidationError(
                _("to edit this field mail hello@unstructured.studio"))

        return phone

    def update(self, user, validated_data):
        print("update was called")
        creator = super().update(user, validated_data)
        phone_number = PhoneNumber.objects.filter(user=creator)
        email_address = EmailAddress.objects.filter(user=creator)

        if(len(phone_number) < 1):
            setup_user_phone(creator)

        if(len(email_address) < 1):
            setup_user_email(self.context.get("request"), creator, [])

        return creator


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('name',)


class CustomRegisterSerializer(RegisterSerializer):
    phone = serializers.CharField(allow_blank=True, default="")
    email = serializers.EmailField(allow_blank=True, default="")
    dateOfBirth = serializers.DateField()
    location = serializers.SlugRelatedField(
        slug_field='name', queryset=Location.objects.all())
    bio = serializers.CharField(allow_blank=True, default="", max_length=255)
    subscribe = serializers.BooleanField(default=False)

    def validate_email(self, email):
        if(len(email) == 0 and len(self.initial_data.get("phone", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if(len(Creator.objects.filter(email=email)) > 0 and email != ""):
            raise serializers.ValidationError(
                _("A user with that email address already exists"))

        return email

    def validate_phone(self, phone):
        if(len(phone) == 0 and len(self.initial_data.get("email", "")) == 0):
            raise serializers.ValidationError(
                _("you must provide either email or phone number"))

        if re.search(r'^\+\d{9,15}$', phone) == None and phone != "":
            raise serializers.ValidationError(
                _("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."))

        if(len(Creator.objects.filter(phone=phone)) > 0 and phone != ""):
            raise serializers.ValidationError(
                _("A user with that phone number already exists"))

        return phone

    def validate_dateOfBirth(self, dateOfBirth):
        if((date.today() - dateOfBirth).days < 0):
            raise serializers.ValidationError(
                _("Date of Birth must be less than today's date"))
        return dateOfBirth

    def validate_location(self, location):
        if(len(location.name) < 1):
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
