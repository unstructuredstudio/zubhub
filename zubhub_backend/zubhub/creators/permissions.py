from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    message = "You must be the owner of this object to perform this function"

    def has_object_permission(self, request, view, objects):
        return objects.pk == request.user.pk

class IsGroupAdmin(BasePermission):
    message = 'You must be an admin of this group to perform this action.'

    def has_object_permission(self, request, view, obj):
        # Check if the authenticated user is an admin in the group
        return obj.memberships.filter(member=request.user, role='admin').exists()