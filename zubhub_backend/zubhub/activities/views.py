from django.shortcuts import render
from django.utils.translation import ugettext_lazy as _
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import (ListAPIView, CreateAPIView, RetrieveAPIView)
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
    """
    Fetch paginated list of projects.

    Returns paginated list of projects
    """
    # print('backend')
    # def get_queryset(self):
        
    #     return ({"message":"hello from backend"})
    
    serializer_class = ActivitySerializer
    permission_classes = [AllowAny]
    # throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
    def get_queryset(self):
        all = Activity.objects.all()
        for activity in all:
            print(activity.title, 'listallactivities')
        return all
    # def get_object(self):
    #     queryset = self.get_queryset()
    #     pk = self.kwargs.get("pk")
    #     obj = get_object_or_404(queryset, pk=pk)
    #     """ check if user is permitted to view this project """
    #     if can_view(self.request.user, obj):
    #         with transaction.atomic():
    #             if isinstance(self.request.user, AnonymousUser):
    #                 obj.views_count += 1
    #                 obj.save()
    #             else:
    #                 if not self.request.user in obj.views.all():
    #                     obj.views.add(self.request.user)
    #                     obj.views_count += 1
    #                     obj.save()

    #         return obj
    #     else:
    #         raise PermissionDenied(
    #             _('you are not permitted to view this project'))
    

class ActivityCreateAPIView(CreateAPIView):
    """
    Create new Project.\n

    Requires authentication. Returns project details.\n
    Request body format:\n
        {\n
            "title": "string",\n
            "description": "string",\n
            "images": [\n
                {\n
                "image_url": "string",\n
                "public_id": "string"\n
                }\n
            ],\n
            "video": "string",\n
            "materials_used": "string",\n
            "category": "string",\n
            "publish": {"type": 4, "visible_to": []}\n
        }\n
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    #permission_classes = [IsAuthenticated]
    #throttle_classes = [PostUserRateThrottle, SustainedRateThrottle]
    