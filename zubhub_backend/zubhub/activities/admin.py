from django.contrib import admin, messages

from .models import (
    Activity,
    ActivityImage,
    ActivityMakingStep,
    Image,
    InspiringArtist,
    InspiringExample,
)


class InlineActivityImages(admin.StackedInline):
    model = ActivityImage


class InlineActivityMakingSteps(admin.StackedInline):
    model = ActivityMakingStep


class InlineInspiringExamples(admin.StackedInline):
    model = InspiringExample


class InspiringArtistAdmin(admin.ModelAdmin):
    search_fields = ("name",)
    list_display = (
        "name",
        "image",
    )
    list_filter = ("name",)


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
    inlines = [InlineActivityImages, InlineActivityMakingSteps, InlineInspiringExamples]
    list_per_page = 50  # paginate when more than 50 items

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

    def get_readonly_fields(self, request, obj=None):
        return [
            "id",
            "created_on",
            "views_count",
            "saved_by",
            "views",
            "saved_count",
            "slug",
        ]

    un_publish.short_description = "Unpublish selected activities"
    publish.short_description = "Publish selected activities"
    delete_selected.short_description = "Delete selected activities"


class ActivityImageAdmin(admin.ModelAdmin):
    search_fields = ["activity__title", "activity__id", "image__public_id"]
    list_display = ["activity", "image"]


class ImageAdmin(admin.ModelAdmin):
    search_fields = ["public_id"]
    list_display = ["public_id", "file_url"]
    # should not be able to edit this from the admin panel ?


admin.site.register(InspiringArtist, InspiringArtistAdmin)
admin.site.register(Activity, ActivityAdmin)
admin.site.register(ActivityImage, ActivityImageAdmin)
admin.site.register(Image, ImageAdmin)
