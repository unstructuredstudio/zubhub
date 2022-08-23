from .models import *

def create_making_steps(activity, making_steps):
     for step in making_steps:
            if(step['image']):
                saved_image = Image.objects.create(**step['image'])
                step['image'] = saved_image
            ActivityMakingStep.objects.create(activity= activity,**step)
            
def create_inspiring_examples(activity, inspiring_examples):
    for example in inspiring_examples:
            saved_image = Image.objects.create(**example['image'])
            example['image'] = saved_image
            InspiringExample.objects.create(activity= activity,**example)    
            
def update_image(image, image_data):
    if image_data["file_url"] == image.file_url:
        return image
    else :
        image.delete()
        return Image.objects.create(**image_data)
    
def update_activity_images(activity, images_to_save):
    ActivityImage.objects.filter(activity= activity).delete()
    for image in images_to_save:
        saved_image=Image.objects.create(**image['image'])
        ActivityImage.objects.create(activity= activity,image= saved_image)
        
def update_making_steps(activity, making_steps):
    ActivityMakingStep.objects.filter(activity= activity).delete()        
    create_making_steps(activity, making_steps)
 
def update_inspiring_examples(activity , inspiring_examples):
    InspiringExample.objects.filter(activity= activity).delete()
    create_inspiring_examples(activity , inspiring_examples)