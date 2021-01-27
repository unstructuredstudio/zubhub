from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    message = "You must be the owner of this object to perform this function"

    def has_object_permission(self, request, view, object):
        return object.creator.pk == request.user.pk
