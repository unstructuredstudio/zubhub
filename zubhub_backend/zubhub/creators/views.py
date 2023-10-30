import csv
from io import StringIO
from django.forms import ValidationError
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
from rest_framework import serializers
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
from projects.models import Comment, PublishingRule, Project
from projects.serializers import ProjectListSerializer
from projects.pagination import ProjectNumberPagination
from projects.utils import detect_mentions, get_published_projects_for_user
from projects.permissions import (SustainedRateThrottle, PostUserRateThrottle,
                                  GetUserRateThrottle, GetAnonRateThrottle,
                                  CustomUserRateThrottle)
# from ..projects.models import Project

from .models import Location, CreatorGroup, PhoneConfirmationHMAC, GroupInviteConfirmationHMAC, CreatorGroupMembership
from .serializers import (CreatorGroupSerializer, CreatorListSerializer, CreatorMinimalSerializer, CreatorGroupWithMembershipsSerializer,
                          CreatorSerializer, LocationSerializer,
                          VerifyPhoneSerializer, CustomRegisterSerializer,
                          ConfirmGroupInviteSerializer, CreatorGroupMinimalSerializer,
                          AddGroupMembersSerializer, CreatorGroupMembershipSerializer, TeamProfileSerializer)
from .pagination import CreatorNumberPagination, CreatorGroupNumberPagination
from .utils import (perform_send_phone_confirmation,
                    perform_send_email_confirmation, process_avatar, process_group_avatar,
                    send_group_invite_notification, perform_creator_search, send_notification, activity_log)
from .permissions import (IsOwner, IsGroupAdmin)

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
                status=status.HTTP_404_NOT_FOUND)

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
        
class UserProfileIDAPIView(RetrieveAPIView):
    """
    Fetch Profile of user with given userid.
    Requires username of user.
    Returns user profile.

    Note that this schema returns the full user profile, but the api sometimes
    returns a minimal version of the user profile, omitting certain fields that
    are not neccessary or are sensitive.
    """

    queryset = Creator.objects.filter(is_active=True)
    lookup_field = "id"
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_serializer_class(self):
        if self.request and self.kwargs.get(
                "id") != self.request.user.id:
            return CreatorMinimalSerializer
        else:
            return CreatorSerializer
        

class TeamProfileAPIView(RetrieveAPIView):
    """
    Fetch Profile of group with given groupname.
    Requires username of user.
    Returns user profile.

    Note that this schema returns the full team profile, but the api sometimes
    returns a minimal version of the team profile, omitting certain fields that
    are not neccessary or are sensitive.
    """

    # queryset = CreatorGroup.objects.filter(is_active=True)
    serializer_class = TeamProfileSerializer
    lookup_field = "groupname"
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get(self, request, *args, **kwargs):
        groupname = self.kwargs.get("groupname")
        group = get_object_or_404(CreatorGroup, groupname=groupname)
        response_data = {
            "groupname": group.groupname,
            "description": group.description,
            "projects": group.projects,
            "members": [
                {"member": membership.member.username, "role": membership.role}
                for membership in group.memberships.all()
            ],
            "created_on": group.created_on,
            "projects_count": group.projects_count,
            "avatar":group.avatar,
            "followers_count":group.followers_count
        }
        return Response(response_data)


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
        project_to_omit = self.request.GET.get('project_to_omit')
        creator = Creator.objects.get(username=username)

        if limit:
            if hasattr(creator, "creatorgroup"):
                return creator.creatorgroup.get_projects(limit=limit)
            else:
                all = creator.projects.exclude(publish__type=PublishingRule.DRAFT)
                if(project_to_omit):
                    all = all.exclude(id=project_to_omit)
                return get_published_projects_for_user(self.request.user, all)[:int(limit)]
        else:
            if hasattr(creator, "creatorgroup"):
                return creator.creatorgroup.get_projects()
            else:
                all = creator.projects.exclude(publish__type=PublishingRule.DRAFT)
                if(project_to_omit):
                    all = all.exclude(id=project_to_omit)
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
    

class ToggleFollowGroupAPIView(RetrieveAPIView):
    """
    Remove/Add authenticated user from/to followers list of user with provided id.

    Requires authentication.
    Requires user id.
    Returns user profile of user with provided id.
    """

    serializer_class = CreatorGroupMinimalSerializer
    queryset = CreatorGroup.objects.all()
    permission_classes = [IsAuthenticated]
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]

    # Set the lookup field to 'groupname' to match your custom URL pattern
    lookup_field = 'groupname'

    def get_object(self):
        groupname = self.kwargs.get("groupname")
        obj = get_object_or_404(CreatorGroup, groupname=groupname)
        username = self.kwargs.get("username")
        user = get_object_or_404(Creator, username=username)
        
        if user in obj.followers.all():
            obj.followers.remove(user)
        else:
            obj.followers.add(user)
            
            # Pass relevant data as the third argument to the send_notification function
            # send_notification([obj], user, [{}], Notification.Type.FOLLOW, f'/creators/{user.username}')
            
            # Pass relevant data as the third argument to the activity_log function
            # activity_log(
            #     [obj],
            #     user,
            #     [{}],
            #     Activitylog.Type.FOLLOW,
            #     f'/creators/{obj.groupname}'  # Use groupname, not obj
            # )

        obj.save()

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


