from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import CreatorSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authUserAPIView(request):
    return Response(CreatorSerializer(request.user).data)

