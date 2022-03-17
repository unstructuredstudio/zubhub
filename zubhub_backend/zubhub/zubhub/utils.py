import requests
from hashlib import sha256
from lxml.html.clean import Cleaner
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
    url = 'http://media:8001/get-cloudinary-resource-info/'
    return requests.post(url, data={'url': resource_url, "secret_hash": secret_hash})


def upload_file_to_media_server(file, key):
    secret_hash = get_hash(settings.MEDIA_SECRET)
    url = 'http://media:8001/upload-file/'
    _, name = key.split("/")
    files = {}
    files[name] = file
    return requests.post(url, data={'key': key, "secret_hash": secret_hash}, files=files)


def delete_file_from_media_server(file_url):
    secret_hash = get_hash(settings.MEDIA_SECRET)
    url = 'http://media:8001/delete-file/'
    return requests.post(url, data={'url': file_url, "secret_hash": secret_hash})



""" Clean summermote html while still allowing for basic html structure """
def clean_summernote_html(string):
    cleaner = Cleaner()
    return cleaner.clean_html(string)




#========================= Docs helper functions =======================
def get_media_schema():
    """ Get API Schema Of Media Server """

    secret_hash = get_hash(settings.MEDIA_SECRET)
    url = 'http://media:8001/media-schema/'
    return requests.post(url, data={"secret_hash": secret_hash})

def get_image_paths(html):
    """ 
    Get all image names in html image tag
    
    Returns ["string"]
    e.g. ["image.jpg", "image2.png", "image3.jpg"]
    """
    import re
    
    try:
        paths =  re.findall(r'<img[^<>]+src=["\']./([^"\'<>]+\.(?:gif|png|jpe?g))["\']', html, re.I)
        return paths
    except Exception as e:
        return []

def images_to_base64(paths, html):
    """ Replace all image names in html image tag with the base64 string of corresponding image """

    from os import path
    from base64 import b64encode

    try:
        for image in paths: # path contains image file names e.g. one.jpg, two.png 
            image_path = path.join(settings.BASE_DIR, 'docs', image) # get image full path
            with open(image_path, "rb") as file:
                base64_data = b64encode(file.read())
                html = html.replace("./" + image, "data:image/png;base64," + base64_data.decode()) #replace image path with base64 string
        return html
    except Exception as e:
        return html
#==================================================================================

    

