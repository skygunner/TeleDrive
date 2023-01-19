import base64
import io
import os
from datetime import timedelta

from django.db import models
from django.utils import timezone

from auth.models import User
from simple_history.models import HistoricalRecords
from tdlib.wrapper import td_client
from telethon.client.downloads import MIN_CHUNK_SIZE
from telethon.extensions import BinaryReader
from telethon.tl import functions, types
from utils.models import BaseModelMixin


class Folder(BaseModelMixin):
    history = HistoricalRecords(table_name="historical_folders", custom_model_name="HistoricalFolder", app="tdlib")

    user = models.ForeignKey(to=User, to_field="id", db_column="user_id", on_delete=models.CASCADE, db_index=True)
    parent = models.ForeignKey(
        to="self", to_field="id", db_column="parent_id", on_delete=models.CASCADE, null=True, blank=True, db_index=True
    )
    folder_name = models.CharField(max_length=255, db_index=True)

    class Meta:
        db_table = "folders"

    @classmethod
    def find_by_user_and_id(self, user: User, id: str):
        return self.objects.filter(user=user, id=id).first()

    @classmethod
    def is_unique_name(self, user: User, parent: "Folder", folder_name: str):
        return self.objects.filter(user=user, parent=parent, folder_name=folder_name).first() is None

    @classmethod
    def create(self, user: User, parent: "Folder", folder_name: str):
        folder = Folder(user=user, parent=parent, folder_name=folder_name)
        folder.save()
        return folder

    @classmethod
    def list(self, user: User, parent: "Folder", offset: int, limit: int):
        where = "WHERE user_id = {} AND parent_id is NULL".format(user.id)
        if parent is not None:
            where = "WHERE user_id = {} AND parent_id = {}".format(user.id, parent.id)

        return self.objects.raw("SELECT * FROM folders {} LIMIT {} OFFSET {}".format(where, limit, offset))

    def update(self, parent: "Folder", folder_name: str):
        self.parent = parent
        self.folder_name = folder_name
        self.save()

    def delete(self, *args, **kwargs):
        File.objects.filter(parent=self).update(deleted_at=timezone.now())
        return super().delete(*args, **kwargs)


class File(BaseModelMixin):
    history = HistoricalRecords(table_name="historical_files", custom_model_name="HistoricalFile", app="tdlib")

    user = models.ForeignKey(to=User, to_field="id", db_column="user_id", on_delete=models.CASCADE, db_index=True)
    parent = models.ForeignKey(
        to=Folder, to_field="id", db_column="parent_id", on_delete=models.CASCADE, null=True, blank=True, db_index=True
    )
    file_id = models.PositiveBigIntegerField()
    file_name = models.CharField(max_length=255, db_index=True)
    file_size = models.PositiveBigIntegerField()
    part_size = models.PositiveBigIntegerField()
    total_parts = models.PositiveIntegerField()
    last_uploaded_part = models.PositiveIntegerField(default=0)
    md5_checksum = models.CharField(max_length=255)
    binary_message = models.BinaryField(blank=True, null=True)
    binary_thumbnail = models.BinaryField(blank=True, null=True)

    class Meta:
        db_table = "files"
        unique_together = (("user", "file_id"),)
        index_together = (("user", "file_id"),)

    @property
    def message(self):
        return BinaryReader(self.binary_message).tgread_object()

    @property
    def mime_type(self):
        try:
            return self.message.media.document.mime_type
        except TypeError:
            return "application/octet-stream"

    @property
    def thumbnail(self):
        if self.binary_thumbnail:
            return "data:image/jpg;base64,{}".format(base64.b64encode(self.binary_thumbnail).decode("UTF-8"))
        return None

    @classmethod
    def find_by_user_and_id(self, user: User, file_id: str):
        return File.objects.filter(user=user, file_id=file_id).first()

    @classmethod
    def is_unique_name(self, user: User, parent: Folder, file_name: str):
        return (
            self.objects.filter(user=user, parent=parent, file_name=file_name, binary_message__isnull=False).first()
            is None
        )

    @classmethod
    def is_temporarily_reserved_name(self, user: User, parent: Folder, file_name: str):
        temp_file = self.objects.filter(
            user=user, parent=parent, file_name=file_name, binary_message__isnull=True
        ).first()
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
        parent: Folder,
        file_id: int,
        file_name: str,
        file_size: int,
        part_size: int,
        total_parts: int,
        md5_checksum: str,
    ):
        file = File(
            user=user,
            parent=parent,
            file_id=file_id,
            file_name=file_name,
            file_size=file_size,
            part_size=part_size,
            total_parts=total_parts,
            md5_checksum=md5_checksum,
        )
        file.save()
        return file

    @classmethod
    def list(self, user: User, parent: Folder, offset: int, limit: int):
        where = "WHERE user_id = {} AND parent_id is NULL".format(user.id)
        if parent is not None:
            where = "WHERE user_id = {} AND parent_id = {}".format(user.id, parent.id)

        return self.objects.raw("SELECT * FROM folders {} LIMIT {} OFFSET {}".format(where, limit, offset))

    def update(self, parent: Folder, file_name: str):
        self.parent = parent
        self.file_name = file_name
        self.save()

    def get_unique_name(self):
        return str(self.id) + "-" + str(self.file_id) + os.path.splitext(self.file_name)[-1]

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
            raise RuntimeError("Failed to upload part {} for file {}".format(file_part, self.id))

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
            binary_thumbnail = td_client().download_media(message=message, file=bytes, thumb=0)  # Smallest thumbnail

            self.binary_message = bytes(message)
            self.binary_thumbnail = binary_thumbnail

            self.save()

    def download_range(self, start: int, end: int):
        range_length = end - start + 1

        request_size = range_length
        if request_size % MIN_CHUNK_SIZE != 0:
            request_size += MIN_CHUNK_SIZE - (request_size % MIN_CHUNK_SIZE)

        bytes_io = io.BytesIO()

        for chunk in td_client().iter_download(
            file=self.message,
            offset=start,
            limit=1,
            request_size=request_size,
            file_size=self.file_size,
        ):
            bytes_io.write(chunk)

        bytes_io.flush()
        bytes_io.truncate(range_length)
        byte_ranges = bytes_io.getvalue()
        bytes_io.close()

        return byte_ranges
