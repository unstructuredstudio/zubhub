import csv
from io import StringIO
from django.utils.translation import ugettext_lazy as _
from notifications.models import Notification
from activitylog.models import Activitylog
from rest_framework import status
from django.http import Http404
from django.contrib.auth import get_user_model
from django.contrib.postgres.search import TrigramSimilarity
from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.apps import apps
from django.core.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.views import APIView
from rest_framework.generics import (UpdateAPIView, RetrieveAPIView,
                                     ListAPIView, DestroyAPIView,
                                     CreateAPIView, GenericAPIView)
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_auth.registration.views import RegisterView

from projects.serializers import CommentSerializer
from projects.models import Comment, PublishingRule
from projects.serializers import ProjectListSerializer
from projects.pagination import ProjectNumberPagination
from projects.utils import detect_mentions, get_published_projects_for_user
from projects.permissions import (SustainedRateThrottle, PostUserRateThrottle,
                                  GetUserRateThrottle, GetAnonRateThrottle,
                                  CustomUserRateThrottle)

from .models import Location, CreatorGroup, PhoneConfirmationHMAC, GroupInviteConfirmationHMAC
from .serializers import (CreatorListSerializer, CreatorMinimalSerializer,
                          CreatorSerializer, LocationSerializer,
                          VerifyPhoneSerializer, CustomRegisterSerializer,
                          ConfirmGroupInviteSerializer,
                          AddGroupMembersSerializer)
from .pagination import CreatorNumberPagination
from .utils import (perform_send_phone_confirmation,
                    perform_send_email_confirmation, process_avatar,
                    send_group_invite_notification, perform_creator_search, send_notification, activity_log)
from .permissions import IsOwner

Creator = get_user_model()


class AuthUserAPIView(RetrieveAPIView):
    """
    Fetch the profile of the authenticated user. 

    Requires authentication.
    Returns user profile object.
    """

    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=self.request.user.pk)
        return obj


class AccountStatusAPIView(APIView):
    """
    Check if user account is active or not.
    """

    permission_classes = [AllowAny]
    throttle_classes = [GetAnonRateThrottle, SustainedRateThrottle]

    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response({'detail': _('Your account is active.')},
                            status=status.HTTP_200_OK)
        else:
            return Response(
                {
                    'detail':
                    _("Account doesn't exist, is inactive or has been deleted."
                      )
                },
                status=status.HTTP_200_OK)

class UserProfileAPIView(RetrieveAPIView):
    """
    Fetch Profile of user with given username.
    Requires username of user.
    Returns user profile.

    Note that this schema returns the full user profile, but the api sometimes
    returns a minimal version of the user profile, omitting certain fields that
    are not neccessary or are sensitive.
    """

    queryset = Creator.objects.filter(is_active=True)
    lookup_field = "username"
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_serializer_class(self):
        if self.request and self.kwargs.get(
                "username") != self.request.user.username:
            return CreatorMinimalSerializer
        else:
            return CreatorSerializer


class RegisterCreatorAPIView(RegisterView):
    """
    Register a user.\n
    
    Returns basic user profile.\n
    request body format:\n
        {\n
            "username": "string",\n
            "email": "",\n
            "password1": "string",\n
            "password2": "string",\n
            "phone": "",\n
            "dateOfBirth": "2022-02-20",\n
            "location": "string",\n
            "bio": "",\n
            "subscribe": false\n
        }\n
    """

    serializer_class = CustomRegisterSerializer
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]

    def perform_create(self, serializer):
        creator = super().perform_create(serializer)
        process_avatar(None, creator)
        perform_send_phone_confirmation(self.request._request,
                                        creator,
                                        signup=True)
        return creator


class VerifyPhoneView(APIView):
    """
    Verify user's phone number.\n

    Returns {"details": "ok"}.\n
    request body format:\n
        {\n
            key: "dksledfjklskdjlskdjlsjkdlkslekdjsldk"\n
        }\n
    """

    permission_classes = [AllowAny]
    serializer_class = VerifyPhoneSerializer
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]
    allowed_methods = ('POST', 'OPTIONS', 'HEAD')

    def get_object(self, queryset=None):
        key = self.kwargs["key"]
        phoneconfirmation = PhoneConfirmationHMAC.from_key(key)
        if not phoneconfirmation:
            raise Http404()

        return phoneconfirmation

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.kwargs['key'] = serializer.validated_data['key']
        confirmation = self.get_object()
        confirmation.confirm(self.request)
        return Response({'detail': _('ok')}, status=status.HTTP_200_OK)


