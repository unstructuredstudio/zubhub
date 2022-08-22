from creators.models import Badge
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Populate Badge table with initial badges'

    def handle(self, *args, **kwargs):
        if Badge.objects.all().count() == 0:
            with open("./zubhub/creators/management/commands/initial_badges.txt", "r") as badges:
                badges = badges.readlines()
                for badge in badges:
                    remove_col=badge.split(':')
                    remove_col[2]=remove_col[2].split('\n')[0]
                    title=remove_col[0]
                    value=int(remove_col[1])
                    category_type=int(remove_col[2])
                    Badge.objects.create(badge_title = title, threshold_value=value,
                                                 type= category_type )
            self.stdout.write(self.style.SUCCESS('The Badge table has been successfully populated!'))
        else:
            self.stdout.write(self.style.NOTICE('The Badge table is already populated'))
