import csv
from io import StringIO
from django.utils.translation import ugettext_lazy as _
from rest_framework import status
from django.http import Http404
from django.contrib.auth import get_user_model
from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.generics import (UpdateAPIView, RetrieveAPIView,
                                     ListAPIView, DestroyAPIView, CreateAPIView, GenericAPIView)
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_auth.registration.views import RegisterView
from projects.serializers import ProjectListSerializer
from projects.pagination import ProjectNumberPagination
from .serializers import (CreatorSerializer, LocationSerializer, VerifyPhoneSerializer,
                          CustomRegisterSerializer, ConfirmGroupInviteSerializer, AddGroupMembersSerializer)
from projects.serializers import CommentSerializer
from projects.models import Comment
from .permissions import IsOwner
from .models import Location
from .pagination import CreatorNumberPagination
from .utils import perform_send_phone_confirmation, perform_send_email_confirmation, process_avatar, send_group_invite_notification
from projects.utils import detect_mentions

from .models import CreatorGroup, PhoneConfirmationHMAC, GroupInviteConfirmationHMAC


Creator = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_user_api_view(request):
    return Response(CreatorSerializer(request.user).data)


class UserProfileAPIView(RetrieveAPIView):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    lookup_field = "username"
    permission_classes = [AllowAny]


class RegisterCreatorAPIView(RegisterView):
    serializer_class = CustomRegisterSerializer

    def perform_create(self, serializer):
        creator = super().perform_create(serializer)
        process_avatar(None, creator)
        perform_send_phone_confirmation(
            self.request._request, creator, signup=True)
        return creator


class VerifyPhoneView(APIView):
    permission_classes = (AllowAny,)
    allowed_methods = ('POST', 'OPTIONS', 'HEAD')

    def get_serializer(self, *args, **kwargs):
        return VerifyPhoneSerializer(*args, **kwargs)

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
    serializer_class = CreatorSerializer
    permission_classes = [AllowAny]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        query_string = self.request.GET.get("q")
        query = SearchQuery(query_string)
        rank = SearchRank(F('search_vector'), query)
        return Creator.objects.annotate(rank=rank).filter(search_vector=query, is_active=True).order_by('-rank')


class EditCreatorAPIView(UpdateAPIView):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def perform_update(self, serializer):
        response = super().perform_update(serializer)
        creator = Creator.objects.filter(pk=self.request.user.pk)
        if len(creator) > 0:
            perform_send_phone_confirmation(
                self.request._request, creator[0], signup=True)

            perform_send_email_confirmation(
                self.request._request, creator[0], signup=True)
        process_avatar(self.request.user, creator[0])
        return response

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(pk=self.request.user.pk)
        self.check_object_permissions(self.request, obj)
        return obj


class DeleteCreatorAPIView(DestroyAPIView):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = "pk"

    def get_object(self):
        obj = self.queryset.get(pk=self.request.user.pk)
        self.check_object_permissions(self.request, obj)
        return obj


class UserProjectsAPIView(ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        limit = self.request.GET.get("limit")
        creator = Creator.objects.get(username=username)

        if limit:
            if hasattr(creator, "creatorgroup"):
                return creator.creatorgroup.get_projects(limit=limit)
            else:
                return creator.projects.all().order_by("-created_on")[:int(limit)]
        else:
            if hasattr(creator, "creatorgroup"):
                return creator.creatorgroup.get_projects()
            else:
                return creator.projects.all().order_by("-created_on")


class UserFollowersAPIView(ListAPIView):
    serializer_class = CreatorSerializer
    permission_classes = [AllowAny]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Creator.objects.get(username=username).followers.all()


class UserFollowingAPIView(ListAPIView):
    serializer_class = CreatorSerializer
    permission_classes = [AllowAny]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Creator.objects.get(username=username).following.all()


class ToggleFollowAPIView(RetrieveAPIView):
    serializer_class = CreatorSerializer
    queryset = Creator.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)

        if self.request.user in obj.followers.all():
            obj.followers.remove(self.request.user)
            obj.save()
        else:
            obj.followers.add(self.request.user)
            obj.save()
        self.request.user.save()

        return obj


class ConfirmGroupInviteAPIView(APIView):
    permission_classes = (AllowAny,)
    allowed_methods = ('POST', 'OPTIONS', 'HEAD')

    def get_serializer(self, *args, **kwargs):
        return ConfirmGroupInviteSerializer(*args, **kwargs)

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
    serializer_class = CreatorSerializer
    permission_classes = [AllowAny]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Creator.objects.get(username=username).creatorgroup.members.all()


class AddGroupMembersAPIView(GenericAPIView):
    serializer_class = AddGroupMembersSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
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
    serializer_class = CreatorSerializer
    queryset = Creator.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        creatorgroup = self.request.user.creatorgroup

        if obj in creatorgroup.members.all() and obj.pk != self.request.user.pk:
            creatorgroup.members.remove(obj)
            creatorgroup.save()

        return obj


class LocationListAPIView(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class AddCommentAPIView(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Creator.objects.all()

    def get_object(self):
        pk = self.kwargs.get("pk")
        return get_object_or_404(self.get_queryset(), pk=pk)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        parent_id = self.request.data.get("parent_id", None)
        text = serializer.validated_data.get("text", None)

        if parent_id:

            try:
                parent_comment = Comment.objects.get(id=parent_id)
            except Comment.DoesNotExist:
                raise Http404(_("parent comment does not exist"))

            parent_comment.add_child(
                profile=self.get_object(), creator=self.request.user, text=text)
        else:
            Comment.add_root(profile=self.get_object(),
                             creator=self.request.user, text=text)

        result = self.get_object()
        if result:
            detect_mentions(
                {"text": text, "profile_username": result.username, "creator": request.user.username})

        return Response(CreatorSerializer(result).data, status=status.HTTP_201_CREATED)
