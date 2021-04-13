from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin
from .models import Project, Comment, Image, StaffPick, Category, Tag
from .utils import project_changed, send_staff_pick_notification
from creators.utils import activity_notification
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
    # model = Comment
    list_display = ["creator",
                    "text", "created_on", "published"]

    search_fields = ["project__tite", "creator__username",
                     "text", "created_on", "published"]
    list_filter = ["created_on", "published"]

    def creator(self, obj):
        if obj:
            return obj.creator.username
        return None

    def get_readonly_fields(self, request, obj=None):
        return ["created_on"]


class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "creator", "views_count", "likes_count",
                    "comments_count", "created_on", "published"]
    search_fields = ["title", 'creator__username', 'creator__email',
                     "created_on"]
    list_filter = ['created_on', "published"]
    inlines = [InlineProjectImages, InlineProjectComments]
    exclude = ["search_vector"]

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


class categoryAdmin(admin.ModelAdmin):
    search_fields = ["name", "description"]
    readonly_fields = ["id", "slug"]


class tagAdmin(admin.ModelAdmin):
    search_fields = ["name"]
    readonly_fields = ["id", "slug"]


admin.site.register(Project, ProjectAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Category, categoryAdmin)
admin.site.register(Tag, tagAdmin)
admin.site.register(StaffPick, StaffPickAdmin)
