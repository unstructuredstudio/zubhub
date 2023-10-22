from enum import Enum
from django.contrib import admin
from .models import AdminSettings, Hero, Privacy, FAQ, Help, Challenge, Ambassadors, Theme

## these models are imported to be unregsitered
from django_summernote.models import Attachment
from django_summernote.admin import SummernoteModelAdmin
from rest_framework.authtoken.models import TokenProxy
from django.contrib.auth.models import Group
from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken

class AdminSettingsAdmin(admin.ModelAdmin):
    exclude = ["id", "edited_by_id"]

    def save_model(self, request, obj, form, change):
        obj.edited_by_id = str(request.user.id)
        super().save_model(request, obj, form, change)


class HeroAdmin(admin.ModelAdmin):
    list_display = ["title", "image", "activity_url", "explore_ideas_url", "tinkering_resource_url"]
    search_fields = ["title", 'description']
    exclude = ["id"]


class PrivacyAdmin(SummernoteModelAdmin):
    summernote_fields = ('privacy_policy', 'terms_of_use',)
    readonly_fields = ["edited_on"]

class HelpAdmin(SummernoteModelAdmin):
    summernote_fields = ('about',)
    readonly_fields = ["edited_on"]

class ChallengeAdmin(SummernoteModelAdmin):
    summernote_fields = ('challenge',)
    readonly_fields = ["edited_on"]

class StatusEnum(Enum):
    INACTIVE = 0
    ACTIVE = 1

class ThemeAdmin(admin.ModelAdmin):
    list_display = ['Theme_Name', 'status']
    actions = ['make_selected_active']

    def make_selected_active(self, request, queryset):
        queryset.update(status=StatusEnum.INACTIVE.value)
        selected_themes = queryset.first()
        selected_themes.status = StatusEnum.ACTIVE.value
        selected_themes.save()

    make_selected_active.short_description = "Select and make active"

class FAQAdmin(SummernoteModelAdmin):
    summernote_fields = ('answer',)

class AmbassadorsAdmin(SummernoteModelAdmin):
    summernote_fields = ('ambassadors',)
    readonly_fields = ["edited_on"]
    search_fields = ["projects"]
    
admin.site.register(AdminSettings, AdminSettingsAdmin)
admin.site.register(Hero, HeroAdmin)
admin.site.register(Privacy, PrivacyAdmin)
admin.site.register(Help, HelpAdmin)
admin.site.register(Challenge, ChallengeAdmin)
admin.site.register(FAQ, FAQAdmin)
admin.site.register(Ambassadors, AmbassadorsAdmin)
admin.site.register(Theme, ThemeAdmin)

## Unregister some default and third-party models
admin.site.unregister(Attachment)
admin.site.unregister(TokenProxy)
admin.site.unregister(Group)
admin.site.unregister(Site)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)
