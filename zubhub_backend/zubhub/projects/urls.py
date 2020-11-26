from django.urls import path
from .views import ProjectCreateAPIView, ProjectListAPIView, ProjectDetailsAPIView

app_name = "projects"

urlpatterns = [
    path('', ProjectListAPIView.as_view(), name = 'list_projects'),
    path('create/', ProjectCreateAPIView.as_view(), name = 'create_project'),
    path('<uuid:pk>/', ProjectDetailsAPIView.as_view(), name = 'detail_project')

]