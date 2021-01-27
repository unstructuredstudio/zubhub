from django.contrib import admin
from .models import Project, Comment, Image

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
        "text", "created_on"]
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


admin.site.register(Project, ProjectAdmin)
admin.site.register(Image, ImageAdmin)
admin.site.register(Comment, CommentAdmin)
