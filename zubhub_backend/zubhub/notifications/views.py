from .serializers import NotificationSerializer

from .models import Notification

from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from django.utils.text import slugify
from math import floor
import uuid
from django.conf import settings
from django.utils.translation import ugettext_lazy as _

from rest_framework.generics import (UpdateAPIView, RetrieveAPIView,
                                     ListAPIView, DestroyAPIView, CreateAPIView, GenericAPIView)

class NoticationListAPIView(ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]


class UpdateNotificationAPIView(UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def perform_update(self, serializer):
        serializer.save(viewed=True)
        

class DeleteNotificationAPIView(DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer 

    
        

