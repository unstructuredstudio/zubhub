from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.contrib.auth.models import AnonymousUser
from django.db.models import F
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer, CommentSerializer
from .pagination import ProjectNumberPagination
from creators.permissions import IsOwner


class ProjectCreateAPIView(CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class ProjectListAPIView(ListAPIView):
    queryset = Project.objects.filter(published=True).order_by("-created_on")
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    pagination_class = ProjectNumberPagination


class ProjectDetailsAPIView(RetrieveAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

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
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        return self.request.user.saved_for_future.all().order_by("-created_on")


class ToggleLikeAPIView(RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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
    permission_classes = [IsAuthenticatedOrReadOnly]

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

        serializer.save(creator=self.request.user,
                        project=self.get_object())

        result = self.get_object()
        return Response(ProjectSerializer(result).data, status=status.HTTP_201_CREATED)
