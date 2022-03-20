from datetime import timedelta
from typing import List, Set, Dict, cast
from django.core.exceptions import FieldDoesNotExist
from django.utils import timezone
from django.contrib.auth import get_user_model
from projects.tasks import delete_file_task
from creators.tasks import upload_file_task, send_mass_email, send_mass_text, send_whatsapp
from creators.models import Setting
from notifications.models import Notification
from notifications.utils import push_notification
from creators.models import Creator
from django.template.loader import render_to_string

try:
    from allauth.account.adapter import get_adapter
    from allauth.account.utils import send_email_confirmation
    from allauth.account.models import EmailAddress
except ImportError:
    raise ImportError("allauth needs to be added to INSTALLED_APPS.")


def user_field(user, field, *args):
    """
    Gets or sets (optional) user model fields. No-op if fields do not exist.
    """
    if not field:
        return
    User = get_user_model()
    try:
        field_meta = User._meta.get_field(field)
        max_length = field_meta.max_length
    except FieldDoesNotExist:
        if not hasattr(user, field):
            return
        max_length = None
    if args:
        # Setter
        v = args[0]
        if v:
            v = v[0:max_length]
        setattr(user, field, v)
    else:
        # Getter
        return getattr(user, field)


def user_phone(user, *args):
    return user_field(user, "phone", *args)


def _has_verified_phone_for_login(user, phone):
    from .models import PhoneNumber

    phonenumber = None
    if phone:
        ret = False
        try:
            phonenumber = PhoneNumber.objects.get_for_user(user, phone)
            ret = phonenumber.verified
        except PhoneNumber.DoesNotExist:
            pass
    else:
        ret = PhoneNumber.objects.filter(user=user, verified=True).exists()
    return ret


def _has_verified_email_for_login(user, email):
    emailaddress = None
    if email:
        ret = False
        try:
            emailaddress = EmailAddress.objects.get_for_user(user, email)
            ret = emailaddress.verified
        except EmailAddress.DoesNotExist:
            pass
    else:
        ret = EmailAddress.objects.filter(user=user, verified=True).exists()
    return ret


def perform_send_phone_confirmation(
    request,
    user,
    signup=False,
    phone=None,
):
    adapter = get_adapter(request)
    if not user.is_active:
        return adapter.respond_user_inactive(request, user)

    if not _has_verified_phone_for_login(user, phone):
        send_phone_confirmation(request, user, signup=signup, phone=phone)


def perform_send_email_confirmation(request, user, signup=False, email=None):
    adapter = get_adapter(request)
    if not user.is_active:
        return adapter.respond_user_inactive(request, user)

    if not _has_verified_email_for_login(user, email):
        send_email_confirmation(
            request, user, signup=signup)


def setup_user_phone(user):
    """
    Creates proper PhoneNumber for the user that was just signed
    up. Only sets up, doesn't do any other handling such as sending
    out phone number confirmation texts etc.
    """
    from .models import PhoneNumber

    assert not PhoneNumber.objects.filter(user=user).exists()

    phone = user_phone(user)
    phone_number = None
    if phone:
        phone_number = PhoneNumber(
            user=user, phone=phone, primary=True, verified=False)
        phone_number.save()

    if phone_number:
        PhoneNumber.objects.fill_cache_for_user(user, [phone_number])
    return phone_number


def send_phone_confirmation(request, user, signup=False, phone=None):
    """
    Phone Number verification texts are sent:
    a) Explicitly: when a user signs up

    """
    from .models import PhoneNumber

    if not phone:
        phone = user_phone(user)
    if phone:
        try:
            phone_number = PhoneNumber.objects.get_for_user(user, phone)
            if not phone_number.verified:
                phone_number.send_confirmation(request, signup=signup)
        except PhoneNumber.DoesNotExist:
            phone_number = PhoneNumber.objects.add_phone(
                request, user, phone, signup=signup, confirm=True
            )
            assert phone_number


def send_group_invite_notification(creatorgroup, new_members):
    for member in new_members:
        if member != creatorgroup.creator:
            creatorgroup.send_group_invite_confirmation(creator=member)


def process_avatar(oldInstance, newInstance):

    if oldInstance and oldInstance.username != newInstance.username:
        newInstance.avatar = 'https://robohash.org/{0}'.format(
            newInstance.username)
        newInstance.save()

        if oldInstance.avatar.find("robohash.org") == -1:
            delete_file_task.delay(oldInstance.avatar)

        upload_file_task.delay(newInstance.id, newInstance.username)

    elif not oldInstance:

        upload_file_task.delay(newInstance.id, newInstance.username)


