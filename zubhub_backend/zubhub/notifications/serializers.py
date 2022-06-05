from rest_framework import serializers

from .models import Notification
from creators.serializers import CreatorMinimalSerializer

class NotificationSerializer(serializers.ModelSerializer):
    recipient = CreatorMinimalSerializer(read_only=True)
    sources = CreatorMinimalSerializer(read_only=True, many=True)

    class Meta:
        model = Notification
        fields = ('id', 'recipient', 'sources', 'date', 'viewed', 'type', 'link', 'message')

        read_only_field = [
            'id', 'recipient', 'sources', 'date', 'viewed', 'type', 'link', 'message'
        ]
