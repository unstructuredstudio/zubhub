from rest_framework import serializers

from .models import Notification
from creators.serializers import CreatorMinimalSerializer

class NotificationSerializer(serializers.ModelSerializer):
    recipient = CreatorMinimalSerializer(read_only=True)
    source = CreatorMinimalSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ('id', 'recipient', 'source', 'date', 'viewed', 'type', 'link')

        read_only_field = [
            'id', 'recipient', 'source', 'date', 'viewed', 'type', 'link'
        ]
