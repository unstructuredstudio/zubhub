from django.urls import path
from .views import authUserAPIView

app_name = "creators"

urlpatterns = [
    path('authUser/', authUserAPIView, name = 'auth_user_detail'),
]