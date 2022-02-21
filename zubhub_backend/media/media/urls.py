from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import (GetCloudinaryResourceInfoAPIView,
                    DeleteFileAPIView, UploadFileAPIView, 
                    SigGenAPIView, MediaSchemaAPIView)

urlpatterns = [
    path('upload-file/', UploadFileAPIView, name="upload_file"),
    path('delete-file/', DeleteFileAPIView, name="delete_file"),
    path('sigen/', SigGenAPIView, name="sigen"),
    path('get-cloudinary-resource-info/', GetCloudinaryResourceInfoAPIView,
         name="get_cloudinary_resource_info"),
    path('media-schema/', MediaSchemaAPIView, name="media-schema")

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
