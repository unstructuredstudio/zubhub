from django.contrib import admin
from .models import AdminSettings, Hero, Privacy, FAQ, Help, TinkeringResources

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
    list_display = ["title", "image", "activity_url", "explore_ideas_url"]
    search_fields = ["title", 'description']
    exclude = ["id"]


class PrivacyAdmin(SummernoteModelAdmin):
    summernote_fields = ('privacy_policy', 'terms_of_use',)
    readonly_fields = ["edited_on"]

    class Media:
        js = ('http://code.jquery.com/jquery-3.1.1.js', 'js/main.js',)


class HelpAdmin(SummernoteModelAdmin):
    summernote_fields = ('about',)
    readonly_fields = ["edited_on"]

    class Media:
        js = ('http://code.jquery.com/jquery-3.1.1.js', 'js/main.js',)


class FAQAdmin(SummernoteModelAdmin):
    summernote_fields = ('answer',)

    class Media:
        js = ('http://code.jquery.com/jquery-3.1.1.js', 'js/main.js',)


admin.site.register(AdminSettings, AdminSettingsAdmin)
admin.site.register(Hero, HeroAdmin)
admin.site.register(Privacy, PrivacyAdmin)
admin.site.register(Help, HelpAdmin)
admin.site.register(FAQ, FAQAdmin)
admin.site.register(TinkeringResources)

## Unregister some default and third-party models
admin.site.unregister(Attachment)
admin.site.unregister(TokenProxy)
admin.site.unregister(Group)
admin.site.unregister(Site)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(SocialToken)