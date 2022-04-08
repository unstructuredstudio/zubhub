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
from media.tasks import compress_video


@api_view(['POST'])
@authentication_required
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def SigGenAPIView(request):
    """
    generate Cloudinary Upload Signature.\n
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
        "public_id":"",\n
        "api_key":""\n
    }\n
    """

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
    """
    This gets the resource information about a video uploaded to cloudinary.\n
    This view is used when a transform is applied to video. 
    to know if the transformation is ready so we can update the video url 
    to take advantage of the transformation, we make a call to this endpoint.\n
    Requires Authentication.\n
    ------------------------\n
    request body format:\n
    {\n
        "url":"string",\n
    }\n
    -------------------------\n
    response format:\n
    {\n
        "result":{video resource json},\n
    }\n
    """

    try:
        res = get_cloudinary_resource_info(request.data.get("url"))
        return Response({"result": res}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': 'failed to get cloudinary resource info'}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@authentication_required
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def DeleteFileAPIView(request):
    """
    Delete the file with the provided url.\n
    Requires Authentication.\n
    ------------------------\n
    request body format:\n
    {\n
        "url":"string",\n
    }\n
    -------------------------\n
    response format:\n
    {\n
        "result":"ok"},\n
    }\n
    """

    try:
        res = delete_file(request.data.get("url"))
        return Response({"result": res}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': 'failed to delete file from media server'}, status=status.HTTP_502_BAD_GATEWAY)


@api_view(['POST'])
@authentication_required
@throttle_classes([PostUserRateThrottle, SustainedRateThrottle])
def UploadFileAPIView(request):
    """
    Delete the file with the provided url.\n
    Requires Authentication.\n
    ------------------------\n
    request body format:\n
    {\n
        "key":"string concatenation of folder and filename",\n
        "<filename>":<file being uploaded>,\n
    }\n
    -------------------------\n
    response format:\n
    {\n
        "url":"url of uploaded file"},\n
    }\n
    """

    try:
        key = request.data.get("key")
        __, name = key.split("/")
        file = request.data.get(name)
        url = upload_file(file, key)
        print("URL:", url)
        compress_video.delay("x", url.split("localhost:8001/").pop())
        return Response({"url": url}, status=status.HTTP_200_OK)

    except Exception:
        return Response({'result': 'failed to delete file from media server'}, status=status.HTTP_502_BAD_GATEWAY)

@api_view(['POST'])
@authentication_required
def MediaSchemaAPIView(request):
    """
    Use SchemaGenerator to generate Zubhub Media Server API Schema instead of get_schema_view.

    this is neccessary because `get_schema_view` somehow ignores 
    some api endpoints even when told to generate schema for those.
    Returns Media Server API schema.
    """

    from rest_framework.schemas.openapi import SchemaGenerator
    from django.urls import path

    schema_url_patterns = [
        path('upload-file/', UploadFileAPIView),
        path('delete-file/', DeleteFileAPIView),
        path('sigen/', SigGenAPIView),
        path('get-cloudinary-resource-info/', GetCloudinaryResourceInfoAPIView),
        path('media-schema/', MediaSchemaAPIView)
    ]

    generator = SchemaGenerator(title='Zubhub Media Server API', patterns=schema_url_patterns)

    return Response(generator.get_schema())