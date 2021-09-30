from .serializers import HeroSerializer, FAQListSerializer, HelpSerializer, PrivacySerializer
from .models import Hero, FAQ, Privacy, Help
from django_celery_results.models import TaskResult
from .utils import upload_file, delete_file, upload_file_to_local
from projects.permissions import PostUserRateThrottle, GetUserRateThrottle, SustainedRateThrottle, PostAnonRateThrottle
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from django.utils.text import slugify
from cloudinary.utils import api_sign_request
from math import floor
import uuid
from time import time
from cloudinary import config
from django.conf import settings
from django.utils.translation import ugettext_lazy as _
from os import stat


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def SigGenAPIView(request):
    timestamp = time()
    secret = config().api_secret
    api_key = config().api_key

    public_id = str(uuid.uuid4())
    public_id = public_id[0: floor(len(public_id)/3)]
    public_id = '{0}-{1}-{2}'.format(slugify(request.data.get("username")),
                                     slugify(request.data.get("filename")), public_id)

    signature = api_sign_request({
        "timestamp": timestamp,
        "upload_preset": request.data.get("upload_preset"),
        "public_id": public_id},
        secret)

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
        image_url = upload_file(file=file, key=key)

        return Response({"image_url": image_url}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'detail': _('failed to upload file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([GetUserRateThrottle, SustainedRateThrottle])
def DeleteFileAPIView(request):
    try:
        delete_file(request.data.get("url"))
        return Response({"result": "ok"}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': _('failed to delete file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@throttle_classes([PostAnonRateThrottle, SustainedRateThrottle])
def DeleteFileAsyncAPIView(request):
    try:
        task_id = request.data.get("task_id")
        url = request.data.get("url")
        task = TaskResult.objects.filter(task_id=task_id)
        if len(task) > 0:
            delete_file(url)
        else:
            raise Exception()
        return Response({"result": "ok"}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': _('failed to delete file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@throttle_classes([PostAnonRateThrottle, SustainedRateThrottle])
def UploadFileAsyncAPIView(request):
    try:
        task_id = request.data.get("task_id")
        key = request.data.get("key")
        __, name = key.split("/")
        file = request.data.get(name)
        task = TaskResult.objects.filter(task_id=task_id)
        if len(task) > 0 and task[0].status == "RETRY":
            url = upload_file(file, key)
        else:
            raise Exception()
        return Response({"url": url}, status=status.HTTP_200_OK)

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
            url = upload_file_to_local(file, key)

            if url.split("/")[-2].find("image") != -1:
                return Response({"Location": url, "Key": key}, status=status.HTTP_200_OK)
            elif url.split("/")[-2].find("video") != -1:
                return Response({"secure_url": url}, status.HTTP_200_OK)

        except Exception:
            return Response({"result": _('failed to upload file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)
    else:
        return Response({"local": settings.STORE_MEDIA_LOCALLY}, status=status.HTTP_200_OK)


class HeroAPIView(RetrieveAPIView):
    queryset = Hero.objects.all()
    serializer_class = HeroSerializer
    permission_classes = [AllowAny]
    throttle_classes = [GetUserRateThrottle, SustainedRateThrottle]

    def get_object(self):
        obj = self.get_queryset().order_by("-id")[:1]
        if obj:
            return obj[0]
        return None


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
