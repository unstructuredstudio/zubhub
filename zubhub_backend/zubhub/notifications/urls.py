from django.urls import path
from .views import *

app_name = "notifications"

urlpatterns = [
    path('<uuid:pk>/update/', MarkNotificationAsViewedAPIView.as_view(),
         name='update-notification'),
    path('<uuid:pk>/delete/', DeleteNotificationAPIView.as_view(),
         name='delete-notification'),
    path('',
         UserNotificationsAPIView.as_view(), name='user-notifications')
]
