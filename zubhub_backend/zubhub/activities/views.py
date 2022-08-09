from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import (ListAPIView)

@api_view(['GET'])
def index(request):
    print(type(request),'request_activities')
    response = Response({"message":"hello from backend"})
    print(type(response),'response_activities')
    return response
# Create your views here.

# class ActivityListAPIView(ListAPIView):
#     """
#     Fetch paginated list of projects.

#     Returns paginated list of projects
#     """
#     print('backend')
#     def get_queryset(self):
#         return ({"message":"hello from backend"})
    