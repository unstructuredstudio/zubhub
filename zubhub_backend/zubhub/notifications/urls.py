from django.urls import path
from .views import *

app_name = "notifications"

urlpatterns = [
    path('', NoticationListAPIView.as_view(), name='list_notifications'),
    path('<uuid:pk>/update/', UpdateNotificationAPIView.as_view(),
         name='update_notification'),
    path('<uuid:pk>/delete/', DeleteNotificationAPIView.as_view(),
         name='delete_notification'),
    path('<uuid:pk>/notifications/',
         UserNotificationsAPIView.as_view(), name='user_notifications')
]
