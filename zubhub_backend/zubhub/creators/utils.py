from datetime import timedelta
from typing import Dict, List, Set

from activitylog.models import Activitylog
from activitylog.utils import push_activity
from creators.models import Badge, Creator, Setting
from creators.tasks import (
    send_mass_email,
    send_mass_text,
    send_whatsapp,
    upload_file_task,
    upload_file_task_group,
)
from django.contrib.auth import get_user_model
from django.contrib.postgres.search import SearchQuery, SearchRank
from django.core.exceptions import FieldDoesNotExist
from django.db import transaction
from django.db.models import F, Sum

# from django.template.loader import render_to_string
from django.utils import timezone
from notifications.models import Notification
from notifications.utils import get_notification_template_name, push_notification
from projects.models import Comment, Project
from projects.tasks import delete_file_task

try:
    from allauth.account.adapter import get_adapter
    from allauth.account.models import EmailAddress
    from allauth.account.utils import send_email_confirmation
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
        send_email_confirmation(request, user, signup=signup)


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
        phone_number = PhoneNumber(user=user, phone=phone, primary=True, verified=False)
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
    """Upload Creator avatar to media server and do cleanups where neccessary"""

    if oldInstance and oldInstance.username != newInstance.username:
        newInstance.avatar = "https://robohash.org/{0}".format(newInstance.username)
        newInstance.save()

        if oldInstance.avatar.find("robohash.org") == -1:
            delete_file_task.delay(oldInstance.avatar)

        upload_file_task.delay(newInstance.id, newInstance.username)

    elif not oldInstance:
        upload_file_task.delay(newInstance.id, newInstance.username)


def process_group_avatar(oldInstance, newInstance):
    """Upload CreatorGroup avatar to media server and do cleanups where neccessary"""

    if oldInstance and oldInstance.groupname != newInstance.groupname:
        newInstance.avatar = "https://robohash.org/{0}".format(newInstance.groupname)
        newInstance.save()

        if oldInstance.avatar.find("robohash.org") == -1:
            delete_file_task.delay(oldInstance.avatar)

        upload_file_task_group.delay(newInstance.id, newInstance.groupname)

    elif not oldInstance:
        upload_file_task_group.delay(newInstance.id, newInstance.groupname)


def activity_notification(activities, **kwargs):
    from projects.models import Comment, Project

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
            date_joined__gte=yesterday, date_joined__lt=today
        )
        new_projects = Project.objects.filter(
            created_on__gte=yesterday, created_on__lt=today
        )
        new_comments = Comment.objects.filter(
            created_on__gte=yesterday, created_on__lt=today
        )

        if new_creators:
            new_creators = list(
                map(lambda creator: [str(creator.pk), creator.username], new_creators)
            )
            ctx["new_creators"] = new_creators

        if new_projects:
            new_projects = list(
                map(lambda project: [str(project.pk), project.title], new_projects)
            )
            ctx["new_projects"] = new_projects

        if new_comments:
            new_comments = list(
                map(
                    lambda comment: [str(comment.pk), comment.creator.username],
                    new_comments,
                )
            )
            ctx["new_comments"] = new_comments

    for creator in staffs:
        if creator.email:
            email_contexts.append(
                {"user": creator.username, "email": creator.email, **ctx}
            )

        if creator.phone:
            phone_contexts.append({"phone": creator.phone, **ctx})

    ctx_values = list(filter(lambda x: ctx[x] is not None, list(ctx.keys())))

    if len(email_contexts) > 0 and ctx_values:
        send_mass_email.delay(template_name=template_name, ctxs=email_contexts)

    if len(phone_contexts) > 0 and ctx_values:
        send_mass_text.delay(template_name=template_name, ctxs=phone_contexts)


def perform_creator_search(user, query_string):
    from creators.models import CreatorTag

    """
    Perform search for creators matching query.

    performs search across creators and creatortags,
    and aggregate all creators that match the result.
    """

    query = SearchQuery(query_string)
    rank = SearchRank(F("search_vector"), query)
    result_creators = None

    # fetch all creators whose creatortag(s) matches the search query
    result_tags = CreatorTag.objects.filter(search_vector=query).prefetch_related(
        "creators"
    )

    for tag in result_tags:
        result_creators = (
            tag.creators.filter(is_active=True).annotate(rank=rank).order_by("-rank")
        )
    ############################################################

    # fetch all creators that matches the search term
    if result_creators:
        result_creators.union(
            get_user_model()
            .objects.annotate(rank=rank)
            .filter(search_vector=query, is_active=True)
            .order_by("-rank")
        )
    else:
        result_creators = (
            get_user_model()
            .objects.annotate(rank=rank)
            .filter(search_vector=query, is_active=True)
            .order_by("-rank")
        )
    ##############################################################

    if not user.is_authenticated:
        result_creators = result_creators[:4]
    return result_creators


