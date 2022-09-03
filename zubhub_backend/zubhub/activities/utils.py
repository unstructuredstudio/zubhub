from .models import *


def create_inspiring_artist(inspiring_artist_data):
    print('inspiringArtistData', inspiring_artist_data)
    inspiring_artist_data['image'] = Image.objects.create(
        **inspiring_artist_data['image'])
    return InspiringArtist.objects.create(
        **inspiring_artist_data)


def create_making_steps(activity, making_steps):
    for step in making_steps:
        if(step.get('image')):
            saved_image = Image.objects.create(**step['image'])
            step['image'] = saved_image
        ActivityMakingStep.objects.create(activity=activity, **step)


def create_inspiring_examples(activity, inspiring_examples):
    for example in inspiring_examples:
        if 'image' in example:
            saved_image = Image.objects.create(**example['image'])
            example['image'] = saved_image
        InspiringExample.objects.create(activity=activity, **example)


def create_activity_images(activity, images):
    print('activity_serialized_images', images)
    for image in images:
        saved_image = Image.objects.create(**image['image'])
        ActivityImage.objects.create(activity=activity, image=saved_image)


def update_image(image, image_data):
    if(image_data and image):
        if image_data["file_url"] == image.file_url:
            return image
        else:
            image.delete()
            return Image.objects.create(**image_data)
    else:
        if(image):
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
