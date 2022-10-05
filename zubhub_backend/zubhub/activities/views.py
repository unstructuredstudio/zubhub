from django.shortcuts import render
from django.utils.translation import ugettext_lazy as _
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import (
    ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView)
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .permissions import IsStaffOrModeratorOrEducator, IsOwner, IsStaffOrModerator
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *


class ActivityListAPIView(ListAPIView):

    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        all = Activity.objects.all()
        return all


class ActivityCreateAPIView(CreateAPIView):
    """
    Create new Activity.\n
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated, IsStaffOrModeratorOrEducator]
    #throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]


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
        print(request)
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
        print('from_activity_toggle_save', self)
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
        print('from_activity_toggle_publish', self)
        pk = self.kwargs.get("pk")
        obj = get_object_or_404(self.get_queryset(), pk=pk)  
        obj.publish = not obj.publish
        obj.save()
        return obj
