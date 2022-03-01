from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('viewed', )

        read_only_field = [
            'id', 'message', 'recipient', 'source', 'date'
        ]
