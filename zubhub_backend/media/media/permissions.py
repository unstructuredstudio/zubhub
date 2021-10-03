
from rest_framework.throttling import UserRateThrottle
from django.conf import settings


class PostUserRateThrottle(UserRateThrottle):
    scope = 'post_user'

    def allow_request(self, request, view):
        if request.method != "POST" or settings.DEBUG:
            return True
        return super().allow_request(request, view)


class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'

    def allow_request(self, request, view):
        if settings.DEBUG:
            return True
        return super().allow_request(request, view)
