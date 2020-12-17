from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CreatorSerializer, LocationSerializer
from .models import Location

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_user_api_view(request):
    return Response(CreatorSerializer(request.user).data)



class LocationListAPIView(ListAPIView):
    queryset =  Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]