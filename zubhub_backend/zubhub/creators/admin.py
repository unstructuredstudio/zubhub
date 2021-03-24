from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import PhoneNumber, Setting

Creator = get_user_model()


class PhoneNumberAdmin(admin.ModelAdmin):
    list_display = ["phone", "verified", "primary"]
    search_fields = ["phone", "user__username"]
    list_filter = ['verified', "primary"]


class SettingAdmin(admin.ModelAdmin):
    list_filter = ["subscribe"]


UserAdmin.fieldsets += ('Personal Info',
                        {'fields': ('avatar', 'phone', 'dateOfBirth', 'location', 'bio')}),
UserAdmin.readonly_fields += ('avatar'),

admin.site.register(Creator, UserAdmin)
admin.site.register(PhoneNumber, PhoneNumberAdmin)
admin.site.register(Setting, SettingAdmin)
