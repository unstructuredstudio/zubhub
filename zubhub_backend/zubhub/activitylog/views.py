from .serializers import ActivitylogSerializer
from .pagination import ActivitylogNumberPagination
from .permissions import SustainedRateThrottle
from rest_framework.permissions import IsAuthenticated

from .models import Activitylog

from rest_framework.generics import ListAPIView
from django.utils.translation import ugettext_lazy as _

from rest_framework.generics import (ListAPIView)

# Create your views here.

class AllUsersActivitylogAPIView(ListAPIView):
    serializer_class = ActivitylogSerializer
    pagination_class = ActivitylogNumberPagination

    def get_queryset(self):
        return Activitylog.objects.all()

class UserActivitylogAPIView(ListAPIView):
    serializer_class = ActivitylogSerializer
    pagination_class = ActivitylogNumberPagination

    def get_queryset(self):
        username = self.kwargs.get("username")
        return Activitylog.objects.all().filter(source__username= username).order_by("-date")
