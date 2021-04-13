from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    message = "You must be the owner of this object to perform this function"

    def has_object_permission(self, request, view, object):
        return object.creator.pk == request.user.pk


class IsStaffOrModerator(BasePermission):
    message = "You must be a staff or a moderator to perform this function"

    def has_object_permission(self, request, view, object):
        return request.user.is_staff == True or request.user.role == 2
