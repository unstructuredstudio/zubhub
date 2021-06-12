from .utils import delete_file, upload_local_file
from django.contrib import admin
from .models import Hero, Privacy, FAQ, Help
from django_summernote.admin import SummernoteModelAdmin
from projects.tasks import delete_image_from_DO_space

# Register your models here.


class HeroAdmin(admin.ModelAdmin):
    list_display = ["title", "image_url", "image_project_id"]
    search_fields = ["title", 'description']

    def get_readonly_fields(self, request, obj=None):
        return ["id", "image_url"]

    def save_model(self, request, obj, form, change):
        submitted_image = form.cleaned_data.pop("image")

        if obj.image_url:
            delete_image_from_DO_space.delay(
                "zubhub", obj.image_url.split(".com/")[1])

        image_url = upload_local_file(
            file=submitted_image, folder='hero_images')

        form.cleaned_data["image_url"] = image_url
        if obj.id:
            Hero.objects.filter(id=obj.id).update(title=form.cleaned_data['title'],
                                                  description=form.cleaned_data['description'],
                                                  image_url=form.cleaned_data['image_url'],
                                                  image_project_id=form.cleaned_data['image_project_id'])

        else:
            Hero.objects.create(title=form.cleaned_data['title'],
                                description=form.cleaned_data['description'],
                                image_url=form.cleaned_data['image_url'],
                                image_project_id=form.cleaned_data['image_project_id'])


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


admin.site.register(Hero, HeroAdmin)
admin.site.register(Privacy, PrivacyAdmin)
admin.site.register(Help, HelpAdmin)
admin.site.register(FAQ, FAQAdmin)
