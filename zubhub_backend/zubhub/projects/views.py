from django.shortcuts import get_object_or_404
from django.http import Http404
from django.utils.translation import ugettext_lazy as _
from notifications.models import Notification
from rest_framework.response import Response
from django.contrib.auth.models import AnonymousUser
from django.contrib.postgres.search import TrigramSimilarity, SearchQuery, SearchRank
from django.core.exceptions import PermissionDenied
from django.db.models import F
from django.db import transaction
from rest_framework import status
from rest_framework.generics import (UpdateAPIView, CreateAPIView, ListAPIView,
                                     RetrieveAPIView, DestroyAPIView)
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from projects.permissions import (IsOwner, IsStaffOrModerator,
                                  SustainedRateThrottle, PostUserRateThrottle,
                                  GetUserRateThrottle, CustomUserRateThrottle)
from .models import Project, Comment, StaffPick, Category, Tag, PublishingRule
from creators.models import Creator
from .utils import (ProjectSearchCriteria, project_changed, detect_mentions,
                    perform_project_search, can_view,
                    get_published_projects_for_user)
from creators.utils import (activity_notification, send_notification, set_badge_like_category,
                            set_badge_project_category, set_badge_view_category,
                             set_badge_comment_category)
from .serializers import (ProjectSerializer, ProjectListSerializer,
                          CommentSerializer, CategorySerializer, TagSerializer,
                          StaffPickSerializer)
from .pagination import ProjectNumberPagination


class ProjectCreateAPIView(CreateAPIView):
    """
    Create new Project.\n

    Requires authentication. Returns project details.\n
    Request body format:\n
        {\n
            "title": "string",\n
            "description": "string",\n
            "images": [\n
                {\n
                "image_url": "string",\n
                "public_id": "string"\n
                }\n
            ],\n
            "video": "string",\n
            "materials_used": "string",\n
            "category": "string",\n
            "publish": {"type": 4, "visible_to": []}\n
        }\n
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]

    def perform_create(self, serializer):
        obj = serializer.save(creator=self.request.user)
        self.request.user.save()

        creator = Creator.objects.get(id = obj.creator_id)
        project_count= creator.projects_count
        set_badge_project_category(creator, project_count)

        if self.request.user.followers is not None:
            send_notification(
                list(self.request.user.followers.all()),
                self.request.user,
                [{"project": obj.title} for _ in list(self.request.user.followers.all())],
                Notification.Type.FOLLOWING_PROJECT,
                f'/creators/{self.request.user.username}'
            )

class ProjectUpdateAPIView(UpdateAPIView):
    """
    Update project.

    Requires authentication.\n
    Requires project id.\n
    Returns project details.\n
    request body format:\n
        {\n
            "title": "string",\n
            "description": "string",\n
            "images": [\n
                {\n
                "image_url": "string",\n
                "public_id": "string"\n
                }\n
            ],\n
            "video": "string",\n
            "materials_used": "string",\n
            "category": "string",\n
            "publish": {"type": 4, "visible_to": []}\n
        }\n
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    def perform_update(self, serializer):
        try:
            old = Project.objects.get(pk=self.kwargs.get("pk"))
        except Project.DoesNotExist:
            pass

        new = serializer.save(creator=self.request.user)
        self.request.user.save()

        if project_changed(old, new):
            info = {
                "project_id": str(new.pk),
                "editor": self.request.user.username
            }
            activity_notification(["edited_project"], **info)

        # because project_changed still needs to make reference to the
        # old publishing rule, it wasn't deleted in the serializer update method,
        # instead we delete it here after project_changed has done it's part.
        old.publish.delete()


