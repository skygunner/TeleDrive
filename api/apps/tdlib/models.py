import io
import os
from datetime import timedelta

from django.db import models
from django.utils import timezone

from auth.models import User
from simple_history.models import HistoricalRecords
from tdlib.wrapper import td_client
from telethon.client.downloads import MAX_CHUNK_SIZE
from telethon.extensions import BinaryReader
from telethon.tl import functions, types
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
    message = models.BinaryField(blank=True, null=True)

    class Meta:
        db_table = "files"
        unique_together = (("user", "file_id"),)
        index_together = (("user", "file_id"),)

    @classmethod
    def find_by_user_and_id(self, user: User, file_id: str):
        return self.objects.filter(user=user, file_id=file_id).first()

    @classmethod
    def is_unique_name(self, user: User, parent: Folder, file_name: str):
        return self.objects.filter(user=user, parent=parent, file_name=file_name, message__isnull=False).first() is None

    @classmethod
    def is_temporarily_reserved_name(self, user: User, parent: Folder, file_name: str):
        temp_file = self.objects.filter(user=user, parent=parent, file_name=file_name, message__isnull=True).first()
        if temp_file is None:
            return False

        if temp_file.updated_at + timedelta(minutes=15) < timezone.now():
            temp_file.delete()
            return False

        return True

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

    def get_unique_name(self):
        return str(self.id) + os.path.splitext(self.file_name)[-1]

    def upload_part(self, file_bytes: bytes, file_part: int):
        is_big = self.file_size > 10 * 1024 * 1024  # 10MB
        if is_big:
            request = functions.upload.SaveBigFilePartRequest(
                file_id=self.file_id,
                file_part=file_part - 1,
                file_total_parts=self.total_parts,
                bytes=file_bytes,
            )
        else:
            request = functions.upload.SaveFilePartRequest(
                file_id=self.file_id, file_part=file_part - 1, bytes=file_bytes
            )

        result = td_client()(request)
        if not result:
            raise RuntimeError("Failed to upload file part {} for file id {}".format(file_part, self.file_id))

        self.last_uploaded_part = file_part
        self.save()

        if self.last_uploaded_part == self.total_parts:
            if is_big:
                input_file = types.InputFileBig(id=self.file_id, parts=self.total_parts, name=self.get_unique_name())
            else:
                input_file = types.InputFile(
                    id=self.file_id, parts=self.total_parts, name=self.get_unique_name(), md5_checksum=self.md5_checksum
                )

            message = td_client().send_file(
                entity=self.user.id, file=input_file, force_document=True, file_size=self.file_size, silent=True
            )
            self.message = bytes(message)
            self.save()

    def download_range(self, start: int, end: int):
        file = BinaryReader(self.message).tgread_object()

        limit = 1
        if end - start > MAX_CHUNK_SIZE:
            limit = ((end - start) + MAX_CHUNK_SIZE - 1) // MAX_CHUNK_SIZE

        chunk_size = end - start
        if limit > 1:
            chunk_size = MAX_CHUNK_SIZE

        bytes_io = io.BytesIO()

        for chunk in td_client().iter_download(
            file=file, offset=start, limit=limit, chunk_size=chunk_size, request_size=chunk_size
        ):
            bytes_io.write(chunk)

        if callable(getattr(bytes_io, "flush", None)):
            bytes_io.flush()
        range_bytes = bytes_io.getvalue()
        bytes_io.close()

        return range_bytes
