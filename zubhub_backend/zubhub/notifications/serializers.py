from rest_framework import serializers

from .models import Notification
from creators.serializers import CreatorSerializer

class NotificationSerializer(serializers.ModelSerializer):
    recipient = CreatorSerializer(read_only=True)
    source = CreatorSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'message', 'recipient', 'source', 'date')

        read_only_field = [
            'id', 'message', 'recipient', 'source', 'date'
        ]