class ProjectDeleteAPIView(DestroyAPIView):
    """
    Delete a project from database.

    Requires authentication.
    Requires project id.
    Returns {details: "ok"}
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    def delete(self, request, *args, **kwargs):
        project = self.get_object()
        creator = Creator.objects.get(id = project.creator_id)
        if project:
            result = self.destroy(request, *args, **kwargs)
            project_count_after_deletion = creator.projects_count -1
            request.user.save()
            set_badge_project_category(creator, project_count_after_deletion)
            return result


class ProjectListAPIView(ListAPIView):
    """
    Fetch paginated list of projects.

    Returns paginated list of projects
    """

    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        all = Project.objects.prefetch_related('publish__visible_to').all()
        return get_published_projects_for_user(self.request.user, all)


class ProjectTagSearchAPIView(ListAPIView):
    """
    Fulltext search of project tags.

    Requires query string.
    Returns list of matching tags
    """

    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_queryset(self):
        query_string = self.request.GET.get('q')
        query = SearchQuery(query_string)
        rank = SearchRank(F('search_vector'), query)
        tags = Tag.objects.annotate(rank=rank).filter(
            search_vector=query).order_by('-rank')
        return tags


class ProjectTagAutocompleteAPIView(ListAPIView):
    """
    Autocomplete based search of all tags

    Requires query string.
    Returns list of matching tags
    """

    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_queryset(self):
        query_string = self.request.GET.get('q')
        tags = Tag.objects.annotate(
            similarity=TrigramSimilarity('name', query_string)).filter(
                similarity__gt=0.01).order_by('-similarity')[:20]
        return tags


class ProjectAutocompleteAPIView(ListAPIView):
    """
    Fulltext search of projects.

    Requires query string.
    Returns paginated list of matching projects.
    """

    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_queryset(self):
        query_string = self.request.GET.get('q')
        projects = Project.objects.annotate(
            similarity=TrigramSimilarity('title', query_string)).filter(
                similarity__gt=0.01).order_by('-similarity')[:20]
        result = []
        for project in projects:
            if can_view(self.request.user, project):
                result.append(project)
        return result


class ProjectSearchAPIView(ListAPIView):
    """
    Fulltext search of projects.

    Requires query string.
    Returns paginated list of matching projects.
    """

    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        try:
            search_criteria = {
                ProjectSearchCriteria(int(self.request.GET.get('criteria',
                                                               '')))
            }
        except (KeyError, ValueError):
            search_criteria = None
        return perform_project_search(self.request.user,
                                      self.request.GET.get("q"),
                                      search_criteria)


class ProjectDetailsAPIView(RetrieveAPIView):
    """
    Fetch Project details.

    Rquires project id.
    Returns project details.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(queryset, pk=pk)
        """ check if user is permitted to view this project """
        if can_view(self.request.user, obj):
            with transaction.atomic():
                if isinstance(self.request.user, AnonymousUser):
                    obj.views_count += 1
                    obj.save()
                else:
                    if not self.request.user in obj.views.all():
                        obj.views.add(self.request.user)
                        obj.views_count += 1
                        obj.save()
                creator = Creator.objects.get(id = obj.creator_id)
                set_badge_view_category(creator)
            return obj
        else:
            raise PermissionDenied(
                _('you are not permitted to view this project'))


class SavedProjectsAPIView(ListAPIView):
    """
    Fetch paginated list of projects saved by authenticated user.

    Requires authentication.
    Returns paginated list of projects.
    """

    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        all = self.request.user.saved_for_future.prefetch_related(
            'publish__visible_to').all()
        return get_published_projects_for_user(self.request.user, all)


