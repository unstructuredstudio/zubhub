from creators.models import Setting
from creators.tasks import send_mass_email, send_mass_text


def send_staff_pick_notification(staff_pick):
    subscribed = Setting.objects.filter(subscribe=True)
    email_contexts = []
    phone_contexts = []
    template_name = "new_staff_pick_notification"
    for each in subscribed:
        if each.creator.email:
            email_contexts.append(
                {"title": staff_pick.title,
                 "user": each.creator.username,
                 "email": each.creator.email,
                 "staff_pick_id": staff_pick.id
                 }
            )

        if each.creator.phone:
            phone_contexts.append(
                {
                    "phone": each.creator.phone,
                    "staff_pick_id": staff_pick.id
                }
            )

    if len(email_contexts) > 0:
        send_mass_email.delay(
            template_name=template_name,
            ctxs=email_contexts
        )

    if len(phone_contexts) > 0:
        send_mass_text.delay(
            template_name=template_name,
            ctxs=phone_contexts
        )
