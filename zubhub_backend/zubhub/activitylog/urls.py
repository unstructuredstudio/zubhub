from django.urls import path
from .views import *

app_name = "activitylog"

urlpatterns = [
    path('',AllUsersActivitylogAPIView.as_view(), name='all-activitylogs' ),
    path('<str:username>/',
         UserActivitylogAPIView.as_view(), name='user-activitylog')
]
