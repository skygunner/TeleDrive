import base64
import logging
import os
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone

import jwt
from auth.models import User
from simple_history.models import HistoricalRecords
from telethon.extensions import BinaryReader
from telethon.tl import functions, types
from utils.models import BaseModelMixin, make_uuid

logger = logging.getLogger(__name__)


class Folder(BaseModelMixin):
    history = HistoricalRecords(table_name="historical_folders", custom_model_name="HistoricalFolder", app="tdlib")

    user = models.ForeignKey(to=User, to_field="id", db_column="user_id", on_delete=models.CASCADE, db_index=True)
    parent = models.ForeignKey(
        to="self", to_field="id", db_column="parent_id", on_delete=models.CASCADE, null=True, blank=True, db_index=True
    )
    folder_name = models.CharField(max_length=255, db_index=True)

    class Meta:
        db_table = "folders"

    @property
    def breadcrumb(self):
        folder = self
        breadcrumb = []
        while folder:
            breadcrumb.append({"folder_id": str(folder.id), "folder_name": folder.folder_name})
            folder = folder.parent
        breadcrumb.append({"folder_id": None, "folder_name": None})
        breadcrumb.reverse()
        return breadcrumb

    @classmethod
    def find_by_user_and_id(self, user: User, id: str):
        return self.objects.filter(user=user, id=id).first()

    @classmethod
    def create(self, user: User, parent: "Folder", folder_name: str):
        folder = Folder(user=user, parent=parent, folder_name=folder_name)
        folder.save()
        return folder

    @classmethod
    def list(self, user: User, parent: "Folder", offset: int, limit: int):
        where = "WHERE user_id = {} AND parent_id IS NULL AND deleted_at IS NULL".format(user.id)
        if parent is not None:
            where = "WHERE user_id = {} AND parent_id = {} AND deleted_at IS NULL".format(user.id, parent.id)

        return self.objects.raw(
            "SELECT * FROM folders {} ORDER BY created_at DESC LIMIT {} OFFSET {}".format(where, limit, offset)
        )

    def update(self, parent: "Folder", folder_name: str):
        self.parent = parent
        self.folder_name = folder_name
        self.save()

    def delete(self, delete_from_telegram_chat: bool):
        folders = Folder.objects.filter(parent=self)
        for folder in folders:
            folder.delete(delete_from_telegram_chat=delete_from_telegram_chat)

        files = File.objects.filter(parent=self)
        for file in files:
            file.delete(delete_from_telegram_chat=delete_from_telegram_chat)

        return super().delete()


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
    uploaded_at = models.DateTimeField(null=True, blank=True, db_index=True)

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

    @property
    def is_uploaded(self):
        return self.uploaded_at is not None

    @property
    def file_token(self):
        if not self.is_uploaded:
            return None

        now = timezone.now()
        exp = now + timedelta(hours=settings.FILE_TOKEN_EXP_HOURS)

        payload = {
            "iat": now,
            "exp": exp,
            "jti": make_uuid(),
            "uid": self.user.id,
            "fid": self.file_id,
            "scope": "user/Consent.read",
            "iss": "https://teledrive.io",
        }
        headers = {
            "kid": settings.FILE_TOKEN_KEY_ID,
        }

        return jwt.encode(payload=payload, key=settings.FILE_TOKEN_KEY, algorithm="HS256", headers=headers)

    def delete(self, delete_from_telegram_chat: bool):
        from tdlib.wrapper import TD_CLIENT

        if delete_from_telegram_chat:
            try:
                TD_CLIENT.delete_messages(entity=self.user.id, message_ids=self.message, revoke=True)
            except Exception as exp:
                logger.error("Filed to delete file from Telegram chat: %s", exp)

        return super().delete()

    @classmethod
    def find_by_user_and_id(self, user: User, file_id: str):
        return self.objects.filter(user=user, file_id=file_id).first()

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
        where = "WHERE user_id = {} AND parent_id IS NULL AND uploaded_at IS NOT NULL AND deleted_at IS NULL".format(
            user.id
        )
        if parent is not None:
            where = "WHERE user_id = {} AND parent_id = {} AND uploaded_at IS NOT NULL AND deleted_at IS NULL".format(
                user.id, parent.id
            )

        return self.objects.raw(
            "SELECT * FROM files {} ORDER BY uploaded_at DESC LIMIT {} OFFSET {}".format(where, limit, offset)
        )

    def update(self, parent: Folder, file_name: str):
        self.parent = parent
        self.file_name = file_name
        self.save()

    def get_telegram_name(self):
        extension = os.path.splitext(self.file_name)[-1]
        if extension:
            return str(self.file_id) + extension
        return str(self.file_id)

    def upload_part(self, file_bytes: bytes, file_part: int):
        from tdlib.wrapper import TD_CLIENT

        is_big = self.file_size > 10 * 1024 * 1024  # 10 MiB
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

        result = TD_CLIENT(request)
        if not result:
            raise RuntimeError("Failed to upload part {} for file {}".format(file_part, self.id))

        self.last_uploaded_part = file_part
        self.save()

        if self.last_uploaded_part == self.total_parts:
            if is_big:
                input_file = types.InputFileBig(id=self.file_id, parts=self.total_parts, name=self.get_telegram_name())
            else:
                input_file = types.InputFile(
                    id=self.file_id,
                    parts=self.total_parts,
                    name=self.get_telegram_name(),
                    md5_checksum=self.md5_checksum,
                )

            message = TD_CLIENT.send_file(
                entity=self.user.id, file=input_file, force_document=True, file_size=self.file_size, silent=True
            )

            binary_thumbnail = None
            if message.media.document.thumbs is not None and len(message.media.document.thumbs) > 0:
                binary_thumbnail = TD_CLIENT.download_media(message=message, file=bytes, thumb=0)  # Smallest thumbnail

            self.binary_message = bytes(message)
            self.binary_thumbnail = binary_thumbnail
            self.uploaded_at = timezone.now()

            self.save()

    def download_iter(self, start: int, end: int):
        from tdlib.wrapper import TD_CLIENT

        request_size = end - start + 1
        yielded_size = 0

        for chunk in TD_CLIENT.iter_download(file=self.message, offset=start):
            chunk_len = len(chunk)
            if chunk_len + yielded_size > request_size:
                chunk = chunk[: request_size - yielded_size]
                yield chunk
                break

            yielded_size += chunk_len
            yield chunk


class ShortURL(BaseModelMixin):
    REASON_SHARE_FILE = "ShareFile"
    REASONS = ((REASON_SHARE_FILE, REASON_SHARE_FILE),)

    share_token = models.CharField(primary_key=True, max_length=255)
    file = models.ForeignKey(
        to=File, to_field="id", db_column="file_id", on_delete=models.CASCADE, null=True, blank=True
    )
    folder = models.ForeignKey(
        to=Folder, to_field="id", db_column="folder_id", on_delete=models.CASCADE, null=True, blank=True
    )
    reason = models.CharField(max_length=255, choices=REASONS)
    expire_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "short_urls"

    @classmethod
    def create_file_share_token(self, file: File, expire_at: any):
        short_url = ShortURL(share_token=make_uuid(), file=file, reason=self.REASON_SHARE_FILE, expire_at=expire_at)
        short_url.save()
        return short_url.share_token

    @classmethod
    def find_by_share_token(self, share_token: str):
        return self.objects.filter(share_token=share_token).first()
