from django.contrib import admin
from .models import Privacy, FAQ, Help
from django_summernote.admin import SummernoteModelAdmin

# Register your models here.


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


admin.site.register(Privacy, PrivacyAdmin)
admin.site.register(Help, HelpAdmin)
admin.site.register(FAQ, FAQAdmin)
