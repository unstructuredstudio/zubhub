import uuid
from math import floor
from django.utils import timezone
from django.core import signing
from django.utils.crypto import get_random_string
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser
from django.db import models, transaction
from django.dispatch import Signal
from .managers import PhoneNumberManager
from .utils import user_phone

try:
    from allauth.account import app_settings as allauth_settings
    from allauth.account.adapter import get_adapter
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")


class Location(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=106)

    def save(self, *args, **kwargs):
        if self.slug:
            pass
        else:
            uid = str(uuid.uuid4())
            uid = uid[0: floor(len(uid)/6)]
            self.slug = slugify(self.name) + "-" + uid
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Creator(AbstractUser):
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    avatar = models.URLField(max_length=1000, blank=True, null=True)
    phone = models.CharField(unique=True, max_length=17, blank=True, null=True)
    dateOfBirth = models.DateField(blank=True, null=True)
    location = models.ForeignKey(
        Location, null=True, on_delete=models.SET_NULL)
    bio = models.CharField(max_length=255, blank=True, null=True)
    followers = models.ManyToManyField(
        "self", symmetrical=False, related_name="following")
    followers_count = models.IntegerField(blank=True, default=0)
    following_count = models.IntegerField(blank=True, default=0)
    projects_count = models.IntegerField(blank=True, default=0)

    def save(self, *args, **kwargs):
        if not self.avatar:
            self.avatar = 'https://robohash.org/{0}'.format(self.username)
        self.followers_count = self.followers.count()
        self.following_count = self.following.count()
        self.projects_count = self.projects.count()
        super().save(*args, **kwargs)


class Setting(models.Model):
    creator = models.OneToOneField(
        Creator, on_delete=models.CASCADE, primary_key=True)
    subscribe = models.BooleanField(blank=True, default=False)

    def __str__(self):
        return self.creator.username


class PhoneNumber(models.Model):

    user = models.ForeignKey(
        Creator,
        verbose_name="creator",
        on_delete=models.CASCADE,
    )
    phone = models.CharField(
        unique=True,
        max_length=16,
        verbose_name="phone number",
    )
    verified = models.BooleanField(verbose_name="verified", default=False)
    primary = models.BooleanField(verbose_name="primary", default=False)

    objects = PhoneNumberManager()

    class Meta:
        verbose_name = "phone number"
        verbose_name_plural = "phone numbers"

    def __str__(self):
        return self.phone

    def set_as_primary(self, conditional=False):
        old_primary = PhoneNumber.objects.get_primary(self.user)
        if old_primary:
            if conditional:
                return False
            old_primary.primary = False
            old_primary.save()
        self.primary = True
        self.save()
        user_phone(self.user, self.phone)
        self.user.save()
        return True

    def send_confirmation(self, request=None, signup=False):
        confirmation = PhoneConfirmationHMAC(self)
        confirmation.send(request, signup=signup)
        return confirmation

    # def change(self, request, new_email, confirm=True):
    #     """
    #     Given a new email address, change self and re-confirm.
    #     """
    #     with transaction.atomic():
    #         user_email(self.user, new_email)
    #         self.user.save()
    #         self.email = new_email
    #         self.verified = False
    #         self.save()
    #         if confirm:
    #             self.send_confirmation(request)


class PhoneConfirmationHMAC:
    def __init__(self, phone_number):
        self.phone_number = phone_number

    @property
    def key(self):
        return signing.dumps(obj=self.phone_number.pk, salt=allauth_settings.SALT)

    @classmethod
    def from_key(cls, key):
        PHONE_CONFIRMATION_EXPIRE_DAYS = 3
        try:
            max_age = 60 * 60 * 24 * PHONE_CONFIRMATION_EXPIRE_DAYS
            pk = signing.loads(key, max_age=max_age,
                               salt=allauth_settings.SALT)
            ret = PhoneConfirmationHMAC(PhoneNumber.objects.get(pk=pk))
        except (
            signing.SignatureExpired,
            signing.BadSignature,
            PhoneNumber.DoesNotExist,
        ):
            ret = None
        return ret

    def confirm(self, request):

        if not self.phone_number.verified:
            phone_number = self.phone_number
            get_adapter(request).confirm_phone(request, phone_number)
            Signal().send(
                sender=self.__class__,
                request=request,
                phone_number=phone_number,
            )
            return phone_number

    def send(self, request=None, signup=False):
        get_adapter(request).send_confirmation_text(request, self, signup)
        Signal().send(
            sender=self.__class__,
            request=request,
            confirmation=self,
            signup=signup,
        )
