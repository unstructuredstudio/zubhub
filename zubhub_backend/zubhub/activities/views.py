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
    Create new Activity.\n

    Requires authentication. Returns activity details.\n
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


class ActivityUpdateAPIView(UpdateAPIView):
    """
    Update activity.

    Requires authentication.\n
    Requires project id.\n
    Returns project details.\n
    request body format:\n
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
    # permission_classes = [IsAuthenticated, IsOwner]
    # throttle_classes = [CustomUserRateThrottle, SustainedRateThrottle]

    # def perform_update(self, serializer):
    #     try:
    #         old = Activity.objects.get(pk=self.kwargs.get("pk"))
    #     except Activity.DoesNotExist:
    #         pass

    #     new = serializer.save(creator=self.request.user)
        # self.request.user.save()

        # if project_changed(old, new):
        #     info = {
        #         "project_id": str(new.pk),
        #         "editor": self.request.user.username
        #     }
        #     activity_notification(["edited_project"], **info)

        # # because project_changed still needs to make reference to the
        # # old publishing rule, it wasn't deleted in the serializer update method,
        # # instead we delete it here after project_changed has done it's part.
        # old.publish.delete()
        
    
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
