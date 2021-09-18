from django.shortcuts import get_object_or_404
from django.http import Http404
from django.utils.translation import ugettext_lazy as _
from rest_framework.response import Response
from django.contrib.auth.models import AnonymousUser
from django.contrib.postgres.search import SearchQuery, SearchRank
from django.db.models import F
from rest_framework import status
from rest_framework.generics import (UpdateAPIView, CreateAPIView,
                                     ListAPIView, RetrieveAPIView, DestroyAPIView)
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from projects.permissions import (IsOwner, IsStaffOrModerator, SustainedRateThrottle,
                                  PostUserRateThrottle, GetUserRateThrottle, CustomUserRateThrottle)
from .models import Project, Comment, StaffPick, Category, Tag
from .utils import project_changed, detect_mentions, perform_project_search
from .tasks import delete_video_from_cloudinary
from creators.utils import activity_notification
from .serializers import (ProjectSerializer, ProjectListSerializer,
                          CommentSerializer, CategorySerializer, TagSerializer, StaffPickSerializer)
from .pagination import ProjectNumberPagination


class ProjectCreateAPIView(CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
        self.request.user.save()


class ProjectUpdateAPIView(UpdateAPIView):
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


class ProjectDeleteAPIView(DestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    def delete(self, request, *args, **kwargs):
        project = self.get_object()
        if project:
            if project.video.find("cloudinary.com") > -1:
                delete_video_from_cloudinary.delay(project.video)
            result = self.destroy(request, *args, **kwargs)
            request.user.save()
            return result


class ProjectListAPIView(ListAPIView):
    queryset = Project.objects.filter(published=True).order_by("-created_on")
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    pagination_class = ProjectNumberPagination


class ProjectTagSearchAPIView(ListAPIView):
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]

    def get_queryset(self):
        query_string = self.request.GET.get('q')
        query = SearchQuery(query_string)
        rank = SearchRank(F('search_vector'), query)
        return Tag.objects.annotate(rank=rank).filter(search_vector=query).order_by('-rank')


class ProjectSearchAPIView(ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        return perform_project_search(self.request.GET.get("q"))


class ProjectDetailsAPIView(RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]

    def get_queryset(self):
        return Project.objects.filter(published=True)

    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(queryset, pk=pk)

        if isinstance(self.request.user, AnonymousUser):
            obj.views_count += 1
            obj.save()
        else:
            if not self.request.user in obj.views.all():
                obj.views.add(self.request.user)
                obj.views_count += 1
                obj.save()

        return obj


class SavedProjectsAPIView(ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        return self.request.user.saved_for_future.all().order_by("-created_on")


class ToggleLikeAPIView(RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]

    def get_queryset(self):
        return Project.objects.filter(published=True)

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)

        if self.request.user in obj.likes.all():
            obj.likes.remove(self.request.user)
            obj.save()
        else:
            obj.likes.add(self.request.user)
            obj.save()

        return obj


class ToggleSaveAPIView(RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]

    def get_queryset(self):
        return Project.objects.filter(published=True)

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)

        if self.request.user in obj.saved_by.all():
            obj.saved_by.remove(self.request.user)
            obj.save()
        else:
            obj.saved_by.add(self.request.user)
            obj.save()

        return obj


class AddCommentAPIView(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    throttle_classes = [CustomUserRateThrottle,  SustainedRateThrottle]

    def get_queryset(self):
        return Project.objects.filter(published=True)

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
                project=self.get_object(), creator=self.request.user, text=text)
        else:
            Comment.add_root(project=self.get_object(),
                             creator=self.request.user, text=text)

        result = self.get_object()

        if result:
            detect_mentions(
                {"text": text, "project_id": result.pk, "creator": request.user.username})

        return Response(ProjectSerializer(result).data, status=status.HTTP_201_CREATED)


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]


class StaffPickListAPIView(ListAPIView):
    serializer_class = StaffPickSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]

    def get_queryset(self):
        return StaffPick.objects.filter(is_active=True)


class StaffPickDetailsAPIView(RetrieveAPIView):
    queryset = StaffPick.objects.filter(is_active=True)
    serializer_class = StaffPickSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle,  SustainedRateThrottle]

    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(queryset, pk=pk)

        return obj


class UnpublishCommentAPIView(UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsStaffOrModerator]
    throttle_classes = [CustomUserRateThrottle,  SustainedRateThrottle]

    def perform_update(self, serializer):
        comment = serializer.save(published=False)
        if comment and comment.project:
            comment.project.save()
        return comment


class DeleteCommentAPIView(DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsStaffOrModerator]
    throttle_classes = [CustomUserRateThrottle,  SustainedRateThrottle]

    def delete(self, request, *args, **kwargs):
        project = self.get_object().project
        result = self.destroy(request, *args, **kwargs)

        if project:
            project.save()

        return result
