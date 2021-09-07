from django.utils.translation import ugettext_lazy as _
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from projects.permissions import GetUserRateThrottle, SustainedRateThrottle
from .utils import upload_file, delete_file
from .models import Hero, FAQ, Privacy, Help
from .serializers import HeroSerializer, FAQListSerializer, HelpSerializer, PrivacySerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([GetUserRateThrottle, SustainedRateThrottle])
def UploadFileAPIView(request):
    try:

        image_url = upload_file(request)

        return Response({"image_url": image_url}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'detail': _('failed to upload file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@throttle_classes([GetUserRateThrottle, SustainedRateThrottle])
def DeleteFileAPIView(request):
    try:
        delete_file(request.data.get("key"))
        return Response({"result": "ok"}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': _('failed to delete file to storage backend')}, status=status.HTTP_502_BAD_GATEWAY)


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
