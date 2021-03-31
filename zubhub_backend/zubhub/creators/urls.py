from django.urls import path
from .views import *

app_name = "creators"

urlpatterns = [
    path('register/', RegisterCreatorAPIView.as_view(), name="signup_creator"),
    path('verify-phone/', VerifyPhoneView.as_view(), name="verify_phone"),
    path('authUser/', auth_user_api_view, name='auth_user_detail'),
    path('edit_creator/', EditCreatorAPIView.as_view(), name='edit_creator'),
    path('<uuid:pk>/add_comment/',
         AddCommentAPIView.as_view(), name="add_comment"),
    path('delete/', DeleteCreatorAPIView.as_view(), name='delete_creator'),
    path('locations/', LocationListAPIView.as_view(), name='location_list'),
    path('<str:username>/projects/',
         UserProjectsAPIView.as_view(), name="user_projects"),
    path('<str:username>/followers/',
         UserFollowersAPIView.as_view(), name='user_followers'),
    path('<str:username>/following/',
         UserFollowingAPIView.as_view(), name='user_following'),
    path('<str:username>/', UserProfileAPIView.as_view(), name='user_profile'),
    path('<uuid:pk>/toggle_follow/',
         ToggleFollowAPIView.as_view(), name="toggle_follow")
]