def custom_set_creatortags_queryset(creator, creatortags):
    """
    Handle the process of assigning a queryset of creatortags to creator.tags

    Given a queryset of creatortags,'enforce_creator__creator_tags_constraints' needs
    to be called for each core creatortags (staff, moderator, group, creator) and
    there needs to be some order to how it is called to ensure adherence to an order
    of relative importance.
    E.g. if you attempt giving a creator instance a queryset of  'staff' and 'creator',
    'staff' tag should be set and 'creator' tag should be dropped.
    This is because 'staff' tag is expected to precede 'creator' tag.

    Note: do not change the order of the if statements, they are arranged in order of
    relative importance to ensure certain tags takes precidence over others.
    """
    with transaction.atomic():
        from creators.models import CreatorTag

        creator.tags.set(creatortags)

        tag = CreatorTag.objects.filter(name="staff").first()
        if creatortags.filter(name=tag.name).exists():
            creator.tags.set(enforce_creator__creator_tags_constraints(creator, tag))
            creatortags = creatortags.exclude(name=tag.name)

        tag = CreatorTag.objects.filter(name="moderator").first()
        if creatortags.filter(name=tag.name).exists():
            creator.tags.set(enforce_creator__creator_tags_constraints(creator, tag))
            creatortags = creatortags.exclude(name=tag.name)

        tag = CreatorTag.objects.filter(name="group").first()
        if creatortags.filter(name=tag.name).exists():
            creator.tags.set(enforce_creator__creator_tags_constraints(creator, tag))
            creatortags = creatortags.exclude(name=tag.name)

        tag = CreatorTag.objects.filter(name="creator").first()
        if creatortags.filter(name=tag.name).exists():
            creator.tags.set(enforce_creator__creator_tags_constraints(creator, tag))
            creatortags = creatortags.exclude(name=tag.name)


def enforce_creator__creator_tags_constraints(creator, tag):
    """
    Enforce certain constraints on what tags a creator instance should have together.

    Should only be called when trying to set base tags
    like 'creator', 'staff', 'moderator' or 'group'.

    Creator tags is a list, but certain tags shouldn't be in the same
    list at the same time.
    e.g. "creator" tag is the default tag set when a user account is created, but should
         be removed from a creator's tags list when other tags like "staff", "moderator"
         or "group" is added to the tags list.
    This function contains the logic to decide which creator tags already in a creator's
    tags list should be set with the incoming tag and which should be removed.
    """

    if tag.creators.filter(id=creator.id).exists():
        from creators.models import CreatorTag

        if tag.name == "creator":
            """
            If tag is 'creator', ensure that 'staff', 'moderator' and
            'group' tags are not in the user's tags list
            """
            diff = CreatorTag.objects.filter(
                name__in=["creator", "staff", "group", "moderator"]
            )
            tags_to_set = creator.tags.difference(diff)
            return tags_to_set.union(diff.filter(name=tag.name))

        elif tag.name == "staff":
            """
            If tag is 'staff', ensure that 'creator' and 'group' tags are not in
            the user's tags list
            """
            diff = CreatorTag.objects.filter(name__in=["creator", "staff", "group"])
            tags_to_set = creator.tags.difference(diff)
            return tags_to_set.union(diff.filter(name=tag.name))

        elif tag.name == "moderator":
            """
            If tag is 'moderator', ensure that 'creator' and 'group' tags are
            not in the user's tags list
            """
            diff = CreatorTag.objects.filter(name__in=["creator", "group", "moderator"])
            tags_to_set = creator.tags.difference(diff)
            return tags_to_set.union(diff.filter(name=tag.name))

        elif tag.name == "group":
            """If tag is 'group', ensure that 'staff', 'creator'and
            'moderator' tags are not in the user's tags list"""
            diff = CreatorTag.objects.filter(
                name__in=["creator", "staff", "group", "moderator"]
            )
            tags_to_set = creator.tags.difference(diff)
            return tags_to_set.union(diff.filter(name=tag.name))

        else:
            """
            If no matching tag is found, raise an Exception to avoid
            mistakenly resetting creator.tags
            """
            raise Exception(
                """
            tag didn't match any of the conditions.
            pass a tag that matches any of 'creator', 'staff', 'moderator', or 'group'
            """
            )
    else:
        return creator.tags.all()


