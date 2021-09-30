from django.db import models


class PhoneNumberManager(models.Manager):
    # def can_add_phone(self, user):
    #     ret = True
    #     if app_settings.MAX_EMAIL_ADDRESSES:
    #         count = self.filter(user=user).count()
    #         ret = count < app_settings.MAX_EMAIL_ADDRESSES
    #     return ret

    def add_phone(self, request, user, phone, confirm=False, signup=False):
        phone_number, created = self.get_or_create(
            user=user, phone__iexact=phone, defaults={"phone": phone}
        )

        if created and confirm:
            phone_number.send_confirmation(request, signup=signup)

        return phone_number

    def get_primary(self, user):
        try:
            return self.get(user=user, primary=True)
        except self.model.DoesNotExist:
            return None

    def get_users_for(self, phone):
        # this is a list rather than a generator because we probably want to
        # do a len() on it right away
        return [
            phone_number.user for phone_number in self.filter(verified=True, phone__iexact=phone)
        ]

    def fill_cache_for_user(self, user, phone_numbers):
        """
        In a multi-db setup, inserting records and re-reading them later
        on may result in not being able to find newly inserted
        records. Therefore, we maintain a cache for the user so that
        we can avoid database access when we need to re-read..
        """
        user._phonenumber_cache = phone_numbers

    def get_for_user(self, user, phone):
        cache_key = "_phonenumber_cache"
        phone_numbers = getattr(user, cache_key, None)
        if phone_numbers is None or (type(phone_numbers) == list and phone_numbers[0] is None):
            ret = self.get(user=user, phone__iexact=phone)
            # To avoid additional lookups when e.g.
            # EmailAddress.set_as_primary() starts touching self.user
            ret.user = user
            return ret
        else:
            for phone_number in phone_numbers:
                if phone_number.phone == phone:
                    return phone_number
            raise self.model.DoesNotExist()
