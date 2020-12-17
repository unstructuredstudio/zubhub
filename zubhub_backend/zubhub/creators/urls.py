from django.urls import path
from .views import auth_user_api_view, LocationListAPIView

app_name = "creators"

urlpatterns = [
    path('authUser/', auth_user_api_view, name = 'auth_user_detail'),
    path('locations/', LocationListAPIView.as_view(), name = 'location_list')
]