from rest_framework import serializers
from tdlib.models import File


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            "file_id",
            "file_name",
            "file_size",
            "part_size",
            "total_parts",
            "last_uploaded_part",
            "md5_checksum",
            "thumbnail",
            "parent_id",
            "created_at",
            "updated_at",
        ]
