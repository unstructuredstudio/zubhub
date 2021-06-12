import boto3
import uuid
from math import floor
from django.utils.text import slugify
from django.conf import settings


def upload_file(request):

    folder = request.data.get("folder")
    file = request.data.get("file")
    bucket = settings.DOSPACE_BUCKETNAME
    key = str(uuid.uuid4())
    key = key[0: floor(len(key)/6)]
    key = '{0}/{1}-{2}'.format(folder, slugify(file.name), key)

    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=settings.DOSPACE_REGION,
                            endpoint_url=settings.DOSPACE_ENDPOINT_URL,
                            aws_access_key_id=settings.DOSPACE_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.DOSPACE_ACCESS_SECRET_KEY)

    res = client.put_object(Bucket=bucket, Key=key,
                            Body=file, ContentType=file.content_type, ACL="public-read")

    if res.get("ResponseMetadata") and res["ResponseMetadata"]["HTTPStatusCode"] == 200:

        image_url = 'https://{0}.{1}/{2}'.format(
            bucket, settings.DOSPACE_ENDPOINT_URL.split("https://")[1], key)

        return image_url
    else:
        raise Exception


def upload_local_file(file, folder):
    bucket = settings.DOSPACE_BUCKETNAME
    key = str(uuid.uuid4())
    # key = key[0: floor(len(key)/6)]
    key = '{0}/{1}'.format(folder, key)

    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=settings.DOSPACE_REGION,
                            endpoint_url=settings.DOSPACE_ENDPOINT_URL,
                            aws_access_key_id=settings.DOSPACE_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.DOSPACE_ACCESS_SECRET_KEY)

    res = client.put_object(Bucket=bucket, Key=key,
                            Body=file, ContentType=file.content_type, ACL="public-read")

    if res.get("ResponseMetadata") and res["ResponseMetadata"]["HTTPStatusCode"] == 200:

        file_url = 'https://{0}.{1}/{2}'.format(
            bucket, settings.DOSPACE_ENDPOINT_URL.split("https://")[1], key)

        return file_url
    else:
        raise Exception


def delete_file(key):

    bucket = settings.DOSPACE_BUCKETNAME

    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=settings.DOSPACE_REGION,
                            endpoint_url=settings.DOSPACE_ENDPOINT_URL,
                            aws_access_key_id=settings.DOSPACE_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.DOSPACE_ACCESS_SECRET_KEY)

    return client.delete_object(Bucket=bucket, Key=key)