class ToggleLikeAPIView(RetrieveAPIView):
    """
    Like/Unlike a project.

    Requires authentication.
    Rquires project id.
    Returns project details.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        """ check if user is permitted to view this project """
        if can_view(self.request.user, obj):

            with transaction.atomic():

                if self.request.user in obj.likes.all():
                    obj.likes.remove(self.request.user)
                    obj.save()
                else:
                    obj.likes.add(self.request.user)
                    obj.save()

                    send_notification(
                        [obj.creator],
                        self.request.user,
                        [{'project': obj.title}],
                        Notification.Type.CLAP,
                        f'/projects/{obj.pk}'
                    )

                creator = Creator.objects.get(id = obj.creator_id)
                set_badge_like_category(creator)

            return obj
        else:
            raise PermissionDenied(
                _('you are not permitted to view this project'))

class ToggleSaveAPIView(RetrieveAPIView):
    """
    Add/Remove a project from authenticated user's bookmark.

    Requires authentication.
    Rquires project id.
    Returns project details.
    """

    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        """ check if user is permitted to view this project """
        if can_view(self.request.user, obj):

            with transaction.atomic():

                if self.request.user in obj.saved_by.all():
                    obj.saved_by.remove(self.request.user)
                    obj.save()
                else:
                    obj.saved_by.add(self.request.user)
                    obj.save()

                    send_notification(
                        [obj.creator],
                        self.request.user,
                        [{'project': obj.title}],
                        Notification.Type.BOOKMARK,
                        f'/projects/{obj.pk}'
                    )

            return obj
        else:
            raise PermissionDenied(
                _('you are not permitted to view this project'))

class AddCommentAPIView(CreateAPIView):
    """
    Comment on project.

    Requires authentication.\n
    Requires project id.\n
    Returns project details.\n
    request body format:\n
        {\n
            text: "comment text",\n
            parent_id: "id of parent comment or None"\n
        }\n
    """

    queryset = Project.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        """ check if user is permitted to view this project """
        if can_view(self.request.user, obj):
            return obj
        else:
            raise PermissionDenied(
                _('you are not permitted to view this project'))

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)

        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        parent_id = self.request.data.get("parent_id", None)
        text = serializer.validated_data.get("text", None)

        with transaction.atomic():

            publishing_rule = PublishingRule.objects.create(
                type=PublishingRule.PUBLIC,
                publisher_id=str(self.request.user.id))

            if parent_id:

                try:
                    parent_comment = Comment.objects.get(id=parent_id)
                except Comment.DoesNotExist:
                    raise Http404(_("parent comment does not exist"))

                parent_comment.add_child(project=self.get_object(),
                                         creator=self.request.user,
                                         text=text,
                                         publish=publishing_rule)
            else:
                Comment.add_root(project=self.get_object(),
                                 creator=self.request.user,
                                 text=text,
                                 publish=publishing_rule)

        result = self.get_object()

        creator_str= self.request.user.username
        creator_id= Creator.objects.get(username= creator_str).id
        creator= Creator.objects.get(id = creator_id)
        set_badge_comment_category(creator)

        if result:
            detect_mentions({
                "text": text,
                "project_id": result.pk,
                "creator": request.user.username
            })
            send_notification(
                [result.creator],
                self.request.user,
                [{'project': result.title}],
                Notification.Type.COMMENT,
                f'/projects/{result.pk}'
            )

        return Response(ProjectSerializer(result, context={
            'request': request
        }).data,
                        status=status.HTTP_201_CREATED)
            


class CategoryListAPIView(ListAPIView):
    """
    Fetch list of project categories.

    Returns list of categories.
    """

    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]


class StaffPickListAPIView(ListAPIView):
    """
    Get List of staff-picks.

    A staff-pick is a list of projects curated by zubhub staffs.\n
    Returns list of staff-picks.\n
    response data format:\n
        [\n
            {\n
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",\n
                "title": "string",\n
                "description": "string",\n
                "projects": [paginated list of projects],\n
                "created_on": "2022-02-20T11:58:30.082Z"\n
            }\n
        ]\n
    """

    serializer_class = StaffPickSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_queryset(self):
        return StaffPick.objects.filter(is_active=True)


class StaffPickDetailsAPIView(RetrieveAPIView):
    """
    Get staff-pick details.

    A staff-pick is a list of projects curated by zubhub staffs.\n
    Requires staff-pick id.\n
    Returns a single staff-pick.\n
    response data format:\n
        {\n
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",\n
            "title": "string",\n
            "description": "string",\n
            "projects": [paginated list of projects],\n
            "created_on": "2022-02-20T11:58:30.082Z"\n
        }\n
    """

    queryset = StaffPick.objects.filter(is_active=True)
    serializer_class = StaffPickSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get("pk")
        return get_object_or_404(queryset, pk=pk)


class UnpublishCommentAPIView(UpdateAPIView):
    """
    Unpublish a comment.

    Requires comment id.
    Returns unpublished comment.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsStaffOrModerator]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    def perform_update(self, serializer):
        with transaction.atomic():
            old_publishing_rule = self.get_object().publish

            publishing_rule = PublishingRule.objects.create(
                type=PublishingRule.DRAFT,
                publisher_id=str(self.request.user.id))

            comment = serializer.save(publish=publishing_rule)
            old_publishing_rule.delete()

            if comment and comment.project:
                comment.project.save()
            if comment and comment.profile:
                comment.profile.save()
            return comment


class DeleteCommentAPIView(DestroyAPIView):
    """
    Delete a comment from database.

    Requires authentication.
    Requires comment id.
    Returns {details: "ok"}
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsStaffOrModerator]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    def delete(self, request, *args, **kwargs):
        project = self.get_object().project
        profile = self.get_object().profile

        with transaction.atomic():
            result = self.destroy(request, *args, **kwargs)

            if project:
                project.save()
            if profile:
                profile.save()

            return result
