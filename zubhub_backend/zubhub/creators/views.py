from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import UpdateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from .serializers import CreatorSerializer, LocationSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .permissions import IsOwner
from .models import Location
from projects.serializers import ProjectListSerializer
from projects.pagination import ProjectNumberPagination
from .pagination import CreatorNumberPagination


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


class EditCreatorAPIView(UpdateAPIView):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(pk=self.request.user.pk)
        self.check_object_permissions(self.request, obj)
        return obj


class UserProjectsAPIView(ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [AllowAny]
    pagination_class = ProjectNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        limit = self.request.GET.get("limit")
        if limit:
            return Creator.objects.get(username=username).projects.all().order_by("-created_on")[:int(limit)]
        else:
            return Creator.objects.get(username=username).projects.all().order_by("-created_on")


class UserFollowersAPIView(ListAPIView):
    serializer_class = CreatorSerializer
    permission_classes = [AllowAny]
    pagination_class = CreatorNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Creator.objects.get(username=username).followers.all()


class ToggleFollowAPIView(RetrieveAPIView):
    serializer_class = CreatorSerializer
    queryset = Creator.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    # def get_queryset(self):
    #     return Project.objects.filter(published=True)

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)

        if self.request.user in obj.followers.all():
            obj.followers.remove(self.request.user)
            obj.save()
        else:
            obj.followers.add(self.request.user)
            obj.save()

        return obj


class LocationListAPIView(ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]
