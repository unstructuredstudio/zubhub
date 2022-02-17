
from .utils import notification_changed
from .serializers import NotificationSerializer

from .models import Notification

from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.utils.translation import ugettext_lazy as _

from rest_framework.generics import (
    UpdateAPIView, ListAPIView, DestroyAPIView)


class NoticationListAPIView(ListAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]


class UpdateNotificationAPIView(UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def perform_update(self, serializer):
        # serializer.save(viewed=True)
        try:
            old = Notification.objects.get(pk=self.kwargs.get("pk"))
        except Notification.DoesNotExist:
            pass
        new = serializer.save(creator=self.request.user)
        if notification_changed(old, new):
            result = self.request.user.save()
            return result


class DeleteNotificationAPIView(DestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

    def delete(self, request, *args, **kwargs):
        notification = self.get_object()
        if notification:
            result = self.destroy(request, *args, **kwargs)
            request.user.save()
            return result


class UserNotificationsAPIView(ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Notification.objects.all().filter(
            recipient=self.kwargs.get("pk")).order_by("date")
        return queryset
