from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('', NoticationAPIView.as_view(), name='list_notifications')
]