class CreatorSearchAPIView(ListAPIView):
    """
    Fulltext search of users.

    Requires search term.
    Returns paginated list of users that match the search term
    """

    serializer_class = CreatorMinimalSerializer
    permission_classes = [AllowAny]
    pagination_class = CreatorNumberPagination
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_queryset(self):
        return perform_creator_search(self.request.user,
                                      self.request.GET.get("q"))


class CreatorAutocompleteAPIView(ListAPIView):
    """
    Fulltext search of creators.

    Requires query string.
    Returns autocomplete matching creators.
    """

    serializer_class = CreatorListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_queryset(self):
        query_string = self.request.GET.get('q')
        creators = Creator.objects.annotate(
            similarity=TrigramSimilarity('username', query_string)).filter(
                similarity__gt=0.01).order_by('-similarity')[:20]
        return creators


class EditCreatorAPIView(UpdateAPIView):
    """
    Edit user profile.\n

    Requires authentication.\n
    Returns user profile\n
    request body format:\n
        {\n
            "username": "string",\n
            "email": "string",\n
            "phone": "string",\n
            "avatar": "string",\n
            "location": "string",\n
            "bio": "string"\n
        }\n
    """

    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    def perform_update(self, serializer):
        response = super().perform_update(serializer)
        creator = Creator.objects.filter(pk=self.request.user.pk)
        if creator.count() > 0:
            perform_send_phone_confirmation(self.request._request,
                                            creator[0],
                                            signup=True)

            perform_send_email_confirmation(self.request._request,
                                            creator[0],
                                            signup=True)
        process_avatar(self.request.user, creator[0])
        return response

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(pk=self.request.user.pk)
        self.check_object_permissions(self.request, obj)
        return obj


class DeleteCreatorAPIView(DestroyAPIView):
    """
    Delete user from database.\n

    Requires authentication.\n
    Returns {details: "ok"}\n
    """
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]
    lookup_field = "pk"

    def get_object(self):
        obj = self.queryset.get(pk=self.request.user.pk)
        self.check_object_permissions(self.request, obj)
        return obj


class UserProjectsAPIView(ListAPIView):
    """
    Get paginated list of all projects created by user with provided username.

    Requires username.
    Returns paginated list projects
    """

    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        limit = self.request.GET.get("limit")
        creator = Creator.objects.get(username=username)

        if limit:
            if hasattr(creator, "creatorgroup"):
                return creator.creatorgroup.get_projects(limit=limit)
            else:
                all = creator.projects.exclude(publish__type=PublishingRule.DRAFT)
                return get_published_projects_for_user(self.request.user, all)[:int(limit)]
        else:
            if hasattr(creator, "creatorgroup"):
                return creator.creatorgroup.get_projects()
            else:
                all = creator.projects.exclude(publish__type=PublishingRule.DRAFT)
                return get_published_projects_for_user(self.request.user, all)

class UserDraftsAPIView(ListAPIView):
    """
    Get paginated list of all drafts created by user with provided username.

    Requires username.
    Returns paginated list drafts
    """

    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        PublishingRule = apps.get_model('projects.PublishingRule')
        username = self.kwargs.get("username")
        limit = self.request.GET.get("limit")
        creator = Creator.objects.get(username=username)

        if self.request.user.is_anonymous or self.request.user.username != username:
            raise PermissionDenied(
            _("you are not permitted to get this project's drafts"))
            
        if limit:
            return creator.projects.filter(publish__type=PublishingRule.DRAFT).order_by(
                "-created_on")[:int(limit)]
        else:
            return creator.projects.filter(publish__type=PublishingRule.DRAFT).order_by("-created_on")


class UserFollowersAPIView(ListAPIView):
    """
    Fetch paginated user follower's list.

    Requires username of user.
    Returns list of users.
    """

    serializer_class = CreatorMinimalSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Creator.objects.get(username=username).followers.all()


class UserFollowingAPIView(ListAPIView):
    """
    Fetch paginated list of users being followed by the user with the provided username.

    Requires username of user.
    Returns list of users.
    """

    serializer_class = CreatorMinimalSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Creator.objects.get(username=username).following.all()


class ToggleFollowAPIView(RetrieveAPIView):
    """
    Remove/Add authenticated user from/to followers list of user with provided id.

    Requires authentication.
    Requires user id.
    Returns user profile of user with provided id.
    """

    serializer_class = CreatorMinimalSerializer
    queryset = Creator.objects.all()
    permission_classes = [IsAuthenticated]
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)

        if self.request.user in obj.followers.all():
            obj.followers.remove(self.request.user)
            obj.save()
        else:
            obj.followers.add(self.request.user)
            obj.save()

            send_notification([obj], self.request.user, [{}], Notification.Type.FOLLOW, f'/creators/{self.request.user.username}')
            activity_log(
                        [obj],
                        self.request.user,
                        [{}],
                        Activitylog.Type.FOLLOW,
                        f'/creators/{obj}'
                    )
        self.request.user.save()

        return obj


