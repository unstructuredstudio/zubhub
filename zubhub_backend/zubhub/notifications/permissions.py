from rest_framework.throttling import UserRateThrottle
from django.conf import settings


class SustainedRateThrottle(UserRateThrottle):
    scope = 'sustained'

    def allow_request(self, request, view):
        if settings.DEBUG:
            return True
        return super().allow_request(request, view)