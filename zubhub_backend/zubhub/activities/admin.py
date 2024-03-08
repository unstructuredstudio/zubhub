from django.conf import settings
from django.contrib import admin, messages

from .models import Activity, ActivityImage, ActivityMakingStep, Image
from .tasks import delete_file_task


class ActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "id", "created_on", "publish")
    list_filter = (
        "created_on",
        "publish",
    )
    search_fields = (
        "title",
        "id",
        "category",
    )
    ordering = ["-created_on"]
    actions = ["publish", "un_publish", "delete_selected"]

    def un_publish(self, request, queryset):
        """
        This function is used to unpublish selected activities
        """
        queryset.update(publish=False)
        messages.success(request, "Selected records were unpublished successfully.")

    def publish(self, request, queryset):
        """
        This function is used to publish selected activities
        """
        queryset = queryset.filter(publish=False)
        queryset.update(publish=True)
        messages.success(request, "Selected records were published successfully.")

    def delete_selected(self, request, queryset):
        """
        This function is used to delete selected activities
        """
        queryset.delete()
        messages.success(request, "Selected records were deleted successfully.")

    un_publish.short_description = "Unpublish selected activities"
    publish.short_description = "Publish selected activities"
    delete_selected.short_description = "Delete selected activities"

    def get_readonly_fields(self, request, obj=None):
        return ["id", "created_on", "views_count", "saved_by", "views"]

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        if change:
            old = Activity.objects.get(pk=obj.pk)
            new = Activity.objects.get(pk=obj.pk)

            if (
                old.video.find("cloudinary.com") > -1
                or old.video.startswith(
                    "{0}://{1}".format(
                        settings.DEFAULT_MEDIA_SERVER_PROTOCOL,
                        settings.DEFAULT_MEDIA_SERVER_DOMAIN,
                    )
                )
            ) and old.video != new.video:
                delete_file_task.delay(old.video)


class ActivityImageAdmin(admin.ModelAdmin):
    search_fields = ["activity__title", "activity__id", "image__public_id"]
    list_display = ["activity", "image"]

    def delete_model(self, request, obj):
        """
        This function is used to delete the activity image
        """
        delete_file_task.delay(obj.image.file_url)
        obj.delete()

    def delete_queryset(self, request, queryset):
        """
        This function is used to delete the activity image
        """
        for obj in queryset:
            delete_file_task.delay(obj.image.file_url)
        queryset.delete()


class ImageAdmin(admin.ModelAdmin):
    search_fields = ["public_id"]
    list_display = ["public_id", "file_url"]

    def delete_model(self, request, obj):
        """
        This function is used to delete the image
        """
        delete_file_task.delay(obj.file_url)
        obj.delete()


class ActivityMakingStepAdmin(admin.ModelAdmin):
    search_fields = ["activity__title", "title"]
    list_display = ["activity", "title"]
    list_filter = ["activity", "title"]

    def delete_model(self, request, obj):
        """
        This function is used to delete the activity making step
        """
        for img in obj.image.all():
            delete_file_task.delay(img.file_url)
            img.delete()
        obj.delete()


admin.site.register(Activity, ActivityAdmin)
admin.site.register(ActivityImage, ActivityImageAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(ActivityMakingStep, ActivityMakingStepAdmin)
