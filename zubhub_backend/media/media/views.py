from .utils import upload_file, delete_file, get_cloudinary_resource_info
from .permissions import PostUserRateThrottle, SustainedRateThrottle
from .decorators import authentication_required
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, throttle_classes
from django.utils.text import slugify
from cloudinary.utils import api_sign_request
from math import floor
import uuid
from time import time
from cloudinary import config


@api_view(['POST'])
@authentication_required
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
@authentication_required
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def GetCloudinaryResourceInfoAPIView(request):
    try:
        res = get_cloudinary_resource_info(request.data.get("url"))
        return Response({"result": res}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': 'failed to delete file from media server'}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@authentication_required
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def DeleteFileAPIView(request):
    try:
        res = delete_file(request.data.get("url"))
        return Response({"result": res}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': 'failed to delete file from media server'}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@authentication_required
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def UploadFileAPIView(request):
    try:
        key = request.data.get("key")
        __, name = key.split("/")
        file = request.data.get(name)
        url = upload_file(file, key)
        return Response({"url": url}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': 'failed to delete file from media server'}, status=status.HTTP_502_BAD_GATEWAY)
