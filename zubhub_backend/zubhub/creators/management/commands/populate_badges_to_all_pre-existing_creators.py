from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'run badge script manually for all existing users'

    def handle(self, *args, **kwargs):
        from creators.utils import (set_badge_project_category, set_badge_comment_category,
                                     set_badge_like_category, set_badge_view_category)
        from creators.models import Creator
        users=Creator.objects.all()
        for user in users:
            set_badge_project_category(user, user.projects_count)
            set_badge_view_category(user)
            set_badge_like_category(user)
            set_badge_comment_category(user)
        self.stdout.write(self.style.SUCCESS('The Badge script has executed successfully.'))
 