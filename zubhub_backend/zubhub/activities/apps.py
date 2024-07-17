from django.apps import AppConfig


class ActivitiesConfig(AppConfig):
    name = "activities"

    def ready(self):
        import activities.signals  # noqa: F401
