from rest_framework import serializers
from .models import Project
from creators.serializers import CreatorSerializer

class ProjectCreateSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    class Meta:
        model = Project
        fields = [
        "creator",
        "title",
        "description",
        "video",
        "materials_used"
        ]