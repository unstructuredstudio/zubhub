from creators.models import CreatorTag
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Populate CreatorTag table with initial creator tags'

    def handle(self, *args, **kwargs):
        if CreatorTag.objects.all().count() < 1:
            with open("./zubhub/creators/management/commands/initial_creator_tags.txt", "r") as tags:
                tags = tags.readlines()
                for tag in tags:
                    self.stdout.write(tag)
                    CreatorTag.objects.create(name = tag.split("\n")[0])
            self.stdout.write(self.style.SUCCESS('The CreatorTag table has been successfully populated!'))
        else:
            self.stdout.write(self.style.NOTICE('The CreatorTag table is already populated'))
