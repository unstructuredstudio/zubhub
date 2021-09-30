import boto3
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import requests


def upload_file_async(file, key, task_id):

    if settings.STORE_MEDIA_LOCALLY == False:
        return upload_file_to_DO(file, key)
    elif settings.STORE_MEDIA_LOCALLY == True:
        return upload_file_to_local_async(file, key, task_id)


def upload_file(file, key):
    if settings.STORE_MEDIA_LOCALLY == False:
        return upload_file_to_DO(file, key)
    elif settings.STORE_MEDIA_LOCALLY == True:
        return upload_file_to_local(file, key)


def upload_file_to_DO(file, key):
    bucket = settings.DOSPACE_BUCKETNAME
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


def upload_file_to_local_async(file, key, task_id):
    url = 'http://web:8000/api/upload_file_async/'
    _, name = key.split("/")
    files = {}
    files[name] = file
    return requests.post(url, data={'key': key, "task_id": task_id}, files=files)


def upload_file_to_local(file, key):
    folder, name = key.split("/")

    fs = FileSystemStorage(settings.MEDIA_ROOT + "/" + folder)
    fs.save(name, file)
    url = '{0}://{1}{2}{3}/{4}'.format(settings.DEFAULT_BACKEND_PROTOCOL,
                                       settings.DEFAULT_BACKEND_DOMAIN,
                                       settings.MEDIA_URL, folder, name)

    return url


def delete_file(url):
    if url.startswith("{0}://{1}".format(settings.DEFAULT_BACKEND_PROTOCOL,
                                         settings.DEFAULT_BACKEND_DOMAIN)):
        return delete_file_from_local(url)
    else:
        return delete_file_from_DO(url)


def delete_file_async(url, task_id):
    if url.startswith("{0}://{1}".format(settings.DEFAULT_BACKEND_PROTOCOL,
                                         settings.DEFAULT_BACKEND_DOMAIN)):
        return delete_file_from_local_async(url, task_id)
    else:
        return delete_file_from_DO(url)


def delete_file_from_DO(url):
    bucket = settings.DOSPACE_BUCKETNAME
    key = url.split("/")
    key = key[-2] + "/" + key[-1]

    session = boto3.session.Session()
    client = session.client('s3',
                            region_name=settings.DOSPACE_REGION,
                            endpoint_url=settings.DOSPACE_ENDPOINT_URL,
                            aws_access_key_id=settings.DOSPACE_ACCESS_KEY_ID,
                            aws_secret_access_key=settings.DOSPACE_ACCESS_SECRET_KEY)

    return client.delete_object(Bucket=bucket, Key=key)


def delete_file_from_local_async(image_url, task_id):
    url = 'http://web:8000/api/delete_file_async/'
    return requests.post(url, data={'url': image_url, "task_id": task_id})


def delete_file_from_local(url):
    url = url.split("/")
    folder = url[-2]
    name = url[-1]
    fs = FileSystemStorage(settings.MEDIA_ROOT + "/" + folder)
    return fs.delete(name)
