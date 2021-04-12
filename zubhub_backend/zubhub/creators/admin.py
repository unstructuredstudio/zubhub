from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import PhoneNumber, Setting

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
    return None


UserAdmin.fieldsets += ('Personal Info',
                        {'fields': ('avatar', 'phone', 'dateOfBirth', 'location', 'bio', 'role')}),
UserAdmin.list_display += (role),
UserAdmin.readonly_fields += ("avatar"),

admin.site.register(Creator, UserAdmin)
admin.site.register(PhoneNumber, PhoneNumberAdmin)
admin.site.register(Setting, SettingAdmin)
