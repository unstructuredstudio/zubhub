from django.urls import path
from .views import auth_user_api_view, UserProfileAPIView, LocationListAPIView, EditCreatorAPIView

app_name = "creators"

urlpatterns = [
    path('authUser/', auth_user_api_view, name='auth_user_detail'),
    path('edit_creator/', EditCreatorAPIView.as_view(), name='edit_creator'),
    path('locations/', LocationListAPIView.as_view(), name='location_list'),
    path('<str:username>/', UserProfileAPIView.as_view(), name='user_profile')
]

