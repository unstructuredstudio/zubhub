from math import floor
import uuid
from .serializers import HeroSerializer, FAQListSerializer, HelpSerializer, PrivacySerializer, ThemeSerializer
from .models import Hero, FAQ, Privacy, Help, AdminSettings, Theme
from .utils import delete_file_from_media_server, upload_file_to_media_server, get_sig
from projects.permissions import PostUserRateThrottle, GetUserRateThrottle, SustainedRateThrottle
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from django.utils.text import slugify
from django.conf import settings
from django.utils.translation import ugettext_lazy as _



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def SigGenAPIView(request):
    """
    Make api request to media server to generate Cloudinary Upload Signature.\n
    Requires Authentication.\n
    ------------------------\n
    request body format:\n
    {\n
        "username":"",\n
        "filename":"",\n
        "upload_preset":""\n
    }\n
    -------------------------\n
    response format:\n
    {\n
        "signature":"",\n
        "timestamp":"",\n
        "public_id":""\n,
        "api_key":""\n
    }\n
    """

    username = request.data.get("username")
    filename = request.data.get("filename")
    upload_preset = request.data.get("upload_preset")

    res = get_sig(username, filename, upload_preset)
    res = res.json()
    signature = res["signature"]
    timestamp = res["timestamp"]
    public_id = res["public_id"]
    api_key = res["api_key"]

    return Response({"signature": signature, "timestamp": timestamp, "public_id": public_id, "api_key": api_key})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([GetUserRateThrottle, SustainedRateThrottle])
