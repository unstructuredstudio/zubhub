from rest_framework import serializers
from .models import Project
from creators.serializers import CreatorSerializer

class ProjectSerializer(serializers.ModelSerializer):
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


class ProjectListSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    class Meta:
        model = Project
        fields = [
        "id",
        "creator",
        "title",
        "description",
        "video",
        "materials_used"
        ]