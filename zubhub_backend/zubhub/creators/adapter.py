from django.conf import settings
from django.core.mail import get_connection
from django.template.loader import render_to_string
from allauth.account.adapter import DefaultAccountAdapter
from django.template import TemplateDoesNotExist
from twilio.rest import Client
import json

from .models import Location, Setting

from creators.tasks import send_text, send_mass_email

from allauth.account import app_settings as allauth_settings


class CustomAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=False):
        creator = super().save_user(request, user, form, commit)
        data = form.cleaned_data
        location = Location.objects.get(name=data.get('location'))

        creator.phone = data.get("phone")
        creator.dateOfBirth = data.get('dateOfBirth')
        creator.bio = data.get('bio')
        creator.location = location
        creator.save()

        Setting(creator=creator, subscribe=data.get("subscribe")).save()

        return creator

    def confirm_phone(self, request, phone_number):
        """
        Marks the phone number as confirmed on the db
        """
        phone_number.verified = True
        phone_number.set_as_primary(conditional=True)
        phone_number.save()

    def confirm_group_invite(self, request, creator, creatorgroup):
        """
        confirm group invite for a particular creator
        """
        creatorgroup.members.add(creator)
        creatorgroup.save()

    def get_whatsapp_from_phone(self):
        return settings.DEFAUL_WHATSAPP_FROM_PHONE

    def get_from_phone(self):
        """
        This is a hook that can be overridden to programatically
        set the 'from' phone number for sending phone texts messages
        """
        return settings.DEFAULT_FROM_PHONE

    def render_text(self, template_name, phone, context, from_phone=None):
        """
        Renders a text to `text`.  `template_prefix` identifies the
        text that is to be sent, e.g. "account/phone/phone_confirmation"
        """
        if from_phone is None:
            from_phone = self.get_from_phone()

        try:
            body = render_to_string(
                template_name,
                context,
                self.request,
            ).strip()
        except TemplateDoesNotExist:
            raise

        return {"to": phone, "from_": from_phone, "body": body}

    def send_text(self, template_name, phone, context):
        if settings.ENVIRONMENT == "production" and not settings.DEBUG:

            client = Client(settings.TWILIO_ACCOUNT_SID,
                            settings.TWILIO_AUTH_TOKEN)
            text = self.render_text(template_name, phone, context)
            client.messages.create(**text)

    def send_whatsapp(self, template_name, phone, context):
        if settings.ENVIRONMENT == "production" and not settings.DEBUG:
            whatsapp_phone = "whatsapp:" + phone
            client = Client(settings.TWILIO_ACCOUNT_SID,
                            settings.TWILIO_AUTH_TOKEN)
            text = self.render_text(template_name, whatsapp_phone, context,
                                    from_phone=self.get_whatsapp_from_phone())
            client.messages.create(**text)

    def send_confirmation_text(self, request, phoneconfirmation, signup):

        ctx = {
            "user": phoneconfirmation.phone_number.user.username,
            "key": phoneconfirmation.key,
        }

        template_name = "account/phone/phone_confirmation.txt"

        send_text.delay(
            phone=phoneconfirmation.phone_number.phone,
            template_name=template_name,
            ctx=ctx,
        )

    def send_group_invite_text(self, group_invite_confirmation):

        ctx = {
            "creator_username": group_invite_confirmation.creator.username,
            "group_creator_username": group_invite_confirmation.group_creator.username,
            "key": group_invite_confirmation.key,
        }

        template_name = "account/phone/group_invite_confirmation_message.txt"

        send_text.delay(
            phone=group_invite_confirmation.creator.phone,
            template_name=template_name,
            ctx=ctx,
        )

    def send_group_invite_mail(self, group_invite_confirmation):
        if settings.ENVIRONMENT == "production" and not settings.DEBUG:

            ctx = {
                "creator_username": group_invite_confirmation.creator.username,
                "group_creator_username": group_invite_confirmation.group_creator.username,
                "key": group_invite_confirmation.key,
            }
            email_template = "account/email/group_invite_confirmation"
            self.send_mail(
                email_template, group_invite_confirmation.creator.email, ctx)

    def send_mass_email(self, template_prefix, contexts):
        if settings.ENVIRONMENT == "production" and not settings.DEBUG:
            template_prefix = "projects/email/" + template_prefix
            connection = get_connection(
                username=None, password=None, fail_silently=False)
            messages = []
            for ctx in contexts:
                msg = self.render_mail(template_prefix, ctx["email"], ctx)
                messages.append(msg)

            return connection.send_messages(messages)

    def send_mass_text(self, template_prefix, contexts):
        if settings.ENVIRONMENT == "production" and not settings.DEBUG:
            template_name = "projects/phone/" + template_prefix + "_message.txt"
            client = Client(settings.TWILIO_ACCOUNT_SID,
                            settings.TWILIO_AUTH_TOKEN)

            rendered_text = self.render_text(
                template_name, contexts[0]["phone"], contexts[0])

            bindings = list(map(lambda context: json.dumps(
                {'binding_type': 'sms', 'address': context["phone"]}), contexts))

            client.notify.services(settings.TWILIO_NOTIFY_SERVICE_SID).notifications.create(
                to_binding=bindings,
                body=rendered_text["body"]
            )
