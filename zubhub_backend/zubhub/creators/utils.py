from datetime import timedelta
from django.core.exceptions import FieldDoesNotExist
from django.utils import timezone
from django.contrib.auth import get_user_model
from projects.tasks import delete_file_task
from creators.tasks import upload_file_task, send_mass_email, send_mass_text, send_whatsapp

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


def send_notification(users, context, template_name):
    from .models import Setting

    for user in users:
        user_setting = Setting.objects.get(creator=user)
        if user_setting.contact == Setting.WHATSAPP:
            context.update({"phone": user.phone})
            send_whatsapp(
                phone=user.phone,
                template_name=template_name,
                ctx=context)
        if user_setting.contact == Setting.EMAIL:
            context.update({"email": user.email})
            send_mass_email.delay(
                template_name=template_name,
                ctxs=context
            )
        if user_setting.contact == Setting.SMS:
            context.update({"phone": user.phone})
            send_mass_text.delay(
                template_name=template_name,
                ctxs=context
            )
