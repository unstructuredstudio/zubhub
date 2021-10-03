from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (GetCloudinaryResourceInfoAPIView,
                    DeleteFileAPIView, UploadFileAPIView, SigGenAPIView)

urlpatterns = [
    path('upload_file/', UploadFileAPIView, name="upload_file"),
    path('delete_file/', DeleteFileAPIView, name="delete_file"),
    path('sigen/', SigGenAPIView, name="sigen"),
    path('get_cloudinary_resource_info/', GetCloudinaryResourceInfoAPIView,
         name="get_cloudinary_resource_info")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
