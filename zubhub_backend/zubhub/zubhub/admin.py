import uuid
from math import floor
from django.utils.text import slugify
from .utils import upload_file_to_media_server
from django.contrib import admin
from .models import StaticAssets, Hero, Privacy, FAQ, Help
from django_summernote.admin import SummernoteModelAdmin
from projects.tasks import delete_file_task

# Register your models here.


class StaticAssetsAdmin(admin.ModelAdmin):
    list_display = ["header_logo_url", "footer_logo_url"]

    def get_readonly_fields(self, request, obj=None):
        return ["id", "header_logo_url", "footer_logo_url"]

    def save_model(self, request, obj, form, change):
        submitted_header_logo = form.cleaned_data.pop("header_logo")
        submitted_footer_logo = form.cleaned_data.pop("footer_logo")

        if obj.header_logo_url:
            delete_file_task.delay(obj.header_logo_url)

        if obj.footer_logo_url:
            delete_file_task.delay(obj.footer_logo_url)

        key = str(uuid.uuid4())
        key = key[0: floor(len(key)/6)]
        key = '{0}/{1}-{2}'.format("zubhub",
                                   slugify(submitted_header_logo.name), key)

        res = upload_file_to_media_server(
            file=submitted_header_logo, key=key)
        res = res.json()
        header_logo_url = res["url"]

        key = str(uuid.uuid4())
        key = key[0: floor(len(key)/6)]
        key = '{0}/{1}-{2}'.format("zubhub",
                                   slugify(submitted_footer_logo.name), key)

        res = upload_file_to_media_server(
            file=submitted_footer_logo, key=key
        )
        res = res.json()
        footer_logo_url = res["url"]

        if isinstance(header_logo_url, str) and isinstance(footer_logo_url, str):

            form.cleaned_data["header_logo_url"] = header_logo_url
            form.cleaned_data["footer_logo_url"] = footer_logo_url
            if obj.id:
                StaticAssets.objects.filter(id=obj.id).update(header_logo_url=form.cleaned_data['header_logo_url'],
                                                              footer_logo_url=form.cleaned_data['footer_logo_url'])

            else:
                StaticAssets.objects.create(header_logo_url=form.cleaned_data['header_logo_url'],
                                            footer_logo_url=form.cleaned_data['footer_logo_url'])

        else:
            raise Exception("footer_logo_url or header_logo_url is not string")


class HeroAdmin(admin.ModelAdmin):
    list_display = ["title", "image_url", "activity_url", "explore_ideas_url"]
    search_fields = ["title", 'description']

    def get_readonly_fields(self, request, obj=None):
        return ["id", "image_url"]

    def save_model(self, request, obj, form, change):
        submitted_image = form.cleaned_data.pop("image")

        if obj.image_url:
            delete_file_task.delay(obj.image_url)

        key = str(uuid.uuid4())
        key = key[0: floor(len(key)/6)]
        key = '{0}/{1}-{2}'.format("hero_images",
                                   slugify(submitted_image.name), key)

        res = upload_file_to_media_server(
            file=submitted_image, key=key)

        res = res.json()
        image_url = res["url"]

        if isinstance(image_url, str):
            form.cleaned_data["image_url"] = image_url
            if obj.id:
                Hero.objects.filter(id=obj.id).update(title=form.cleaned_data['title'],
                                                      description=form.cleaned_data['description'],
                                                      image_url=form.cleaned_data['image_url'],
                                                      activity_url=form.cleaned_data['activity_url'],
                                                      explore_ideas_url=form.cleaned_data['explore_ideas_url'])

            else:
                Hero.objects.create(title=form.cleaned_data['title'],
                                    description=form.cleaned_data['description'],
                                    image_url=form.cleaned_data['image_url'],
                                    activity_url=form.cleaned_data['activity_url'],
                                    explore_ideas_url=form.cleaned_data['explore_ideas_url'])
        else:
            raise Exception("image_url is not string")


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


admin.site.register(StaticAssets, StaticAssetsAdmin)
admin.site.register(Hero, HeroAdmin)
admin.site.register(Privacy, PrivacyAdmin)
admin.site.register(Help, HelpAdmin)
admin.site.register(FAQ, FAQAdmin)
