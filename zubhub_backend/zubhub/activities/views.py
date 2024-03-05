from rest_framework.generics import (
    ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView)
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsStaffOrModeratorOrEducator, IsOwner, IsStaffOrModerator
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from django.db import transaction
from django.contrib.auth.models import AnonymousUser
from .utils import generate_pdf, generate_qr_code, download_file
from django.conf import settings


class ActivityListAPIView(ListAPIView):

    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        all = Activity.objects.all()
        return all


class UserActivitiesAPIView(ListAPIView):
    """
    Fetch list of users activities.
    Returns list of activities.
    """

    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return self.request.user.activities_created.all()

class ActivityDetailsAPIView(RetrieveAPIView):
    """
    Fetch Activity details.

    Rquires activity id.
    Returns activity details.
    """

    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(queryset, pk=pk)

        if obj:
            with transaction.atomic():
                if isinstance(self.request.user, AnonymousUser):
                    obj.views_count += 1
                    obj.save()
                else:
                    if not self.request.user in obj.views.all():
                        obj.views.add(self.request.user)
                        obj.views_count += 1
                        obj.save()
            return obj

        else:
            raise Exception()

class PublishedActivitiesAPIView(ListAPIView):
    """
    Fetch list of published activities by any user.
    Returns list of published activities.
    """

    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        limit = self.request.query_params.get('limit', 10000)

        try:
            limit = int(limit)
        except ValueError:
            limit = 10

        return Activity.objects.filter(publish= True)[:limit]

class UnPublishedActivitiesAPIView(ListAPIView):
    """
    Fetch list of unpublished activities by authenticated staff member.

    Requires authentication.
    Returns list of unpublished activities.
    """

    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsStaffOrModerator]

    def get_queryset(self):
        return Activity.objects.filter(publish= False)

class ActivityCreateAPIView(CreateAPIView):
    """
    Create new Activity.\n
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsStaffOrModeratorOrEducator]

class ActivityUpdateAPIView(UpdateAPIView):
    """
    Update activity.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsOwner]

class ActivityDeleteAPIView(DestroyAPIView):
    """
    Delete a activity and related objects from database.

    Requires authentication.
    Requires activity id.
    Returns {details: "ok"}
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def delete(self, request, *args, **kwargs):
        activity = self.get_object()
        if activity:
            result = self.destroy(request, *args, **kwargs)
            request.user.save()
            return result


class ToggleSaveAPIView(RetrieveAPIView):
    """
    Add/Remove an activity from authenticated user's bookmark.

    Requires authentication.
    Requires activity id.
    Returns activity details.
    """

    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

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


class togglePublishActivityAPIView(RetrieveAPIView):
    """
    publish an activity.
    Requires activity id.
    Returns updated activity.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsStaffOrModerator]


    def get_object(self):

        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        obj.publish = not obj.publish
        obj.save()
        return obj



class DownloadActivityPDF(APIView):
    """
    Download an activities.
    Requires activities id.
    Returns activities file.
    """
    queryset = Activity.objects.all()
    template_path = 'activities/activity_download.html'


    def get_queryset(self):
        return self.queryset

    def get_object(self):
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)
        return obj

    def get(self, request, *args, **kwargs):
        activity = self.get_object()
        activity_images = ActivityImage.objects.filter(activity=activity)
        activity_steps = ActivityMakingStep.objects.filter(activity=activity)
        if settings.ENVIRONMENT == 'production':
            qr_code = generate_qr_code(
                link=f"https://zubhub.unstructured.studio/activities/{activity.id}"
            )
        else:
            qr_code = generate_qr_code(
                link=f"{settings.DEFAULT_BACKEND_PROTOCOL}//{settings.DEFAULT_BACKEND_DOMAIN}/activities/{activity.id}"
            )
        context = {
            'activity': activity,
            'activity_id': activity.id,
            'activity_images': activity_images,
            'activity_steps': activity_steps,
            'activity_steps_images': [step.image.all() for step in activity_steps],
            'activity_category': [category.name for category in activity.category.all()],
            'creators': [creator for creator in activity.creators.all()],
            'qr_code': qr_code
        }
        return generate_pdf(
            template_path=self.template_path,
            context=context
        )
