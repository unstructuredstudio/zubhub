from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from .views import *

app_name = "notifications"

urlpatterns = [
    path('', NoticationListAPIView.as_view(), name='list_notifications')
]
