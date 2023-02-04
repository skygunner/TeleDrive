from rest_framework import serializers
from tdlib.models import File, Folder


class FileSerializer(serializers.ModelSerializer):
    file_id = serializers.CharField()  # JavaScript issue with BigInt
    file_token = serializers.SerializerMethodField()

    def get_file_token(self, obj):
        return obj.file_uuid

    class Meta:
        model = File
        fields = [
            "file_id",
            "file_token",
            "parent_id",
            "file_name",
            "file_size",
            # "part_size",
            # "total_parts",
            # "last_uploaded_part",
            "md5_checksum",
            "thumbnail",
            "created_at",
            "updated_at",
            "uploaded_at",
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
