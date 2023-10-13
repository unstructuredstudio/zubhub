from django.urls import path
from .views import *

app_name = "activities"

urlpatterns = [
    path('',  PublishedActivitiesAPIView.as_view(), name='index'),
    path('un-published', UnPublishedActivitiesAPIView.as_view(), name='unPublished'),
    path('my-activities', UserActivitiesAPIView.as_view(), name='myActivities'),
    path('create/', ActivityCreateAPIView.as_view(), name='create'),
    path('<uuid:pk>/update/', ActivityUpdateAPIView.as_view(), name='update'),
    path('<uuid:pk>/delete/', ActivityDeleteAPIView.as_view(), name='delete'),
    path('<uuid:pk>/toggle-save/', ToggleSaveAPIView.as_view(),  name='save'),
    path('<uuid:pk>/toggle-publish/', togglePublishActivityAPIView.as_view(),  name='publish'),
    path('<uuid:pk>/', ActivityDetailsAPIView.as_view(), name='detail_activity')
]
