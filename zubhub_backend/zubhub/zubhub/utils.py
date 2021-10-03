import requests
from hashlib import sha256
from django.conf import settings


def get_hash(string):
    return sha256(string.encode("utf-8")).hexdigest()


def get_sig(username, filename, upload_preset):
    secret_hash = get_hash(settings.MEDIA_SECRET)
    url = "http://media:8001/sigen/"
    return requests.post(url, data={"username": username,
                                    "filename": filename, "upload_preset": upload_preset,
                                    "secret_hash": secret_hash})


def get_cloudinary_resource_info(resource_url):
    secret_hash = get_hash(settings.MEDIA_SECRET)
    url = 'http://media:8001/get_cloudinary_resource_info/'
    return requests.post(url, data={'url': resource_url, "secret_hash": secret_hash})


def upload_file_to_media_server(file, key):
    secret_hash = get_hash(settings.MEDIA_SECRET)
    url = 'http://media:8001/upload_file/'
    _, name = key.split("/")
    files = {}
    files[name] = file
    return requests.post(url, data={'key': key, "secret_hash": secret_hash}, files=files)


def delete_file_from_media_server(file_url):
    secret_hash = get_hash(settings.MEDIA_SECRET)
    url = 'http://media:8001/delete_file/'
    return requests.post(url, data={'url': file_url, "secret_hash": secret_hash})
