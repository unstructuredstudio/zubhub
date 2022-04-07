from creators.models import Location
from django.core.management.base import BaseCommand




class Command(BaseCommand):
    help = 'Populate Location table with countries'

    def handle(self, *args, **kwargs):
        if Location.objects.all().count() < 1:
            with open("./zubhub/creators/management/commands/countries.txt", "r") as countries:
                countries = countries.readlines()
                for country in countries:
                    self.stdout.write(country)
                    Location.objects.create(name = country.split("\n")[0])
            self.stdout.write(self.style.SUCCESS('The Location table has been successfully populated!'))
        else:
            self.stdout.write(self.style.NOTICE('The Location table is already populated'))
