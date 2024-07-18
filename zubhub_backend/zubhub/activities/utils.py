import io
import base64
import qrcode
import requests
from django.http import HttpResponse
from django.template.loader import get_template
from weasyprint import HTML
from .models import *


def create_inspiring_artist(inspiring_artist_data):
    inspiring_artist_data['image'] = Image.objects.create(
        **inspiring_artist_data['image'])
    return InspiringArtist.objects.create(
        **inspiring_artist_data)


def create_making_steps(activity, making_steps):
    for step_data in making_steps:
        step_images_data = step_data.pop('image', [])  # Extract and remove the 'image' key

        # Create the ActivityMakingStep instance
        step = ActivityMakingStep.objects.create(activity=activity, **step_data)

        # Create or retrieve Image instances and associate them with the step
        step_images = []
        for image_info in step_images_data:
            image = Image.objects.create(**image_info)
            step_images.append(image)

        # Associate the Image instances with the step using the set() method
        step.image.set(step_images)


def create_inspiring_examples(activity, inspiring_examples):
    for example in inspiring_examples:
        if 'image' in example:
            saved_image = Image.objects.create(**example['image'])
            example['image'] = saved_image
        InspiringExample.objects.create(activity=activity, **example)


def create_activity_images(activity, images):
    for image in images:
        saved_image = Image.objects.create(**image['image'])
        ActivityImage.objects.create(activity=activity, image=saved_image)


def update_image(image, image_data):
    if (image_data is not None and image is not None):
        if image_data["file_url"] == image.file_url:
            return image
        else:
            image.delete()
            return Image.objects.create(**image_data)
    else:
        if (image):
            image.delete()
        else:
            return Image.objects.create(**image_data)


def update_activity_images(activity, images_to_save):
    ActivityImage.objects.filter(activity=activity).delete()
    create_activity_images(activity, images_to_save)


def update_making_steps(activity, making_steps):
    ActivityMakingStep.objects.filter(activity=activity).delete()
    create_making_steps(activity, making_steps)


def update_inspiring_examples(activity, inspiring_examples):
    InspiringExample.objects.filter(activity=activity).delete()
    create_inspiring_examples(activity, inspiring_examples)


def generate_qr_code(link):
    """
    Generate a QR code for a given link and return it as a base64 string.

    Args:
        link (str): The link to encode in the QR code.

    Returns:
        str: The QR code as a base64 string.
    """
    # Generate QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    buf = io.BytesIO()
    img.save(buf, format="PNG")

    img_bytes = buf.getvalue()

    img_base64 = base64.b64encode(img_bytes).decode()

    return img_base64


def generate_pdf(template_path, context):
    """
    Generate a PDF file from a Jinja template.

    Args:
        template_path (str): The file path to the Jinja template.
        context (dict): The context data for rendering the template.

    Returns:
        HttpResponse: A Django HTTP response with the generated PDF.
    """
    template = get_template(template_path)

    html = template.render(context)

    pdf = HTML(string=html).write_pdf()

    activity_id = context['activity_id']

    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{activity_id}.pdf"'

    return response


def download_file(file_url):
    """
    Download a file from a given URL and save it to the local filesystem.

    Args:
        file_url (str): The URL of the file to download.

    Returns:
        bytes: The file data.
    """
    response = requests.get(file_url, stream=True)
    response.raise_for_status()
    file_data = b""
    for chunk in response.iter_content(chunk_size=4096):
        if chunk:
            file_data += chunk
    return file_data
