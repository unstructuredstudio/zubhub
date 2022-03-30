from rest_framework.permissions import BasePermission
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.conf import settings


class IsOwner(BasePermission):
    message = "You must be the owner of this object to perform this function"

    def has_object_permission(self, request, view, object):
        return object.creator.pk == request.user.pk


class IsStaffOrModerator(BasePermission):
    message = "You must be a staff or a moderator to perform this function"

    def has_object_permission(self, request, view, object):
        return request.user.is_staff == True or request.user.tags.filter(name="Moderator").exists()


class PostAnonRateThrottle(AnonRateThrottle):
    scope = 'post_anon'

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


class CustomAnonRateThrottle(AnonRateThrottle):
    scope = 'post_anon'


class CustomUserRateThrottle(UserRateThrottle):
    scope = 'post_user'


class GetAnonRateThrottle(AnonRateThrottle):
    scope = 'get_anon'

    def allow_request(self, request, view):
        if request.method == "POST":
            return True
        return super().allow_request(request, view)


class PostUserRateThrottle(UserRateThrottle):
    scope = 'post_user'

    def allow_request(self, request, view):
        if request.method != "POST" or settings.DEBUG:
            return True
        return super().allow_request(request, view)


class GetUserRateThrottle(UserRateThrottle):
    scope = 'get_user'

    def allow_request(self, request, view):
        if request.method != "GET" or settings.DEBUG:
            return True
        return super().allow_request(request, view)


class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'

    def allow_request(self, request, view):
        if settings.DEBUG:
            return True
        return super().allow_request(request, view)
