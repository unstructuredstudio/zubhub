from django.shortcuts import render
from django.utils.translation import ugettext_lazy as _
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import (ListAPIView, CreateAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView)
from rest_framework.permissions import AllowAny
from .models import *
from .serializers import *

@api_view(['GET'])
def index(request):
    print(type(request),'request_activities')
    response = Response({"message":"hello from backend"})
    print(type(response),'response_activities')
    return response


class ActivityListAPIView(ListAPIView):
 
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        all = Activity.objects.all()
        for activity in all:
            print(activity.title, 'listallactivities')
        return all
    
    

class ActivityCreateAPIView(CreateAPIView):
    """
    Create new Activity.\n
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    #permission_classes = [IsAuthenticated]
    #throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]


class ActivityUpdateAPIView(UpdateAPIView):
    """
    Update activity.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
   
    
class ActivityDeleteAPIView(DestroyAPIView):
    """
    Delete a activity and related objects from database.

    Requires authentication.
    Requires activity id.
    Returns {details: "ok"}
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
   # permission_classes = [IsAuthenticated, IsOwner]

    def delete(self, request, *args, **kwargs):
        print(request)
        activity = self.get_object()
        if activity:
            result = self.destroy(request, *args, **kwargs)
            request.user.save()    
            return result        
