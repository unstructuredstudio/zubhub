from django.contrib import admin
from .utils import send_staff_pick_notification
from .models import *
# Register your models here.

admin.site.site_header = "ZubHub Administration"
admin.site.site_title = "ZubHub admin portal"
admin.site.index_title = "ZubHub Administration"


class InlineProjectImages(admin.StackedInline):
    model = Image


class InlineProjectComments(admin.StackedInline):
    model = Comment


class InlineProject(admin.StackedInline):
    model = Project.staff_picks.through


class ImageAdmin(admin.ModelAdmin):
    search_fields = ["project__title", "image_url"]
    list_display = ["image_url"]


class CommentAdmin(admin.ModelAdmin):
    list_display = [
        "text", "created_on"]
    search_fields = ["project__tite", "creator__username",
                     "text", "created_on"]
    list_filter = ["created_on"]


class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "creator", "views_count", "likes_count",
                    "comments_count", "created_on", "published"]
    search_fields = ["title", 'creator__username', 'creator__email',
                     "created_on"]
    list_filter = ['created_on', "published"]
    inlines = [InlineProjectImages, InlineProjectComments]

    def get_readonly_fields(self, request, obj=None):
        return ["id", "slug", "views_count", "likes_count", "comments_count", "created_on"]


def projects_count(obj):
    if obj:
        return obj.projects.count()
    return 0


def staff_pick_created_on(obj):
    if obj:
        return obj.created_on
    return None


class StaffPickAdmin(admin.ModelAdmin):
    list_display = ["title", staff_pick_created_on, projects_count]
    search_fields = ["title", "description", "is_active"]
    list_filter = ['created_on', 'is_active']
    raw_id_fields = ["projects"]

    def get_readonly_fields(self, request, obj=None):
        return ["id", 'slug', 'created_on']

    def save_model(self, request, obj, form, change):
        super(StaffPickAdmin, self).save_model(request, obj, form, change)
        if obj.is_active:
            send_staff_pick_notification(obj)


admin.site.register(Project, ProjectAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(StaffPick, StaffPickAdmin)
