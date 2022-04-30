from projects.models import ViolationReason
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Populate ViolationReason table with violation reasons'

    def handle(self, *args, **kwargs):
        if ViolationReason.objects.all().count() < 1:
            with open(
                    "./zubhub/projects/management/commands/violation_reasons.txt",
                    "r") as violation_reasons:
                violation_reasons = violation_reasons.readlines()
                for violation_reason in violation_reasons:
                    self.stdout.write(violation_reason)
                    ViolationReason.objects.create(
                        description=violation_reason.split("\n")[0])
            self.stdout.write(
                self.style.SUCCESS(
                    'The ViolationReason table has been successfully populated!'
                ))
        else:
            self.stdout.write(
                self.style.NOTICE(
                    'The ViolationReason table is already populated'))