class ConfirmGroupInviteAPIView(APIView):
    """
    Confirms user's group invite.\n

    Requires verification key. Returns {"details": "ok"}.\n
    request body format:\n
        {\n
            key: "dksledfjklskdjlskdjlsjkdlkslekdjsldk"\n
        }\n
    """

    permission_classes = [AllowAny]
    allowed_methods = ('POST', 'OPTIONS', 'HEAD')
    serializer_class = ConfirmGroupInviteSerializer
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]

    def get_object(self, queryset=None):
        key = self.kwargs["key"]
        group_invite_confirmation = GroupInviteConfirmationHMAC.from_key(key)
        if not group_invite_confirmation:
            raise Http404()

        return group_invite_confirmation

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.kwargs['key'] = serializer.validated_data['key']
        confirmation = self.get_object()
        confirmation.confirm(self.request)
        return Response({'detail': _('ok')}, status=status.HTTP_200_OK)


class GroupMembersAPIView(ListAPIView):
    """
    Fetch paginated list of users in a group.

    Requires username of group. Returns list of users.
    """

    serializer_class = CreatorMinimalSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Creator.objects.get(
            username=username).creatorgroup.members.all()


class AddGroupMembersAPIView(GenericAPIView):
    """
    Add new members to group.

    Requires authentication.\n
    Requires body of group_members and/or csv string.\n
    Returns group profile.\n
    contenttype might need to be set to false.\n
    request body format:\n
        {\n
            group_members: ["username1","username2"],\n
            csv: "stringified csv"\n
        }\n
    """

    serializer_class = AddGroupMembersSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]
    allowed_methods = ('POST', 'OPTIONS', 'HEAD')

    def get_queryset(self):
        creator_group = CreatorGroup.objects.filter(
            creator=self.request.user).annotate(Count('members'))
        return creator_group

    def post(self, request):
        creator_group = self.get_queryset()
        if not creator_group:
            return Response(CreatorSerializer(request.user).data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group_members = serializer.validated_data.get('group_members')
        csvf = serializer.validated_data.get('csv')
        csvf = StringIO(csvf.read().decode())
        csvf = csv.reader(csvf, delimiter=',')
        csvf = list(csvf)
        flat_csv = []
        for index, arr in enumerate(csvf):
            if index != 0:
                flat_csv.append(arr[0])

        # remove leading and trailing white spaces from username strings
        group_members = list(map(lambda x: x.strip(), group_members))

        group_members = [*group_members, *flat_csv]

        uploaded = Creator.objects.filter(username__in=group_members)
        all_members = creator_group[0].members.all()
        uploaded_count = uploaded.count()

        if creator_group[0].members__count > uploaded_count:
            new_members = all_members.difference(uploaded)
        else:
            new_members = uploaded.difference(all_members)

        if new_members.count() > 0:
            send_group_invite_notification(creator_group[0], new_members)

        return Response(CreatorSerializer(request.user).data)


class RemoveGroupMemberAPIView(RetrieveAPIView):
    """
    Remove user from group.

    Requires authentication.
    id of user to be removed from group. 
    Returns profile of user removed from group.
    """

    serializer_class = CreatorMinimalSerializer
    queryset = Creator.objects.all()
    permission_classes = [IsAuthenticated]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        creatorgroup = self.request.user.creatorgroup

        if obj in creatorgroup.members.all(
        ) and obj.pk != self.request.user.pk:
            creatorgroup.members.remove(obj)
            creatorgroup.save()

        return obj


class LocationListAPIView(ListAPIView):
    """
    Fetch all countries from the database.

    Takes no input.
    Returns list of all countries.
    """

    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]


class AddCommentAPIView(CreateAPIView):
    """
    Comment on user's profile.

    Requires authentication.\n
    Requires user id.\n
    Returns user profile.\n
    request body format:\n
        {\n
            text: "comment text",\n
            parent_id: "id of parent comment or None"\n
        }\n
    """

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]

    def get_queryset(self):
        return Creator.objects.all()

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(self.get_queryset(), pk=pk)

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

                parent_comment.add_child(profile=self.get_object(),
                                         creator=self.request.user,
                                         text=text,
                                         publish=publishing_rule)
            else:
                Comment.add_root(profile=self.get_object(),
                                 creator=self.request.user,
                                 text=text,
                                 publish=publishing_rule)

        result = self.get_object()
        if result:
            detect_mentions({
                "text": text,
                "profile_username": result.username,
                "creator": request.user.username
            })

        return Response(CreatorMinimalSerializer(result,
                                                 context={
                                                     'request': request
                                                 }).data,
                        status=status.HTTP_201_CREATED)
