from creators.models import Badge
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Populate Badge table with initial badges'

    def handle(self, *args, **kwargs):
        if Badge.objects.all().count() == 0:
            with open("./zubhub/creators/management/commands/initial_badges.txt", "r") as badges:
                badges = badges.readlines()
                for badge in badges:
                    self.stdout.write(badge)
                    Badge.objects.create(badge_title = badge.split("\n")[0])
            self.stdout.write(self.style.SUCCESS('The Badge table has been successfully populated!'))
        else:
            self.stdout.write(self.style.NOTICE('The Badge table is already populated'))
