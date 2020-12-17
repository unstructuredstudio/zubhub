from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import UpdateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import CreatorSerializer, LocationSerializer
from django.contrib.auth import get_user_model
from .permissions import IsOwner
from .models import Location

Creator = get_user_model()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def auth_user_api_view(request):
    return Response(CreatorSerializer(request.user).data)


class UserProfileAPIView(RetrieveAPIView):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    lookup_field = "username"
    permission_classes = [AllowAny]

    
class EditCreatorAPIView(UpdateAPIView):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self,request,*args,**kwargs):
        return self.update(request,*args,**kwargs)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        obj = queryset.get(pk=self.request.user.pk)
        self.check_object_permissions(self.request, obj)
        return obj

class LocationListAPIView(ListAPIView):
    queryset =  Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]