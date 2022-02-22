
from urllib import request
from .serializers import NotificationSerializer
from .pagination import NotificationNumberPagination
from .permissions import SustainedRateThrottle
from rest_framework.decorators import api_view, permission_classes, throttle_classes

from .models import Notification

from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.utils.translation import ugettext_lazy as _

from rest_framework.generics import (
    UpdateAPIView, ListAPIView, DestroyAPIView)


class MarkNotificationAsViewedAPIView(UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    throttle_classes = [SustainedRateThrottle]

    def perform_update(self, serializer):
        serializer.save(viewed=True)


class DeleteNotificationAPIView(DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    throttle_classes = [SustainedRateThrottle]


class UserNotificationsAPIView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]
    pagination_class = NotificationNumberPagination

    def get_queryset(self):
        queryset = Notification.objects.all().filter(
            recipient=self.request.user.pk).order_by("date")
        return queryset