class UserGroupsAPIView(ListAPIView):
    """
    Get paginated list of all groups associated with the user with provided username.

    Requires username.
    Returns paginated list of groups.
    """

    serializer_class = CreatorGroupSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        print("Username:", username)
        creator = get_object_or_404(Creator, username=username)
        creator_groups = CreatorGroup.objects.filter(memberships__member=creator).prefetch_related('members')
        return creator_groups


class GroupMembersAPIView(RetrieveAPIView):
    """
    Fetch the creator group with its memberships.

    Requires groupname of the group. Returns the creator group object with memberships.
    """

    serializer_class = CreatorGroupWithMembershipsSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def retrieve(self, request, *args, **kwargs):
        groupname = self.kwargs.get("groupname")
        group = get_object_or_404(CreatorGroup, groupname=groupname)
        serializer = self.get_serializer(group)
        return Response(serializer.data)
    

class AddGroupMembersAPIView(GenericAPIView):
    """
    Add new members to group.

    Requires authentication.\n
    Requires body of group_members.\n
    Returns group profile.\n
    contenttype might need to be set to false.\n
    request body format:\n
        {\n
            group_members: [{"username": "username1", "role": "member/admin"}, ...],
        }\n
    """

    serializer_class = AddGroupMembersSerializer
    permission_classes = [IsGroupAdmin]
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]
    allowed_methods = ('POST', 'OPTIONS', 'HEAD')

    def get_group(self, groupname):
        groupname = self.kwargs.get("groupname")
        return get_object_or_404(CreatorGroup, groupname=groupname)

    def post(self, request, groupname):
        groupname = self.kwargs.get("groupname")
        group = self.get_group(groupname)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group_members = serializer.validated_data.get('group_members')

        for member_data in group_members:
            member = member_data['member']
            role = member_data['role']

            # Get the Creator instance for the member
            member_obj = get_object_or_404(Creator, username=member)

            # Check if the member already exists in the group, if not, add them
            membership, created = CreatorGroupMembership.objects.get_or_create(
                group=group, member=member_obj, defaults={'role': role}
            )

            if not created:
                # If the membership already existed, update the role
                membership.role = role
                membership.save()

        return Response({"detail": "User added"}, status=status.HTTP_200_OK)
    

