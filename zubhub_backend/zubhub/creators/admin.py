from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from django.db import transaction
from .models import PhoneNumber, Setting, CreatorGroup, CreatorTag, Badge

from .utils import (send_group_invite_notification, 
                    custom_set_creatortags_queryset,
                    enforce_creator__creator_tags_constraints)

Creator = get_user_model()

def active(obj):
    return obj.is_active

def tags(obj):
    if obj:
        tags = []
        for tag in obj.tags.all():
            tags.append(tag.name)
        return ", ".join(tags)
    return None

def badges(obj):
    if obj:
        badges = []
        for badge in obj.badges.all():
            badges.append(badge.badge_title)
        return ", ". join(badges)
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


class PhoneNumberAdmin(admin.ModelAdmin):
    list_display = ["creator", "phone", "verified", "primary"]
    search_fields = ["phone", "user__username"]
    list_filter = ['verified', "primary"]
    list_per_page = 50 ## paginate when more than 50 items
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
    list_per_page = 50 ## paginate when more than 50 items


def used_by(obj):
    if obj:
        return obj.creators.all().count()
    else:
        return 0

class CreatorTagAdmin(admin.ModelAdmin):
    list_display = ["name", used_by]
    search_fields = ["name"]
    exclude = ["id", "search_vector"]
    list_per_page = 50 ## paginate when more than 50 items


class CreatorGroupAdmin(admin.ModelAdmin):
    list_display = ["creator", group_projects, group_members, 'created_on']
    search_fields = ['creator']
    list_filter = ["created_on"]

    def get_readonly_fields(self, request, obj=None):
        return ["created_on", "projects_count"]

    def save_model(self, request, obj, form, change):
        submitted_members = form.cleaned_data.get("members")
        creator = form.cleaned_data.get("creator")

        """ Ensure that creator tag is 'group' """
        tag = CreatorTag.objects.filter(name="group").first()
        if not creator.tags.filter(name=tag.name).exists():
            creator.tags.add(tag)
            creator.tags.set(enforce_creator__creator_tags_constraints(creator, tag))

        """
        Send group invite to new members alone.

        Members who are already on the group shouldn't receive group invites 
        when new members are added to the group.
        """
        new_members = submitted_members.difference(obj.members.all())
        if new_members.count() > 0:
            form.cleaned_data.pop("members")
            send_group_invite_notification(obj, new_members)

        super(CreatorGroupAdmin, self).save_model(
            request, obj, form, change)


class CreatorAdmin(UserAdmin):

    fieldsets = (
        ('Personal Info', {
            'fields': (
                ('username',),
                ('first_name',),
                ('last_name',),
                ('password',),
            )
        }),
        ('Personal Detail', {
            'fields': (
                ('avatar',),
                ('phone',),
                ('email',),
                ('dateOfBirth',),
                ('location',),
                ('bio',),
                ('tags',),
                ('followers',),
                ('followers_count',),
                ('following_count',),
                ('projects_count',),
                ('badges')
            )
        }),
        ('Important Dates', {
            'fields': (
                ('date_joined',)
            )
        }),
        ('Permission', {
            'fields': (
                ('is_active',),
                ('is_staff',),
                ('is_superuser',),
            )
        })
    )


    list_display = UserAdmin.list_display + (tags, active, badges)
    list_per_page = 50 ## paginate when more than 50 items
    readonly_fields = UserAdmin.readonly_fields + ('avatar',) + ('followers_count',) + ('following_count',) + ('projects_count',)
    actions = ["activate_creators", "deactivate_creators"]

    ## disable the ability to add a new creator from the admin for now.
    def has_add_permission(self, request, obj=None):
        return False

    def activate_creators(self, request, queryset):
        for creator in queryset.all():
            creator.is_active = True
            creator.save()
    
    def deactivate_creators(self, request, queryset):
        for creator in queryset.all():
            creator.is_active = False
            creator.save()

    def save_model(self, request, obj, form, change):

        if change:

            """ Handle setting creatortags manually so we can enforce some constraints"""
            tags = form.cleaned_data.get("tags")
            custom_set_creatortags_queryset(obj, tags)
            form.cleaned_data.pop("tags")



            tag = CreatorTag.objects.filter(name="staff").first()

            if ((form.cleaned_data.get("is_staff") == True) and 
            (not obj.tags.filter(name=tag.name).exists())):
                """
                Add 'staff' creatortag  to creator.tags if creator is staff 
                
                And remove any conflicting tag like 'creator' or 'group'
                """
                obj.tags.add(tag)
                obj.tags.set(enforce_creator__creator_tags_constraints(obj, tag))

            elif ((form.cleaned_data.get("is_staff") == False) and 
            (obj.tags.filter(name=tag.name).exists())):
                """ Remove 'staff' creatortag from creator.tags if creator is not staff """
                obj.tags.remove(tag)


        super(CreatorAdmin, self).save_model(
            request, obj, form, change)

class BadgeAdmin(admin.ModelAdmin):
    list_display = ["badge_title", "created_on", used_by]
    search_fields = ["badge_title", "created_on"]
    list_filter = ["created_on"]
    list_per_page = 50

    def get_readonly_fields(self, request, obj=None):
        return ["created_on"]

admin.site.register(Creator, CreatorAdmin)
admin.site.register(PhoneNumber, PhoneNumberAdmin)
admin.site.register(Setting, SettingAdmin)
admin.site.register(CreatorGroup, CreatorGroupAdmin)
admin.site.register(CreatorTag, CreatorTagAdmin)
admin.site.register(Badge, BadgeAdmin)

