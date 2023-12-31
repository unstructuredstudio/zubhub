from django.urls import path, include
from zubhub.views import (UploadFileAPIView, DeleteFileAPIView,
                          HeroAPIView, HelpAPIView, ChallengeAPIView, PrivacyAPIView, FAQAPIView, AmbassadorsAPIView,
                          SigGenAPIView, UploadFileToLocalAPIView, ThemeAPIView)


urlpatterns = [
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('creators/', include('creators.urls', namespace="creators")),
    path('projects/', include('projects.urls', namespace="projects")),
    path('activitylog/', include('activitylog.urls', namespace="activitylog")),
    path('activities/', include('activities.urls', namespace="activities")),
    path('notifications/', include('notifications.urls', namespace="notifications")),
    path('upload-file/', UploadFileAPIView, name="upload_file"),
    path('delete-file/', DeleteFileAPIView, name="delete_file"),
    path('upload-file-to-local/', UploadFileToLocalAPIView,
         name="upload_file_to_local"),
    path('hero/', HeroAPIView.as_view(), name="hero"),
    path('help/', HelpAPIView.as_view(), name="help"),
    path('privacy/', PrivacyAPIView.as_view(), name="privacy"),
    path('faqs/', FAQAPIView.as_view(), name="faqs"),
    path('ambassadors/', AmbassadorsAPIView.as_view(), name="ambassadors"),
    path('challenge/', ChallengeAPIView.as_view(), name="challenge"),
    path('signature/', SigGenAPIView,
         name="signature_generator_api"),
     path('theme/', ThemeAPIView.as_view(), name="theme"),
]
