from django.urls import path
from .views import authUserAPIView, EditCreatorAPIView

app_name = "creators"

urlpatterns = [
    path('authUser/', authUserAPIView, name = 'auth_user_detail'),
    path('edit_creator/', EditCreatorAPIView.as_view(), name = 'edit_creator')
]