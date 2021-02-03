import unicodedata
from django.conf import settings
from django.contrib.auth import update_session_auth_hash
from django.core.exceptions import FieldDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q
from django.utils.encoding import force_str
from django.utils.http import base36_to_int, int_to_base36, urlencode
from django.contrib.auth import get_user_model


try:
    from allauth.account.adapter import get_adapter
    from allauth.account.utils import send_email_confirmation
    from allauth.account.models import EmailAddress
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")


def user_field(user, field, *args):
    """
    Gets or sets (optional) user model fields. No-op if fields do not exist.
    """
    if not field:
        return
    User = get_user_model()
    try:
        field_meta = User._meta.get_field(field)
        max_length = field_meta.max_length
    except FieldDoesNotExist:
        if not hasattr(user, field):
            return
        max_length = None
    if args:
        # Setter
        v = args[0]
        if v:
            v = v[0:max_length]
        setattr(user, field, v)
    else:
        # Getter
        return getattr(user, field)


def user_phone(user, *args):
    return user_field(user, "phone", *args)


def _has_verified_phone_for_login(user, phone):
    from .models import PhoneNumber

    phonenumber = None
    if phone:
        ret = False
        try:
            phonenumber = PhoneNumber.objects.get_for_user(user, phone)
            ret = phonenumber.verified
        except PhoneNumber.DoesNotExist:
            pass
    else:
        ret = PhoneNumber.objects.filter(user=user, verified=True).exists()
    return ret


def _has_verified_email_for_login(user, email):
    emailaddress = None
    if email:
        ret = False
        try:
            emailaddress = EmailAddress.objects.get_for_user(user, email)
            ret = emailaddress.verified
        except EmailAddress.DoesNotExist:
            pass
    else:
        ret = EmailAddress.objects.filter(user=user, verified=True).exists()
    return ret


def perform_send_phone_confirmation(
    request,
    user,
    signup=False,
    phone=None,
):
    adapter = get_adapter(request)
    if not user.is_active:
        return adapter.respond_user_inactive(request, user)

    if not _has_verified_phone_for_login(user, phone):
        send_phone_confirmation(request, user, signup=signup, phone=phone)


def perform_send_email_confirmation(request, user, signup=False, email=None):
    adapter = get_adapter(request)
    if not user.is_active:
        return adapter.respond_user_inactive(request, user)

    if not _has_verified_email_for_login(user, email):
        send_email_confirmation(
            request, user, signup=signup)


def setup_user_phone(user):
    """
    Creates proper PhoneNumber for the user that was just signed
    up. Only sets up, doesn't do any other handling such as sending
    out phone number confirmation texts etc.
    """
    from .models import PhoneNumber

    assert not PhoneNumber.objects.filter(user=user).exists()

    phone = user_phone(user)
    phone_number = None
    if phone:
        phone_number = PhoneNumber(
            user=user, phone=phone, primary=True, verified=False)
        phone_number.save()

    if phone_number:
        PhoneNumber.objects.fill_cache_for_user(user, [phone_number])
    return phone_number


def send_phone_confirmation(request, user, signup=False, phone=None):
    """
    Phone Number verification texts are sent:
    a) Explicitly: when a user signs up

    """
    from .models import PhoneNumber

    if not phone:
        phone = user_phone(user)
    if phone:
        try:
            phone_number = PhoneNumber.objects.get_for_user(user, phone)
            if not phone_number.verified:
                phone_number.send_confirmation(request, signup=signup)
        except PhoneNumber.DoesNotExist:
            phone_number = PhoneNumber.objects.add_phone(
                request, user, phone, signup=signup, confirm=True
            )
            assert phone_number


# def sync_user_email_addresses(user):
#     """
#     Keep user.email in sync with user.emailaddress_set.

#     Under some circumstances the user.email may not have ended up as
#     an EmailAddress record, e.g. in the case of manually created admin
#     users.
#     """
#     from .models import EmailAddress

#     email=user_email(user)
#     if (
#         email
#         and not EmailAddress.objects.filter(user=user, email__iexact=email).exists()
#     ):
#         if (
#             app_settings.UNIQUE_EMAIL
#             and EmailAddress.objects.filter(email__iexact=email).exists()
#         ):
#             # Bail out
#             return
#         EmailAddress.objects.create(
#             user=user, email=email, primary=False, verified=False
#         )
