from django.urls import path
from .views import *

app_name = "creators"

urlpatterns = [
    path('register/', RegisterCreatorAPIView.as_view(), name="signup_creator"),
    path('verify-phone/', VerifyPhoneView.as_view(), name="verify_phone"),
    path('confirm_group_invite/', ConfirmGroupInviteAPIView.as_view(),
         name="confirm_group_invite"),
    path('add_members/',
         AddGroupMembersAPIView.as_view(), name="add_members"),
    path('authUser/', auth_user_api_view, name='auth_user_detail'),
    path('search/', CreatorSearchAPIView.as_view(), name='search_creators'),
    path('edit_creator/', EditCreatorAPIView.as_view(), name='edit_creator'),
    path('delete/', DeleteCreatorAPIView.as_view(), name='delete_creator'),
    path('locations/', LocationListAPIView.as_view(), name='location_list'),
    path('<str:username>/projects/',
         UserProjectsAPIView.as_view(), name="user_projects"),
    path('<str:username>/followers/',
         UserFollowersAPIView.as_view(), name='user_followers'),
    path('<str:username>/following/',
         UserFollowingAPIView.as_view(), name='user_following'),
    path('<str:username>/members/',
         GroupMembersAPIView.as_view(), name='group_members'),
    path('<str:username>/', UserProfileAPIView.as_view(), name='user_profile'),
    path('<uuid:pk>/toggle_follow/',
         ToggleFollowAPIView.as_view(), name="toggle_follow"),
    path('<uuid:pk>/remove_member/',
         RemoveGroupMemberAPIView.as_view(), name="remove_member")
]
