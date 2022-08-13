from datetime import datetime, timedelta
from email import message
from activitylog.models import Activitylog
from django.template.loader import render_to_string


def get_activity_template_name(activity_type):
    file_extension='.html'
    print(f'activitylog/{activity_type.name.lower()}{file_extension}', "@fileextension")
    # activitylog/clap.html 
    return f'activitylog/{activity_type.name.lower()}{file_extension}'


def push_activity(user, source, context, activity_type, link):
    template_name = get_activity_template_name(activity_type)

    message= render_to_string(template_name, context)

    activity= Activitylog.objects.create(type= activity_type, target= user, 
                                          source= source, message= message,
                                          link= link)
    
    activity.save()