def activity_notification(activities, **kwargs):

    from projects.models import Project, Comment

    today = timezone.now().replace(hour=0, minute=0, second=0)
    yesterday = today - timedelta(days=1)
    template_name = "activity_notification"
    ctx = {}
    email_contexts = []
    phone_contexts = []
    staffs = get_user_model().objects.filter(is_staff=True)

    if "edited_project" in activities and kwargs.get("project_id"):
        ctx["project_id"] = kwargs.get("project_id")
        ctx["editor"] = kwargs.get("editor")

    else:
        for activity in activities:
            ctx[activity] = None

        new_creators = get_user_model().objects.filter(
            date_joined__gte=yesterday, date_joined__lt=today)
        new_projects = Project.objects.filter(
            created_on__gte=yesterday, created_on__lt=today)
        new_comments = Comment.objects.filter(
            created_on__gte=yesterday, created_on__lt=today)

        if new_creators:
            new_creators = list(
                map(lambda creator: [str(creator.pk), creator.username], new_creators))
            ctx["new_creators"] = new_creators

        if new_projects:
            new_projects = list(
                map(lambda project: [str(project.pk), project.title], new_projects))
            ctx["new_projects"] = new_projects

        if new_comments:
            new_comments = list(
                map(lambda comment: [str(comment.pk), comment.creator.username], new_comments))
            ctx["new_comments"] = new_comments

    for creator in staffs:
        if creator.email:
            email_contexts.append(
                {"user": creator.username,
                 "email": creator.email,
                 **ctx
                 }
            )

        if creator.phone:
            phone_contexts.append(
                {
                    "phone": creator.phone,
                    **ctx
                }
            )

    ctx_values = list(filter(lambda x: ctx[x] is not None, list(ctx.keys())))

    if len(email_contexts) > 0 and ctx_values:
        send_mass_email.delay(
            template_name=template_name,
            ctxs=email_contexts
        )

    if len(phone_contexts) > 0 and ctx_values:
        send_mass_text.delay(
            template_name=template_name,
            ctxs=phone_contexts
        )


enabled_notification_settings: Dict[Notification.Type, Set[int]] = {
    Notification.Type.BOOKMARK: {Setting.WEB},
    Notification.Type.CLAP: {Setting.WEB},
    Notification.Type.COMMENT: {Setting.WHATSAPP, Setting.EMAIL, Setting.SMS, Setting.WEB},
    Notification.Type.FOLLOW: {Setting.WHATSAPP, Setting.EMAIL, Setting.SMS, Setting.WEB},
    Notification.Type.FOLLOWING_PROJECT:
    {Setting.WHATSAPP, Setting.EMAIL, Setting.SMS, Setting.WEB},
}


def is_valid_setting(setting: int, notification_type: Notification.Type) -> bool:
    return setting in enabled_notification_settings[notification_type]


html_based_contacts = {Setting.EMAIL, Setting.WEB}
def get_notification_template_name(
        contact_method: int, notification_type: Notification.Type) -> str:
    file_extension = 'html' if contact_method in html_based_contacts else 'txt'
    return (f'notifications/{notification_type.label.lower()}'
            f'/{Setting.CONTACT_CHOICES[cast(int, contact_method) - 1][1].lower()}.{file_extension}')


def send_notification(users: List[Creator], source: Creator, contexts,
                      notification_type: Notification.Type, link: str) -> None:
    email_contexts = []
    sms_contexts = []

    for user, context in zip(users, contexts):
        user_setting = Setting.objects.get(creator=user)
        context.update({'source': user.username})

        if user.phone and user_setting.contact == Setting.WHATSAPP and is_valid_setting(Setting.WHATSAPP, notification_type):
            context.update({"phone": user.phone})
            send_whatsapp.delay(phone=user.phone,
                                template_name=get_notification_template_name(Setting.WHATSAPP, notification_type),
                                ctx=context)

        if user.email and user_setting.contact == Setting.EMAIL and is_valid_setting(Setting.EMAIL, notification_type):
            context.update({"email": user.email})
            email_contexts.append(context)

        if user.phone and user_setting.contact == Setting.SMS and is_valid_setting(Setting.SMS, notification_type):
            context.update({"phone": user.phone})
            sms_contexts.append(context)

        message = render_to_string(
            get_notification_template_name(Setting.WEB, notification_type),
            context
        ).strip()
        push_notification(user, source, notification_type, message, link)

    if len(email_contexts) > 0:
        send_mass_email.delay(template_name=get_notification_template_name(Setting.EMAIL, notification_type), ctxs=email_contexts)
    if len(sms_contexts) > 0:
        send_mass_text.delay(template_name=get_notification_template_name(Setting.SMS, notification_type), ctxs=sms_contexts)


# def sync_user_email_addresses(user):
#     """
#     Keep user.email in sync with user.emailaddress_set.

#     Under some circumstances the user.email may not have ended up as
#     an EmailAddress record, e.g. in the case of manually created admin
#     users.
#     """
#     from .models import EmailAddress

#     email=user_email(user)
#     if (
#         email
#         and not EmailAddress.objects.filter(user=user, email__iexact=email).exists()
#     ):
#         if (
#             app_settings.UNIQUE_EMAIL
#             and EmailAddress.objects.filter(email__iexact=email).exists()
#         ):
#             # Bail out
#             return
#         EmailAddress.objects.create(
#             user=user, email=email, primary=False, verified=False
#         )
