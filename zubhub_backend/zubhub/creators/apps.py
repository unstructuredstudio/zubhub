from django.apps import AppConfig


class CreatorsConfig(AppConfig):
    name = 'creators'

    def ready(self):
        import creators.signals
