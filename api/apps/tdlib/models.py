from django.db import models

from auth.models import User
from simple_history.models import HistoricalRecords
from tdlib.wrapper import td_client
from telethon.tl.functions.upload import SaveBigFilePartRequest, SaveFilePartRequest
from utils.models import BaseModelMixin


class Folder(BaseModelMixin):
    history = HistoricalRecords(table_name="historical_folders", custom_model_name="HistoricalFolder", app="tdlib")

    parent = models.ForeignKey(to="self", to_field="id", db_column="folder_id", on_delete=models.CASCADE)
    folder_name = models.CharField(max_length=255)

    class Meta:
        db_table = "folders"

    @classmethod
    def find_by_id(self, id: int):
        return self.objects.filter(id=id).first()

    @classmethod
    def is_unique_name(self, parent: "Folder", folder_name: str):
        return self.objects.filter(parent=parent, folder_name=folder_name).first() is None


class File(BaseModelMixin):
    history = HistoricalRecords(table_name="historical_files", custom_model_name="HistoricalFile", app="tdlib")

    user = models.ForeignKey(to=User, to_field="id", db_column="user_id", on_delete=models.CASCADE)
    file_id = models.BigIntegerField()
    file_name = models.CharField(max_length=255, db_index=True)
    file_size = models.BigIntegerField()
    part_size = models.BigIntegerField()
    total_parts = models.BigIntegerField()
    last_uploaded_part = models.BigIntegerField(default=0)
    md5_checksum = models.CharField(max_length=255)
    parent = models.ForeignKey(
        to=Folder, to_field="id", db_column="folder_id", on_delete=models.CASCADE, null=True, blank=True, db_index=True
    )

    class Meta:
        db_table = "files"
        unique_together = (("user", "file_id"),)
        index_together = (("user", "file_id"),)

    @classmethod
    def find_by_user_and_id(self, user: User, file_id: str):
        return self.objects.filter(user=user, file_id=file_id).first()

    @classmethod
    def is_unique_name(self, user: User, parent: Folder, file_name: str):
        return self.objects.filter(user=user, parent=parent, file_name=file_name).first() is None

    @classmethod
    def create(
        self,
        user: User,
        file_id: int,
        file_name: str,
        file_size: int,
        part_size: int,
        total_parts: int,
        md5_checksum: str,
        parent=Folder,
    ):
        file = File(
            user=user,
            file_id=file_id,
            file_name=file_name,
            file_size=file_size,
            part_size=part_size,
            total_parts=total_parts,
            md5_checksum=md5_checksum,
            parent=parent,
        )
        file.save()
        return file

    def upload_part(self, file_bytes: bytes, file_part: int):
        is_big = self.file_size > 10 * 1024 * 1024  # 10MB
        if is_big:
            request = SaveBigFilePartRequest(
                file_id=self.file_id,
                file_part=file_part,
                file_total_parts=self.total_parts,
                bytes=file_bytes,
            )
        else:
            request = SaveFilePartRequest(file_id=self.file_id, file_part=file_part, bytes=file_bytes)

        result = td_client()(request)
        if not result:
            raise RuntimeError("Failed to upload file part {} for file id {}".format(file_part, self.file_id))

        self.last_uploaded_part = file_part
        self.save()
