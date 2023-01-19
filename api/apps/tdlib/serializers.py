from rest_framework import serializers
from tdlib.models import File, Folder


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            "file_id",
            "parent_id",
            "file_name",
            "file_size",
            "part_size",
            "total_parts",
            "last_uploaded_part",
            "md5_checksum",
            "thumbnail",
            "created_at",
            "updated_at",
        ]


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = [
            "id",
            "parent_id",
            "folder_name",
            "created_at",
            "updated_at",
        ]
