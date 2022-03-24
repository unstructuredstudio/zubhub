
from .serializers import NotificationSerializer
from .pagination import NotificationNumberPagination
from .permissions import SustainedRateThrottle
from rest_framework.permissions import IsAuthenticated

from .models import Notification

from rest_framework.generics import ListAPIView
from django.utils.translation import ugettext_lazy as _

from rest_framework.generics import (
    UpdateAPIView, ListAPIView, DestroyAPIView)


class MarkNotificationAsViewedAPIView(UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [SustainedRateThrottle]

    def perform_update(self, serializer):
        serializer.save(viewed=True)


class DeleteNotificationAPIView(DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [SustainedRateThrottle]


class UserNotificationsAPIView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NotificationNumberPagination

    def get_queryset(self):
        return Notification.objects.all().filter(
            recipient=self.request.user).order_by("-date")
