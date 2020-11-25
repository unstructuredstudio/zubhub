from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers
from django.contrib.auth import get_user_model
from datetime import date

import re

from rest_auth.registration.serializers import RegisterSerializer

Creator = get_user_model()

class CreatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Creator
        fields = ('username','email','first_name','last_name','avatar','phone','dateOfBirth','location','bio',)


class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    phone = serializers.CharField(max_length=17)
    dateOfBirth = serializers.DateField()
    location = serializers.CharField(max_length=100)

    def validate_phone(self, phone):
        if re.search(r'^\+\d{9,15}$', phone) == None:
            raise serializers.ValidationError(
                    _("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."))
        if(len(Creator.objects.filter(phone=phone)) > 0):
            raise serializers.ValidationError(
                    _("A user with that phone number already exists"))
        return phone

    def validate_dateOfBirth(self, dateOfBirth):
        if((date.today() - dateOfBirth).days < 0):
            raise serializers.ValidationError(_("Date of Birth must be less than today's date"))
        return dateOfBirth

    def get_cleaned_data(self):
        data_dict = super().get_cleaned_data()
        data_dict['first_name'] = self.validated_data.get('first_name', '')
        data_dict['last_name'] = self.validated_data.get('last_name', '')
        data_dict['phone'] = self.validated_data.get('phone', '')
        data_dict['dateOfBirth'] = self.validated_data.get('dateOfBirth', '')
        data_dict['location'] = self.validated_data.get('location', '')
        
        return data_dict
