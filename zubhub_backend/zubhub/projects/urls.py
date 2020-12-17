from django.urls import path
from .views import ProjectCreateAPIView

app_name = "projects"

urlpatterns = [
    path('create/', ProjectCreateAPIView.as_view(), name = 'create_project')
]