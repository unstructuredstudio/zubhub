from enum import IntEnum
import re
from typing import Optional, Set
from akismet import Akismet
from lxml.html.clean import Cleaner
from lxml.html import document_fromstring
from django.apps import apps
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import prefetch_related_objects
from django.db.models import F
from django.conf import settings
from creators.tasks import send_mass_email, send_mass_text

Creator = get_user_model()


LOCK_EXPIRE = {"30mins": 60 * 10}


def task_lock(key):
    # locks task for a model for a particular length of time
    value = cache.get(key)

    if value:
        return False

    return cache.add(key, True, LOCK_EXPIRE["30mins"])


def update_images(project, images_data):
    Image = apps.get_model('projects.Image')
    images = project.images.all()

    images_to_save = []

    if images.count() != len(images_data):
        for image_dict in images_data:
            exist = False
            for image in images:
                if image_dict["image_url"] == image.image_url:
                    exist = True
            if not exist:
                images_to_save.append(image_dict)

        for image in images:
            image.delete()

    for image in images_to_save:
        Image.objects.create(project=project, **image)


def update_tags(project, tags_data):
    Tag = apps.get_model('projects.Tag')
    tags = project.tags.all()

    tags_dict = {}

    for tag in tags_data:
        tags_dict[tag["name"]] = True

    for tag in tags:
        if not tags_dict.get(tag.name, None):
            project.tags.remove(tag)

    for tag in tags_data:
        tag, created = Tag.objects.get_or_create(name=tag["name"])
        tag.projects.add(project)


def send_staff_pick_notification(staff_pick):
    from creators.models import Setting
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


