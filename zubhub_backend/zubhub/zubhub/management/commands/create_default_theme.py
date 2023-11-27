from zubhub.models import Theme
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create default theme'

    def handle(self, *args, **kwargs):
        if not Theme.objects.filter(Theme_Name="Default").exists():
            Theme.objects.create(Theme_Name="Default", status="1")
            self.stdout.write(self.style.SUCCESS('default theme created successfully'))
        else:
            self.stdout.write(self.style.NOTICE('default theme already exists'))
