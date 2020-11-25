from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

Creator = get_user_model()

UserAdmin.fieldsets += ('Personal Info', {'fields': ('avatar', 'phone', 'dateOfBirth', 'location', 'bio')}),
UserAdmin.readonly_fields += ("avatar"),

admin.site.register(Creator, UserAdmin)
