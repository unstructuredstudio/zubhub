from django.contrib import admin
from .models import Project, Comment, Image
from .utils import project_changed
from creators.utils import activity_notification

# Register your models here.

admin.site.site_header = "ZubHub Administration"
admin.site.site_title = "ZubHub admin portal"
admin.site.index_title = "ZubHub Administration"


class ImageAdmin(admin.ModelAdmin):
    # model = Image
    search_fields = ["project__title", "image_url"]
    list_display = ["image_url"]


class CommentAdmin(admin.ModelAdmin):
    # model = Comment
    list_display = [
        "text", "created_on", "published"]
    search_fields = ["project__tite", "creator__username",
                     "text", "created_on"]
    list_filter = ["created_on"]


class ProjectImages(admin.StackedInline):
    model = Image


class ProjectComments(admin.StackedInline):
    model = Comment


class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "creator", "views_count", "likes_count",
                    "comments_count", "created_on", "published"]
    search_fields = ["title", 'creator__username', 'creator__email',
                     "created_on"]
    list_filter = ['created_on', "published"]
    inlines = [ProjectImages, ProjectComments]

    def get_readonly_fields(self, request, obj=None):
        return ["id", "slug", "views_count", "likes_count", "comments_count", "created_on"]

    def save_model(self, request, obj, form, change):
        if change:
            old = Project.objects.get(pk=obj.pk)

        super().save_model(request, obj, form, change)

        if change:
            new = Project.objects.get(pk=obj.pk)
            if project_changed(old, new):
                info = {
                    "project_id": str(new.pk),
                    "editor": request.user.username
                }
                activity_notification(["edited_project"], **info)


admin.site.register(Project, ProjectAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Comment, CommentAdmin)