def send_spam_notification(comment_id, staffs_and_mods):
    email_contexts = []
    phone_contexts = []
    template_name = "spam_notification"
    for each in staffs_and_mods:
        if each.email:
            email_contexts.append(
                {"user": each.username,
                 "email": each.email,
                 "comment_id": comment_id
                 }
            )

        if each.phone:
            phone_contexts.append(
                {
                    "phone": each.phone,
                    "comment_id": comment_id
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


def filter_spam(ctx):

    site_url = settings.DEFAULT_BACKEND_PROTOCOL + \
        "://"+settings.DEFAULT_BACKEND_DOMAIN

    if site_url.find("localhost") != -1:
        return

    Comment = apps.get_model('projects.Comment')
    PublishingRule = apps.get_model('projects.PublishingRule')
    comment = Comment.objects.get(id=ctx.get("comment_id"))

    if ctx.get("method") == 'POST' and comment.publish.type != PublishingRule.DRAFT:
        akismet_api = Akismet(key=settings.AKISMET_API_KEY,
                              blog_url=site_url)

        is_spam = akismet_api.comment_check(
            user_ip=ctx.get("REMOTE_ADDR"),
            user_agent=ctx.get("HTTP_USER_AGENT"),
            comment_type='comment',
            comment_content=ctx.get("text"),
            blog_lang=ctx.get("lang"),
        )

        if is_spam:
            comment.publish.type = PublishingRule.DRAFT
            comment.publish.publisher_id = None ## Set publisher_id to none when zubhub system unpublished a comment.
            comment.save()

            staffs_and_mods = Creator.objects.filter(is_staff=True)
            staffs_and_mods = staffs.union(Creator.objects.filter(tags__name="moderator"))

            send_spam_notification(ctx.get("comment_id"), staffs_and_mods)


def project_changed(obj, instance):
    changed = False

    if not obj.creator == instance.creator:
        changed = True
    elif not obj.title == instance.title:
        changed = True
    elif not obj.description == instance.description:
        changed = True
    elif not obj.video == instance.video:
        changed = True
    elif not obj.materials_used == instance.materials_used:
        changed = True
    elif ((not obj.publish.type == instance.publish.type) or 
        (not set(obj.publish.visible_to.all()) == set(instance.publish.visible_to.all()))):
        changed = True
    else:
        obj_images = obj.images.all()
        instance_images = instance.images.all()

        if not obj_images.count() == instance_images.count():
            changed = True
        else:
            obj_image_dict = {}
            instance_image_dict = {}

            for image in obj_images:
                obj_image_dict[image.pk] = True

            for image in instance_images:
                instance_image_dict[image.pk] = True

            for pk in list(obj_image_dict.keys()):
                if not instance_image_dict.get(pk, None):
                    changed = True

    return changed


def parse_comment_trees(user, data, creators_dict):
    PublishingRule = apps.get_model('projects.PublishingRule')

    def recursive_parse(data):
        arr = []

        for comment in data:

            ## this is an expensive operation. We should make out time to figure
            ## out all the places in the codebase where there are database query related problems
            ## and start optimizing those queries.
            rule = PublishingRule.objects.get(id=comment["data"]["publish"])

            """ If user making request is permitted to view comment """
            if can_view(user, rule.comment_target):

                parsed = {}
                parsed["id"] = comment["id"]
                parsed["project"] = comment["data"]["project"]
                parsed["creator"] = creators_dict[comment["data"]["creator"]]
                parsed["text"] = comment["data"]["text"]
                parsed["created_on"] = comment["data"]["created_on"]

                children = comment.get("children", [])
                parsed["replies"] = recursive_parse(children)

                arr.append(parsed)
        arr.reverse()
        return arr

    return recursive_parse(data)


def can_view(user, target):
    """
    Check if user can view project or comment.
    """

    """ get type and visible_to from publish """
    PublishingRule = apps.get_model('projects.PublishingRule')
    type = target.publish.type
    visible_to = target.publish.visible_to

    if (type == PublishingRule.DRAFT and user.is_authenticated and 
        (user.comments.filter(id=target.id).exists() or 
        user.projects.filter(id=target.id).exists())):
        return True
    if type == PublishingRule.PUBLIC:
        return True
    if type == PublishingRule.AUTHENTICATED_VIEWERS and user.is_authenticated:
        return True

    if (type == PublishingRule.PREVIEW and user.is_authenticated and 
        ( visible_to.filter(id=user.id).count() > 0 or 
        user.comments.filter(id=target.id).exists() or 
        user.projects.filter(id=target.id).exists())):
        """ Check if user is in visible_to or if project/comment belongs to the authenticated user """
        return True

    return False


def get_published_projects_for_user(user, all):
    """ 
    Get all projects user can view.

    Given a queryset of projects, 
    get a subset of projects in the queryset that user is permitted to view.

    Params:
    user - request.user object
    all - initial queryset.

    Returns:
    queryset of projects user is permitted to view.
    """

    Project = apps.get_model('projects.Project')
    PublishingRule = apps.get_model('projects.PublishingRule')


    """ fetch all projects where publishing rule is PUBLIC """
    public = all.filter(publish__type=PublishingRule.PUBLIC)

    """ fetch all projects where publishing rule is AUTHENTICATED_VIEWERS if user is authenticated """
    authenticated = Project.objects.none()
    if user.is_authenticated:
        authenticated = all.filter(publish__type=PublishingRule.AUTHENTICATED_VIEWERS)
    
    """ fetch all projects where publishing rule is PREVIEW """
    visible_to = all.filter(publish__type=PublishingRule.PREVIEW, 
                            publish__visible_to__id=user.id)

    return public.union(authenticated).union(visible_to).order_by("-created_on")


def detect_mentions(kwargs):
    text = kwargs.get("text", None)
    creator = kwargs.get("creator", None)
    project_id = kwargs.get("project_id", None)
    profile_username = kwargs.get("profile_username", None)

    if isinstance(text, str):
        mentions = list(map(lambda x: x.split(
            "@")[1], re.findall("\B@[0-9a-zA-Z_.-]+", text)))

        email_contexts = []
        phone_contexts = []
        mentions = Creator.objects.filter(username__in=mentions)

        template_name = "mention_notification"
        for mention in mentions:
            if mention.email and (mention.username != creator):
                email_contexts.append(
                    {"creator": creator,
                     "project_id": project_id,
                     "profile_username": profile_username,
                     "email": mention.email
                     }
                )

            if mention.phone and (mention.username != creator):
                phone_contexts.append(
                    {"creator": creator,
                     "project_id": project_id,
                     "profile_username": profile_username,
                     "phone": mention.phone
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

""" String html tags, event handlers, styles, etc from comment string """
def clean_comment_text(string):
    doc = document_fromstring(string)
    cleaner = Cleaner()
    return cleaner.clean_html(doc).text_content()

""" Clean project description while still allowing for basic html structure """
def clean_project_desc(string):
    cleaner = Cleaner(remove_tags=["a"])
    return cleaner.clean_html(string)


class ProjectSearchCriteria(IntEnum):
    CATGEORY = 0
    TAG = 1
    TITLE_DESCRIPTION = 2


default_search_criteria = {ProjectSearchCriteria.CATGEORY, ProjectSearchCriteria.TAG, ProjectSearchCriteria.TITLE_DESCRIPTION}
def perform_project_search(user, query_string, search_criteria: Optional[Set[ProjectSearchCriteria]] = None):
    """
    Perform search for projects matching query.

    performs search across categories, tags, and projects, 
    and aggregate all projects that match the result.

    This function should be improved, perhaps use elasticsearch? 
    serious performance problems might be encountered in the future.
    """

    Category = apps.get_model('projects.Category')
    Tag = apps.get_model('projects.Tag')
    Project = apps.get_model('projects.Project')
    PublishingRule = apps.get_model('projects.PublishingRule')

    query = SearchQuery(query_string, search_type="phrase")
    rank = SearchRank(F('search_vector'), query)
    result_projects = None

    # fetch all projects whose category(s) matches the search query
    result_categories = Category.objects.filter(search_vector=query)
    result_categories_tree = None

    for category in result_categories:
        if result_categories_tree:
            result_categories_tree |= Category.get_tree(parent=category)
        else:
            result_categories_tree = Category.get_tree(parent=category)

    if search_criteria is None:
        search_criteria = default_search_criteria

    result_projects = Project.objects.none()
    if ProjectSearchCriteria.CATGEORY in search_criteria and result_categories_tree:
        prefetch_related_objects(result_categories_tree, 'projects')

        for category in result_categories_tree:
            result_projects |= category.projects.all().annotate(rank=rank).order_by('-rank')
    #################################################################

    # fetch all projects whose tag(s) matches the search query
    result_tags = Tag.objects.filter(
        search_vector=query).prefetch_related("projects")
    if ProjectSearchCriteria.TAG in search_criteria:
        for tag in result_tags:
            result_projects |= tag.projects.all().annotate(rank=rank).order_by('-rank')
    ############################################################


    # #################################################################

    # # fetch all projects whose publishing rule matches the search query
    # choices = PublishingRule.PUBLISHING_CHOICES
    # types_dict = dict((y, x) for x, y in choices)
    # type = types_dict.get(query_string, 4)
    # result_rules = PublishingRule.objects.filter(type=type).select_related("project_target")

    # for rule in result_rules:
    #     project = rule.project_target
    #     if result_projects:
    #         result_projects |= Project.objects.filter(id=project.id)
    #     else:
    #         result_projects = Project.objects.filter(id=project.id)
    # ############################################################

    # fetch all projects that matches the search term
    if ProjectSearchCriteria.TITLE_DESCRIPTION in search_criteria:
        result_projects |= Project.objects.annotate(rank=rank).filter(search_vector=query ).order_by('-rank')
    ##############################################################

    result = []

    """ make sure that user can view all projects in search result """
    for project in result_projects:
        if can_view(user, project):
            result.append(project)

    return result
