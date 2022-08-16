from django.urls import path
from .views import *

app_name = "activities"

urlpatterns = [
    path('', ActivityListAPIView.as_view(), name='index'),
    path('create/', ActivityCreateAPIView.as_view(), name='create')
]



