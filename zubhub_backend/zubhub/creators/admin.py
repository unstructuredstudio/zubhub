from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import PhoneNumber, Setting, CreatorGroup

from .utils import send_group_invite_notification

Creator = get_user_model()


class PhoneNumberAdmin(admin.ModelAdmin):
    list_display = ["creator", "phone", "verified", "primary"]
    search_fields = ["phone", "user__username"]
    list_filter = ['verified', "primary"]
    actions = ["download_csv"]

    def creator(self, obj):
        if obj:
            return obj.user.username
        return None

    def download_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        from io import StringIO

        f = StringIO()
        writer = csv.writer(f)

        writer.writerow(["creator", "phone number", "verified", "primary"])
        for creator in queryset:
            writer.writerow([creator.user.username, creator.phone,
                             creator.verified, creator.primary])

        f.seek(0)
        response = HttpResponse(f, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename=phone_numbers.csv'
        return response


class SettingAdmin(admin.ModelAdmin):
    list_filter = ["subscribe"]


def role(obj):
    if obj:
        if obj.role == Creator.CREATOR:
            return "creator"
        if obj.role == Creator.MODERATOR:
            return "moderator"
        if obj.role == Creator.STAFF:
            return "staff"
        if obj.role == Creator.GROUP:
            return "group"
    return None


def group_projects(obj):
    if obj:
        count = obj.creator.projects.count()
        for creator in obj.members.all():
            count += creator.projects.count()
        return count
    return None


def group_members(obj):
    if obj:
        return obj.members.count()
    return None


class CreatorGroupAdmin(admin.ModelAdmin):
    list_display = ["creator", group_projects, group_members, 'created_on']
    search_fields = ['creator']
    list_filter = ["created_on"]

    def get_readonly_fields(self, request, obj=None):
        return ["created_on", "projects_count"]

    def save_model(self, request, obj, form, change):
        submitted_members = form.cleaned_data.get("members")
        creator = form.cleaned_data.get("creator")

        creator.role = Creator.GROUP
        creator.save()

        new_members = submitted_members.difference(obj.members.all())

        if new_members.count() > 0:
            form.cleaned_data.pop("members")
            send_group_invite_notification(obj, new_members)

        super(CreatorGroupAdmin, self).save_model(
            request, obj, form, change)


UserAdmin.fieldsets += ('Personal Info',
                        {'fields': ('avatar', 'phone', 'dateOfBirth', 'location', 'bio', 'role')}),
UserAdmin.list_display += (role),
UserAdmin.readonly_fields += ("avatar"),

admin.site.register(Creator, UserAdmin)
admin.site.register(PhoneNumber, PhoneNumberAdmin)
admin.site.register(Setting, SettingAdmin)
admin.site.register(CreatorGroup, CreatorGroupAdmin)
