from celery import shared_task
from random import uniform

try:
    from allauth.account.adapter import get_adapter
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")


@shared_task(name="creators.tasks.send_text", bind=True, acks_late=True, max_retries=10)
def send_text(self, phone, template_name, ctx):
    try:
        get_adapter().send_text(template_name, phone, ctx)
    except Exception as e:
        raise self.retry(exc=e, countdown=int(
            uniform(2, 4) ** self.request.retries))
