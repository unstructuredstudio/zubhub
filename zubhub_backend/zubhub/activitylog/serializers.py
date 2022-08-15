from creators.models import Creator
from rest_framework import serializers

from .models import Activitylog
from creators.serializers import CreatorMinimalSerializer

class CreatorInfoSerializer(serializers.ModelSerializer):
    tags = serializers.SlugRelatedField(slug_field="name",
                                        read_only=True,
                                        many=True)

    class Meta:
        model = Creator
        fields = ('id', 'username', 'followers_count', 
                  'following_count', 'projects_count', "tags", 
                  )


class ActivitylogSerializer(serializers.ModelSerializer):

    source = CreatorInfoSerializer()
    target = CreatorInfoSerializer()

    class Meta:
        model = Activitylog
        fields = ('id', 'source', 'target', 'date', 'type', 'link', 'message')

        read_only_field = [
            'id', 'source', 'target', 'date', 'type', 'link', 'message'
        ]
