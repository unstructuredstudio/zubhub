from django.conf import settings
from twilio.rest import Client
from django.template.loader import render_to_string


def render_message(template_name):
    return render_to_string(template_name)



def send_whatsapp(template_name, phone, context):
    if settings.ENVIRONMENT == "production" and not settings.DEBUG:
        client = Client(settings.TWILIO_ACCOUNT_SID,
                        settings.TWILIO_AUTH_TOKEN)
        text = render_message(template_name, phone, context)
        client.messages.create(**text)