def activity_log(
    target: List[Creator],
    source: Creator,
    contexts,
    activity_type: Activitylog.Type,
    link: str,
):
    for user, context in zip(target, contexts):
        context.update({"source": source.username})
        context.update({"target": user.username})

    push_activity(user, source, context, activity_type, link)


enabled_notification_settings: Dict[Notification.Type, Set[int]] = {
    Notification.Type.BOOKMARK: {Setting.WEB},
    Notification.Type.CLAP: {Setting.WEB},
    Notification.Type.COMMENT: {
        Setting.WHATSAPP,
        Setting.EMAIL,
        Setting.SMS,
        Setting.WEB,
    },
    Notification.Type.FOLLOW: {
        Setting.WHATSAPP,
        Setting.EMAIL,
        Setting.SMS,
        Setting.WEB,
    },
    Notification.Type.FOLLOWING_PROJECT: {
        Setting.WHATSAPP,
        Setting.EMAIL,
        Setting.SMS,
        Setting.WEB,
    },
}


def is_valid_setting(setting: int, notification_type: Notification.Type) -> bool:
    return setting in enabled_notification_settings[notification_type]


def send_notification(
    users: List[Creator],
    source: Creator,
    contexts,
    notification_type: Notification.Type,
    link: str,
) -> None:
    email_contexts = []
    sms_contexts = []

    for user, context in zip(users, contexts):
        user_setting = Setting.objects.get(creator=user)
        context.update({"source": source.username})

        if (
            user.email
            and user_setting.contact == Setting.EMAIL
            and is_valid_setting(Setting.EMAIL, notification_type)
        ):
            context.update({"email": user.email})
            email_contexts.append(context)

        if (
            user.phone
            and user_setting.contact == Setting.SMS
            and is_valid_setting(Setting.SMS, notification_type)
        ):
            context.update({"phone": user.phone})
            sms_contexts.append(context)

        if is_valid_setting(Setting.WEB, notification_type):
            successfully_pushed = push_notification(
                user, source, notification_type, link, context
            )
            if not successfully_pushed:
                return

        if (
            user.phone
            and user_setting.contact == Setting.WHATSAPP
            and is_valid_setting(Setting.WHATSAPP, notification_type)
        ):
            context.update({"phone": user.phone})
            send_whatsapp.delay(
                phone=user.phone,
                template_name=get_notification_template_name(
                    Setting.WHATSAPP, notification_type
                ),
                ctx=context,
            )

    if len(email_contexts) > 0:
        send_mass_email.delay(
            template_name=get_notification_template_name(
                Setting.EMAIL, notification_type
            ),
            ctxs=email_contexts,
            full_template=True,
        )
    if len(sms_contexts) > 0:
        send_mass_text.delay(
            template_name=get_notification_template_name(
                Setting.SMS, notification_type
            ),
            ctxs=sms_contexts,
            full_template=True,
        )


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


def remove_initial_titles(creator, ids):
    for id in ids:
        creator.badges.remove(Badge.objects.get(id=id))


def add_titles(creator, count, ids):
    for id in ids:
        value = Badge.objects.get(id=id).threshold_value
        if count > value:
            creator.badges.add(Badge.objects.get(id=id))
            break


def set_badge_like_category(creator):
    likes_count = Project.objects.filter(creator=creator).aggregate(
        Sum(("likes_count"))
    )["likes_count__sum"]

    badge_ids = [14, 13, 12]

    remove_initial_titles(creator, badge_ids)
    add_titles(creator, likes_count, badge_ids)


def set_badge_view_category(creator):
    views_count = Project.objects.filter(creator=creator).aggregate(
        Sum(("views_count"))
    )["views_count__sum"]

    badge_ids = [11, 10, 9, 8]

    remove_initial_titles(creator, badge_ids)
    add_titles(creator, views_count, badge_ids)


def set_badge_comment_category(creator):
    creator_id = creator.id
    comments_count = Comment.objects.filter(creator__id=creator_id).count()

    badge_ids = [7, 6, 5]

    remove_initial_titles(creator, badge_ids)
    add_titles(creator, comments_count, badge_ids)


def set_badge_project_category(creator, projects_count):
    project_count_before_del = creator.projects_count

    if projects_count < project_count_before_del:
        queryset = Project.objects.filter(creator=creator)
        if queryset.exists():
            set_badge_view_category(creator)
            set_badge_like_category(creator)
            set_badge_comment_category(creator)

    badge_ids = [4, 3, 2, 1]

    remove_initial_titles(creator, badge_ids)
    add_titles(creator, projects_count, badge_ids)
