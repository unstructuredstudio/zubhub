"""zubhub URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static


schema_url_patterns = []


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('summernote/', include('django_summernote.urls')),
    path('api/', include('APIS.urls')),
]


if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEFAULT_BACKEND_DOMAIN.startswith("localhost"):
    """ Don't server documentation and schema in production """

    from rest_auth.urls import (
        LoginView, LogoutView, PasswordResetConfirmView, PasswordResetView)
    from rest_auth.registration.urls import VerifyEmailView
    from zubhub.views import (UploadFileAPIView, DeleteFileAPIView,
                            HeroAPIView, HelpAPIView, ChallengeAPIView, PrivacyAPIView, 
                            FAQAPIView, AmbassadorsAPIView, SigGenAPIView, UploadFileToLocalAPIView,
                            MarkdownToHtmlAPIView, MediaSchemaAPIView, WebSchemaAPIView, ThemeAPIView)

    schema_url_patterns = [
            path('api/rest-auth/login/', LoginView.as_view()),
            path('api/rest-auth/logout/', LogoutView.as_view()),
            path('api/rest-auth/registration/verify-email/', VerifyEmailView.as_view()),
            path('api/rest-auth/password/reset/', PasswordResetView.as_view()),
            path('api/rest-auth/password/reset/confirm/', PasswordResetConfirmView.as_view()),
            path('api/creators/', include('creators.urls')),
            path('api/projects/', include('projects.urls')),
            path('api/activities/', include('activities.urls')),
            path('api/activitylog/', include('activitylog.urls')),
            path('api/upload-file/', UploadFileAPIView),
            path('api/delete-file/', DeleteFileAPIView),
            path('api/upload-file-to-local/', UploadFileToLocalAPIView),
            path('api/hero/', HeroAPIView.as_view()),
            path('api/help/', HelpAPIView.as_view()),
            path('api/challenge/', ChallengeAPIView.as_view()),
            path('api/privacy/', PrivacyAPIView.as_view()),
            path('api/faqs/', FAQAPIView.as_view()),
            path('api/ambassadors/', AmbassadorsAPIView.as_view()),
            path('api/signature/', SigGenAPIView),
            path('api/theme/', ThemeAPIView.as_view())
            ]

    urlpatterns = urlpatterns + [
        path('web-schema/', WebSchemaAPIView, name="web-schema"),
        path('media-schema/', MediaSchemaAPIView, name="media-schema"),
        path('', TemplateView.as_view(
            template_name='doc/doc.html',
            extra_context={'web_schema_url': 'web-schema', 'media_schema_url': 'media-schema'}), name="doc"),
        path('markdown-to-html/', MarkdownToHtmlAPIView, name="markdown-to-html")
    ]
