from django.urls import path
from .views import *

app_name = "activities"

urlpatterns = [
    path('', index, name='index')
]



