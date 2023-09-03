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
from django.db import transaction
from django.core.exceptions import PermissionDenied
from django.contrib.auth.models import AnonymousUser



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
