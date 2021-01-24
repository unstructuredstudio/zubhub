from datetime import date

from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Location
from rest_auth.registration.serializers import RegisterSerializer

Creator = get_user_model()


class CreatorSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    followers = serializers.SlugRelatedField(
        slug_field="id", read_only=True, many=True)
    location = serializers.SlugRelatedField(
        slug_field='name', queryset=Location.objects.all())

    class Meta:
        model = Creator
        fields = ('id', 'username', 'email', 'avatar', 'location',
                  'dateOfBirth', 'bio', 'followers', 'following_count', 'projects_count')


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('name',)


class CustomRegisterSerializer(RegisterSerializer):
    dateOfBirth = serializers.DateField()
    location = serializers.SlugRelatedField(
        slug_field='name', queryset=Location.objects.all())

    # def validate_phone(self, phone):
    #     if re.search(r'^\+\d{9,15}$', phone) == None:
    #         raise serializers.ValidationError(
    #                 _("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."))
    #     if(len(Creator.objects.filter(phone=phone)) > 0):
    #         raise serializers.ValidationError(
    #                 _("A user with that phone number already exists"))
    #     return phone

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
        data_dict['dateOfBirth'] = self.validated_data.get('dateOfBirth', '')
        data_dict['location'] = self.validated_data.get('location', '')

        return data_dict
