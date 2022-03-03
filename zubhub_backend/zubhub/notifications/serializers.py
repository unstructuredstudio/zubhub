from rest_framework import serializers

from .models import Notification
from creators.serializers import CreatorSerializer

class NotificationSerializer(serializers.ModelSerializer):
    recipient = CreatorSerializer(read_only=True)
    source = CreatorSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'recipient', 'source', 'date', 'type')

        read_only_field = [
            'id', 'recipient', 'source', 'date', 'type'
        ]
