import boto3
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import cloudinary
from cloudinary import api
from hashlib import sha256
from ffmpy import FFmpeg
from media.tasks import compress_video


def get_hash(string):
    return sha256(string.encode("utf-8")).hexdigest()


def generate_thumbnail(name, root_dir):
    video_path = "{0}/{1}".format(root_dir, name)
    thumbnail_path = "{0}/{1}.jpg".format(root_dir, name)
    FFmpeg(inputs={video_path: None},
           outputs={thumbnail_path: ['-ss',
                                     '00:00:4',
                                     '-vframes', '1']}).run()


def get_cloudinary_resource_info(url):
    name = url.split("/")
    folder = name[-2]
    name = name[-1]
    if name.find(".") > -1:
        name = name.split(".")[0]
    return api.resource(
        public_id=folder + "/" + name, resource_type="video", type="upload", max_results=500)


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


def upload_file_to_local(file, key):
    folder, name = key.split("/")

    fs = FileSystemStorage(settings.MEDIA_ROOT + "/" + folder)
    fs.save(name, file)
    generate_thumbnail(name, settings.MEDIA_ROOT + "/" + folder)
    url = '{0}://{1}{2}{3}/{4}'.format(settings.DEFAULT_MEDIA_SERVER_PROTOCOL,
                                       settings.DEFAULT_MEDIA_SERVER_DOMAIN,
                                       settings.MEDIA_URL, folder, name)

    return url


def delete_file(url):
    if url.startswith("{0}://{1}".format(settings.DEFAULT_MEDIA_SERVER_PROTOCOL,
                                         settings.DEFAULT_MEDIA_SERVER_DOMAIN)):
        return delete_file_from_local(url)
    elif url.startsWith("https://cloudinary.com"):
        return delete_file_from_cloudinary(url)
    elif url.startsWith('https://{0}.{1}'.format(settings.DOSPACE_BUCKETNAME,
                                                 settings.DOSPACE_ENDPOINT_URL.split("https://")[1])):
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


def delete_file_from_cloudinary(url):
    name = url.split("/")
    folder = name[-2]
    name = name[-1]

    if name.find(".") > -1:
        name = name.split(".")[0]
    res = cloudinary.uploader.destroy(
        public_id=folder+"/" + name, resource_type="video", invalidate=True)
    return res["result"]


def delete_file_from_local(url):
    url = url.split("/")
    folder = url[-2]
    name = url[-1]
    fs = FileSystemStorage(settings.MEDIA_ROOT + "/" + folder)
    fs.delete(name)
    fs.delete(name + ".jpg")
    return "ok"
