from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create initial dummy admin user that can be used to login to the admin panel'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('============================================'))
        self.stdout.write(self.style.WARNING(
            '== DANGER: don\'t forget to delete this user after you have created a proper superuser!!! =='
        ))
        self.stdout.write(self.style.WARNING('============================================'))

        User = get_user_model()
        superusers = User.objects.filter(is_superuser=True)
        if superusers.count() == 0:
            user = User.objects.create_superuser("dummy", "dummy@mail.com", "dummy_password")
        else:
            user = superusers.none()
        if hasattr(user, "is_staff"):
            setattr(user, "is_staff", True)
            user.save()
        if hasattr(user, "is_staff"):
            self.stdout.write(self.style.SUCCESS('new super user created successfully'))
            self.stdout.write(self.style.WARNING(
                '== DANGER: don\'t forget to delete this user after you have created a proper superuser!!! =='
            ))
        else:
            self.stdout.write(self.style.NOTICE('superuser already exists'))
