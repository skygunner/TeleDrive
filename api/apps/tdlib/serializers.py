from rest_framework import serializers
from tdlib.models import File, Folder


class FileSerializer(serializers.ModelSerializer):
    file_id = serializers.CharField()  # JavaScript issue with BigInt

    class Meta:
        model = File
        fields = [
            "file_id",
            "file_token",
            "parent_id",
            "file_name",
            "file_size",
            "md5_checksum",
            "thumbnail",
            "created_at",
            "updated_at",
            "uploaded_at",
        ]


class SharedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = [
            "file_token",
            "file_name",
            "file_size",
            "md5_checksum",
            "thumbnail",
        ]


class FolderSerializer(serializers.ModelSerializer):
    folder_id = serializers.SerializerMethodField()

    def get_folder_id(self, obj: Folder):
        return str(obj.id)  # JavaScript issue with BigInt

    class Meta:
        model = Folder
        fields = [
            "folder_id",
            "parent_id",
            "folder_name",
            "breadcrumb",
            "created_at",
            "updated_at",
        ]