class RemoveGroupMemberAPIView(RetrieveAPIView):
    """
    Remove user from group.

    Requires authentication.
    id of user to be removed from group. 
    Returns profile of user removed from group.
    """

    serializer_class = CreatorMinimalSerializer
    queryset = Creator.objects.all()
    permission_classes = [IsGroupAdmin]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def retrieve(self, request, *args, **kwargs):
        groupname = self.kwargs.get("groupname")
        username = self.kwargs.get("username")
        group = get_object_or_404(CreatorGroup, groupname=groupname)
        obj = get_object_or_404(self.get_queryset(), username=username)

        creatorgroup = group

        # Check if the authenticated user is an admin of the specified group
        if creatorgroup.groupname == groupname:
            membership = group.memberships.filter(member=obj).first()
            if membership:
                membership.delete()
                return Response({"detail": "User deleted"}, status=status.HTTP_200_OK)

        # Return an error response if the user was not removed or if the user is not an admin
        return Response({"detail": "User was not removed from the group or you do not have permission to perform this action."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class DeleteCreatorGroupAPIView(DestroyAPIView):
    """
    Delete a CreatorGroup from the database.\n

    Requires authentication and ownership of the group.\n
    Returns {"details": "ok"}\n
    """
    queryset = CreatorGroup.objects.all()
    serializer_class = CreatorGroupSerializer
    permission_classes = [IsGroupAdmin]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]
    lookup_field = "groupname"

    def delete(self, request, *args, **kwargs):
        groupname = self.kwargs.get("groupname")
        instance = get_object_or_404(CreatorGroup, groupname=groupname)
        self.perform_destroy(instance)
        return Response({"detail": "Group deleted successfully."}, status=status.HTTP_200_OK)
 

class CreatorGroupFollowersAPIView(ListAPIView):
    """
    Fetch paginated creator group follower's list.

    Requires group creator's username and group_id.
    Returns list of users.
    """

    serializer_class = CreatorMinimalSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        groupname = self.kwargs.get("groupname")
        creator_group = CreatorGroup.objects.get(groupname=groupname)
        return creator_group.followers.all()

class CreatorGroupListAPIView(ListAPIView):
    """
    Fetch paginated list of creator groups.

    Returns paginated list of creator groups
    """
    
    serializer_class = CreatorGroupSerializer
    permission_classes = [AllowAny]
    pagination_class = CreatorGroupNumberPagination
    
    def get_queryset(self):
        return CreatorGroup.objects.all()
    
class CreateAndAddMembersToGroupAPIView(GenericAPIView):
    """
    Create a new CreatorGroup and add members to the group.\n
    Requires authentication.\n
    Returns basic group profile.\n
    request body format:\n
        {\n
            "description": "string",
            "group_members": [
                {"member": "username1", "role": "admin"},
                {"member": "username2", "role": "member"},
                ...
            ],
            "projects": ["id1", "id2"],
            "csv": "stringified csv"\n
        }\n
    """

    serializer_class = AddGroupMembersSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get the authenticated user (the creator)
        creator = request.user

        # Get the description, group members, and CSV from the request data
        description = request.data.get('description')
        group_members_data = request.data.get('group_members', [])
        projects = request.data.get('projects')
        csv_data = request.data.get('csv')

        # Create the CreatorGroup object using groupname as the primary key
        groupname = request.data.get('groupname')
        group = CreatorGroup.objects.create(groupname=groupname, description=description)
        
        # Set the project IDs to the CreatorGroup model's 'projects' field
        group.projects = projects
        group.save()

        for project_data in projects:
            project_id = project_data['id']
            project = Project.objects.get(id=project_id)
            project.group = group
            project.save()


        # Add members to the group with roles
        group_members = []
        for member_data in group_members_data:
            member_username = member_data.get('member')
            role = member_data.get('role', 'member')  # Default role is 'member' if not provided

            member = Creator.objects.get(username=member_username)
            group_members.append({'member': member, 'role': role})

        group_members.extend(self.process_csv_data(csv_data))
        for member_data in group_members:
            member = member_data['member']
            role = member_data['role']
            group.memberships.create(member=member, role=role)

        process_group_avatar(None, group)

        # Construct a response data dictionary with basic group information and projects
        response_data = {
            "groupname": group.groupname,
            "description": group.description,
            "projects": group.projects,
            "members": [
                {"member": membership.member.username, "role": membership.role}
                for membership in group.memberships.all()
            ],
            "created_on": group.created_on,
            "projects_count": group.projects_count,
            "tags":[ tags for tags in group.tags.all()],
            "badges": [ badges for badges in group.badges.all()]
        }
        return Response(response_data)

    def process_csv_data(self, csv_data):
        members = []
        if csv_data:
            csv_data = csv_data.read().decode()
            csv_list = csv_data.split(',')
            members = [{'member': username.strip(), 'role': 'member'} for username in csv_list]
        return members


class EditCreatorGroupAPIView(UpdateAPIView):
    """
    Edit CreatorGroup details and update member roles.\n
    Requires authentication and ownership of the group.\n
    Returns updated CreatorGroup details.\n
    """

    queryset = CreatorGroup.objects.all()
    serializer_class = CreatorGroupSerializer
    permission_classes = [IsGroupAdmin]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    lookup_field = 'groupname'

    def post(self, request, groupname):
        # Get the existing CreatorGroup instance
        creator_group = self.get_object()


        # Manually update group description and groupname
        groupname = request.data.get('groupname')
        description = request.data.get('description')

        # Validate the data
        if not groupname:
            raise ValidationError("'groupname' is required.")

        # Update the fields and save the changes
        if groupname is not None:
            creator_group.groupname = groupname
        if description is not None:
            creator_group.description = description

        # Get the list of project IDs to add and remove
        add_projects = request.data.get('add_projects')
        remove_projects = request.data.get('remove_projects')

        # Update projects if provided
        if add_projects:
            for project_data in add_projects:
                project_id = project_data.get('id')
                if project_id:
                    try:
                        project = Project.objects.get(id=project_id)
                        project.group = creator_group
                        project.save()
                    except Project.DoesNotExist:
                        raise Http404("Project doesn't exist")

        if remove_projects:
            for project_data in remove_projects:
                project_id = project_data.get('id')
                if project_id:
                    try:
                        project = Project.objects.get(id=project_id)
                        project.group = None
                        project.save()
                    except Project.DoesNotExist:
                        raise Http404("Project doesn't exist") 
        
        creator_group.save()

        # Serialize and return the updated group data
        serializer = self.get_serializer(creator_group)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

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