def UploadFileAPIView(request):
    """
    Upload Image To Storage Backend.\n

    Requires Authentication.\n
    Returns {"image_url":"url of uploaded image"}\n
    Request body format:\n
        {\n
            file: <image>,\n
            folder: <storage folder>\n
        }\n
    """

    try:
        file = request.data.get("file")
        folder = request.data.get("folder")

        key = str(uuid.uuid4())
        key = key[0: floor(len(key)/6)]
        key = '{0}/{1}-{2}'.format(folder, slugify(file.name), key)
        res = upload_file_to_media_server(file=file, key=key)
        res = res.json()
        image_url = res["url"]

        if isinstance(image_url, str):
            return Response({"image_url": image_url}, status=status.HTTP_200_OK)
        else:
            raise Exception()

    except Exception:
        return Response({'detail': _('failed to upload file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([GetUserRateThrottle, SustainedRateThrottle])
def DeleteFileAPIView(request):
    """
    Delete File from Storage Backend.\n

    Requires authentication.\n
    request body format:\n
        {\n
            url: <url of file to delete>\n
        }\n
    """

    try:
        delete_file_from_media_server(request.data.get("url"))
        return Response({"result": "ok"}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': _('failed to delete file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([GetUserRateThrottle, SustainedRateThrottle])
def UploadFileToLocalAPIView(request):
    """
    Upload File To Storage backend.\n

    Requires Authentication.\n
    ------------------------\n
    "GET":\n
    Returns {"local":True|False} indicating if we are to store \n
    media files on our custom media server or not.\n
    ------------------------\n
    "POST":\n
    Returns {"secure_url":"url of uploaded file"}\n
    Request body format:\n
        {\n
            file: <media file>,\n
            key: <file storage path str>\n
        }\n
    """

    if request.method == "POST":
        try:
            file = request.data.get("file")
            key = request.data.get("key")
            res = upload_file_to_media_server(file, key)
            res = res.json()
            url = res["url"]

            if isinstance(url, str):
                if url.split("/")[-2].find("image") != -1:
                    return Response({"Location": url, "Key": key}, status=status.HTTP_200_OK)
                elif url.split("/")[-2].find("video") != -1:
                    return Response({"secure_url": url}, status.HTTP_200_OK)
            else:
                raise Exception()

        except Exception:
            return Response({"result": _('failed to upload file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)
    else:
        return Response({"local": settings.STORE_MEDIA_LOCALLY}, status=status.HTTP_200_OK)


class HeroAPIView(RetrieveAPIView):
    """
    Get site Hero content. To be displayed on the home page of the frontend.\n
    Returns modified hero object (with additional header_logo_url and footer_logo_url and site_mode):\n
        {   
            "id": <hero id>,
            "title": "string",
            "description": "string",
            "image_url": "string",
            "activity_url": "string",
            "explore_ideas_url": "string",
            "header_logo_url": "string",
            "footer_logo_url": "string",
            "site_mode": "PUBLIC|PRIVATE"
        }
    """

    queryset = Hero.objects.all()
    serializer_class = HeroSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        return self.get_queryset().last()

    def get(self, _):
        serializer = self.get_serializer(self.get_object())
        admin_settings = AdminSettings.objects.all().last()

        header_logo = getattr(admin_settings, "header_logo", None)
        footer_logo = getattr(admin_settings, "footer_logo", None)
        data = {
            **serializer.data,
            "header_logo_url": getattr(header_logo, "name", ""),
            "fooer_logo_url": getattr(footer_logo, "name", ""),
            "site_mode": getattr(admin_settings, "site_mode", "PUBLIC")
        }
        return Response(data)


class HelpAPIView(RetrieveAPIView):
    """
    Get "About Zubhub". Team, projects, etc.\n
    """

    queryset = Help.objects.all()
    serializer_class = HelpSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        obj = self.get_queryset()[:1]
        if obj:
            return obj[0]
        return None


class PrivacyAPIView(RetrieveAPIView):
    """
    Get Zubhub Privacy Policy.
    """

    queryset = Privacy.objects.all()
    serializer_class = PrivacySerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        obj = self.get_queryset()[:1]
        if obj:
            return obj[0]
        return None


class FAQAPIView(ListAPIView):
    """
    Get Frequently Asked Questions.
    """

    queryset = FAQ.objects.all()
    serializer_class = FAQListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

class ThemeAPIView(RetrieveAPIView):
    """
    Get "Theme Zubhub".
    """

    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        obj = self.get_queryset()[:1]
        if obj:
            return obj[0]
        return None


@api_view(['GET'])
@permission_classes([AllowAny])
def MarkdownToHtmlAPIView(request):
    """
    Get html snippets for the documentation.\n

    Here markdown files are read and converted html, 
    then formatted further (image paths are replaced with the image's base64 string).\n
    Returns {\n
            "overview": "",\n
            "web_container": "",\n
            "media_container": "",\n
            "others": ""\n
            }\n
    """

    from markdown import markdown
    from os import path
    from .utils import images_to_base64, get_image_paths

    paths = {
        "overview": path.join(settings.BASE_DIR, 'docs', 'overview.md'),
        "web_container": path.join(settings.BASE_DIR, 'docs', 'web_container.md'),
        "media_container": path.join(settings.BASE_DIR, 'docs', 'media_container.md'),
        "others": path.join(settings.BASE_DIR, 'docs', 'others.md')
    }

    html_files = {
        "overview": "",
        "web_container": "",
        "media_container": "",
        "others": ""
    }

    for key in paths:
        try:
            with open(paths[key], "r") as file:
                html_files[key] = markdown(file.read())

                # replace all image paths with the image's base64 string. 
                # This is so we don't have to permanently put our infra 
                # diagrams in staticfiles where it's discoverable to anyone with the url
                html_files[key] = images_to_base64(get_image_paths(html_files[key]), html_files[key])

        except Exception as e:
            pass

    return Response({**html_files}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def WebSchemaAPIView(request):
    """
    Use SchemaGenerator to generate Zubhub Web API Schema instead of get_schema_view.

    this is neccessary because `get_schema_view` somehow ignores 
    some api endpoints even when told to generate schema for those.
    Returns Web API schema.
    """

    from rest_framework.schemas.openapi import SchemaGenerator
    from .urls import schema_url_patterns

    generator = SchemaGenerator(title='Zubhub Web Server API', patterns=schema_url_patterns)

    return Response(generator.get_schema())


@api_view(['GET'])
@permission_classes([AllowAny])
def MediaSchemaAPIView(request):
    """
    Makes API request to media service to get media server API Schema.
    
    Returns Media Server API Schema.
    """

    from .utils import get_media_schema
    res = get_media_schema()
    return Response(res.json())