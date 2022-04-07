from projects.models import Category
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Populate Category table with categories'

    def handle(self, *args, **kwargs):
        if Category.objects.all().count() < 1:
            with open("./zubhub/projects/management/commands/categories.txt", "r") as categories:
                categories = categories.readlines()
                for category in categories:
                    self.stdout.write(category)
                    Category.add_root(name=category.split("\n")[0])
            self.stdout.write(self.style.SUCCESS(
                'The Category table has been successfully populated!'))
        else:
            self.stdout.write(self.style.NOTICE(
                'The Category table is already populated'))
