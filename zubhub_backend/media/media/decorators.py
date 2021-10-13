from django.conf import settings
from django.core.exceptions import PermissionDenied
from .utils import get_hash


def authentication_required(function):
    def wrap(request, *args, **kwargs):
        if get_hash(settings.MEDIA_SECRET) == request.data.get("secret_hash"):
            return function(request, *args, **kwargs)
        else:
            raise PermissionDenied
    wrap.__doc__ = function.__doc__
    wrap.__name__ = function.__name__
    return wrap
