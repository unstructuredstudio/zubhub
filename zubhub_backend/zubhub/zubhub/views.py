from .serializers import FAQListSerializer, HelpSerializer, PrivacySerializer
from .models import Hero, FAQ, Privacy, Help, StaticAssets
from .utils import delete_file_from_media_server, upload_file_to_media_server, get_sig
from projects.permissions import PostUserRateThrottle, GetUserRateThrottle, SustainedRateThrottle
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from django.utils.text import slugify
from math import floor
import uuid
from django.conf import settings
from django.utils.translation import gettext_lazy as _


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def SigGenAPIView(request):

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
    try:
        delete_file_from_media_server(request.data.get("url"))
        return Response({"result": "ok"}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': _('failed to delete file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
@throttle_classes([GetUserRateThrottle, SustainedRateThrottle])
def UploadFileToLocalAPIView(request):
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
    queryset = Hero.objects.all()
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        obj = self.get_queryset().order_by("-id")[:1]
        if obj:
            return obj[0]
        return None

    def get(self, _):
        obj = self.get_object()
        static_assets = StaticAssets.objects.all().last()
        if static_assets:
            header_logo_url = static_assets.header_logo_url
            footer_logo_url = static_assets.footer_logo_url
        else:
            header_logo_url = ""
            footer_logo_url = ""

        if obj:
            return Response({
                "id": obj.id,
                "title": obj.title,
                "description": obj.description,
                "image_url": obj.image_url,
                "activity_url": obj.activity_url,
                "explore_ideas_url": obj.explore_ideas_url,
                "header_logo_url": header_logo_url,
                "footer_logo_url": footer_logo_url
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "id": "",
                "title": "",
                "description": "",
                "image_url": "",
                "activity_url": "",
                "explore_ideas_url": "",
                "header_logo_url": header_logo_url,
                "footer_logo_url": footer_logo_url
            }, status=status.HTTP_200_OK)


class HelpAPIView(RetrieveAPIView):
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
    queryset = FAQ.objects.all()
    serializer_class = FAQListSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]
