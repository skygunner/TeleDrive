import os
import re

from django.core.files.uploadedfile import UploadedFile
from django.db import transaction
from django.http import HttpResponse
from django.utils.http import quote_etag
from django.utils.translation import gettext as _

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.request import Request
from rest_framework.response import Response
from tdlib.models import File, Folder
from tdlib.serializers import FileSerializer, FolderSerializer
from utils.views import is_integer, request_validator

from api.views import api_error, api_success

range_re = re.compile(r"bytes\s*=\s*(\d+)\s*-\s*(\d*)", re.I)


@request_validator
def validate_list_request(errors, request_data):
    offset = request_data.get("offset", 0)
    if offset is not None and (not is_integer(offset) or int(offset) < 0):
        errors.append(_("Invalid offset."))

    limit = request_data.get("limit", 20)
    if limit is not None and (not is_integer(limit) or int(limit) < 1 or int(limit) > 100):
        errors.append(_("Invalid limit."))

    parent_id = request_data.get("parent_id", None)
    if parent_id is not None and (not is_integer(parent_id) or int(parent_id) < 1):
        errors.append(_("Invalid parent_id."))


@api_view(["GET"])
@transaction.atomic
def list_folders(request: Request) -> Response:
    request_data = request.query_params
    validate_list_request(request_data)

    offset = int(request_data.get("offset", 0))
    limit = int(request_data.get("limit", 20))
    parent_id = request_data.get("parent_id", None)

    parent = None
    if parent_id is not None:
        parent = Folder.find_by_user_and_id(user=request.user, id=int(parent_id))
        if parent is None:
            return api_error(_("Parent folder not found."), status.HTTP_404_NOT_FOUND)

    results = []

    folders = Folder.list(user=request.user, parent=parent, offset=offset, limit=limit)
    for folder in folders:
        results.append(FolderSerializer(folder).data)

    return api_success(results)


@api_view(["GET"])
@transaction.atomic
def list_files(request: Request) -> Response:
    request_data = request.query_params
    validate_list_request(request_data)

    offset = int(request_data.get("offset", 0))
    limit = int(request_data.get("limit", 20))
    parent_id = request_data.get("parent_id", None)

    parent = None
    if parent_id is not None:
        parent = Folder.find_by_user_and_id(user=request.user, id=int(parent_id))
        if parent is None:
            return api_error(_("Parent folder not found."), status.HTTP_404_NOT_FOUND)

    results = []

    files = File.list(user=request.user, parent=parent, offset=offset, limit=limit)
    for file in files:
        results.append(FileSerializer(file).data)

    return api_success(results)


@request_validator
def validate_create_folder_request(errors, request_data):
    folder_name = request_data.get("folder_name", None)
    parent_id = request_data.get("parent_id", None)

    if not isinstance(folder_name, str) or len(folder_name) < 3 or len(folder_name) > 255:
        errors.append(_("Invalid folder_name."))

    if parent_id is not None and (not isinstance(parent_id, int) or parent_id < 1):
        errors.append(_("Invalid parent_id."))


@api_view(["POST"])
@transaction.atomic
def create_folder(request: Request) -> Response:
    request_data = request.data
    validate_create_folder_request(request_data)

    folder_name = request_data["folder_name"]
    parent_id = request_data.get("parent_id", None)

    parent = None
    if parent_id is not None:
        parent = Folder.find_by_user_and_id(user=request.user, id=parent_id)
        if parent is None:
            return api_error(_("Parent folder not found."), status.HTTP_404_NOT_FOUND)

    folder = Folder.create(user=request.user, parent=parent, folder_name=folder_name)

    return api_success(FolderSerializer(folder).data)


@api_view(["PUT", "DELETE"])
@transaction.atomic
def ud_folder(request: Request, folder_id: int) -> Response:
    if request.method == "PUT":
        return update_folder(request=request, folder_id=folder_id)
    elif request.method == "DELETE":
        return delete_folder(request=request, folder_id=folder_id)


@request_validator
def validate_update_folder_request(errors, request_data):
    folder_id = request_data.get("folder_id", None)
    folder_name = request_data.get("folder_name", None)
    parent_id = request_data.get("parent_id", None)

    if folder_id is None or not isinstance(folder_id, int) or folder_id < 1:
        errors.append(_("Invalid folder_id."))

    if not isinstance(folder_name, str) or len(folder_name) < 3 or len(folder_name) > 255:
        errors.append(_("Invalid folder_name."))

    if parent_id is not None and (not isinstance(parent_id, int) or parent_id < 1):
        errors.append(_("Invalid parent_id."))


def update_folder(request: Request, folder_id: int) -> Response:
    request_data = request.data
    request_data["folder_id"] = folder_id
    validate_update_folder_request(request_data)

    folder_name = request_data["folder_name"]
    parent_id = request_data.get("parent_id", None)

    folder = Folder.find_by_user_and_id(user=request.user, id=folder_id)
    if folder is None:
        return api_error(_("folder_id not found."), status.HTTP_404_NOT_FOUND)

    parent = None
    if parent_id is not None:
        parent = Folder.find_by_user_and_id(user=request.user, id=parent_id)
        if parent is None:
            return api_error(_("Parent folder not found."), status.HTTP_404_NOT_FOUND)

    folder.update(parent=parent, folder_name=folder_name)

    return api_success(FolderSerializer(folder).data)


def delete_folder(request: Request, folder_id: int) -> Response:
    if folder_id is None or not isinstance(folder_id, int) or folder_id < 1:
        return api_error(_("Invalid folder_id."), status.HTTP_400_BAD_REQUEST)

    folder = Folder.find_by_user_and_id(user=request.user, id=folder_id)
    if folder is None:
        return api_error(_("folder_id not found."), status.HTTP_404_NOT_FOUND)

    folder.delete()

    return api_success({})


@api_view(["PUT", "DELETE"])
@transaction.atomic
def ud_file(request: Request, file_id: int) -> Response:
    if request.method == "PUT":
        return update_file(request=request, file_id=file_id)
    elif request.method == "DELETE":
        return delete_file(request=request, file_id=file_id)


@request_validator
def validate_update_file_request(errors, request_data):
    file_id = request_data.get("file_id", None)
    file_name = request_data.get("file_name", None)
    parent_id = request_data.get("parent_id", None)

    if file_id is None or not isinstance(file_id, int) or file_id < 1:
        errors.append(_("Invalid file_id."))

    if (
        not isinstance(file_name, str)
        or len(file_name) < 3
        or len(file_name) > 255
        or not os.path.splitext(file_name)[-1]
    ):
        errors.append(_("Invalid file_name."))

    if parent_id is not None and (not isinstance(parent_id, int) or parent_id < 1):
        errors.append(_("Invalid parent_id."))


def update_file(request: Request, file_id: int) -> Response:
    request_data = request.data
    request_data["file_id"] = file_id
    validate_update_file_request(request_data)

    file_name = request_data["file_name"]
    parent_id = request_data.get("parent_id", None)

    file = File.find_by_user_and_id(user=request.user, file_id=file_id)
    if file is None or file.binary_message is None:
        return api_error(_("file_id not found."), status.HTTP_404_NOT_FOUND)

    parent = None
    if parent_id is not None:
        parent = Folder.find_by_user_and_id(user=request.user, id=parent_id)
        if parent is None:
            return api_error(_("Parent folder not found."), status.HTTP_404_NOT_FOUND)

    file.update(parent=parent, file_name=file_name)

    return api_success(FileSerializer(file).data)


def delete_file(request: Request, file_id: int) -> Response:
    if file_id is None or not isinstance(file_id, int) or file_id < 1:
        return api_error(_("Invalid file_id."), status.HTTP_400_BAD_REQUEST)

    file = File.find_by_user_and_id(user=request.user, file_id=file_id)
    if file is None or file.binary_message is None:
        return api_error(_("file_id not found."), status.HTTP_404_NOT_FOUND)

    file.delete()

    return api_success({})


@api_view(["POST"])
@parser_classes([FileUploadParser])
@transaction.atomic
def upload(request: Request) -> Response:
    file_id = None
    request_data = request.query_params

    file_part = request_data.get("file_part", None)
    if file_part is None or not is_integer(file_part) or int(file_part) < 1:
        return api_error(_("Invalid file_part."), status.HTTP_400_BAD_REQUEST)
    file_part = int(file_part)

    file_obj = request.data.get("file", None)
    if file_obj is None or not isinstance(file_obj, UploadedFile):
        return api_error(_("Invalid file object."), status.HTTP_400_BAD_REQUEST)

    if file_part == 1:
        total_parts = request_data.get("total_parts", None)
        if total_parts is None or not is_integer(total_parts) or int(total_parts) < 1:
            return api_error(_("Invalid total_parts."), status.HTTP_400_BAD_REQUEST)
        total_parts = int(total_parts)

        file_size = request_data.get("file_size", None)
        if file_size is None or not is_integer(file_size) or int(file_size) < 1:
            return api_error(_("Invalid file_size."), status.HTTP_400_BAD_REQUEST)
        file_size = int(file_size)
        if file_size > 2 * 1024 * 1024 * 1024:  # 2GB
            return api_error(_("The file size must be less or equal to 2 GB."), status.HTTP_400_BAD_REQUEST)

        part_size = file_obj.size
        if part_size / 1024 > 512:
            return api_error(_("The file part size must be less or equal to 512 KB."), status.HTTP_400_BAD_REQUEST)

        if file_part != total_parts:
            if part_size % 1024 != 0:
                return api_error(_("The file part size must be evenly divisible by 1024."), status.HTTP_400_BAD_REQUEST)

            if file_size <= part_size:
                return api_error(_("Invalid file_size."), status.HTTP_400_BAD_REQUEST)

            calculated_total_parts = (file_size + part_size - 1) // part_size
            if total_parts != calculated_total_parts:
                return api_error(
                    _("total_parts must be {}.".format(calculated_total_parts)), status.HTTP_400_BAD_REQUEST
                )
        else:
            if file_size != part_size:
                return api_error(
                    _("Provided file_size is not equal to the actual file size."), status.HTTP_400_BAD_REQUEST
                )

        md5_checksum = request_data.get("md5_checksum", None)
        if md5_checksum is None or not re.findall(r"([a-fA-F\d]{32})", md5_checksum):
            return api_error(_("Invalid md5_checksum."), status.HTTP_400_BAD_REQUEST)

        parent = None
        parent_id = request_data.get("parent_id", None)
        if parent_id is not None:
            if not is_integer(parent_id) or int(parent_id) < 1:
                return api_error(_("Invalid parent."), status.HTTP_400_BAD_REQUEST)

            parent = Folder.find_by_user_and_id(user=request.user, id=parent_id)
            if parent is None:
                return api_error(_("Parent folder not found."), status.HTTP_404_NOT_FOUND)

        if file_obj.name is None or not os.path.splitext(file_obj.name)[-1]:
            return api_error(_("Invalid file name."), status.HTTP_400_BAD_REQUEST)

        file_id = int.from_bytes(os.urandom(7), signed=False, byteorder="little")

        file = File.create(
            user=request.user,
            parent=parent,
            file_id=file_id,
            file_name=file_obj.name,
            file_size=file_size,
            part_size=part_size,
            total_parts=total_parts,
            md5_checksum=md5_checksum,
        )

    file_id = file_id or request_data.get("file_id", None)
    if file_id is None or not is_integer(file_id) or int(file_id) < 1:
        return api_error(_("Invalid file_id."), status.HTTP_400_BAD_REQUEST)
    file_id = int(file_id)

    file = File.find_by_user_and_id(user=request.user, file_id=file_id)
    if file is None:
        return api_error(_("file_id not found."), status.HTTP_404_NOT_FOUND)

    if file.last_uploaded_part == file.total_parts:
        return api_error(
            _("File with id {} successfully uploaded before.".format(file.file_id)), status.HTTP_400_BAD_REQUEST
        )

    if file_obj.name is None or file_obj.name != file.file_name:
        return api_error(_("Invalid file name."), status.HTTP_400_BAD_REQUEST)

    if file_part != file.last_uploaded_part + 1:
        return api_error(
            _("You must upload part {} now.".format(file.last_uploaded_part + 1)), status.HTTP_400_BAD_REQUEST
        )

    if file_part < file.total_parts and file_obj.size != file.part_size:
        return api_error(
            _("The file part size must be equal to {} KB.".format(file.part_size // 1024)), status.HTTP_400_BAD_REQUEST
        )

    if file_part == file.total_parts and file_obj.size > file.part_size:
        return api_error(
            _("The file part size must be less or equal to {} KB.".format(file.part_size // 1024)),
            status.HTTP_400_BAD_REQUEST,
        )

    file.upload_part(file_bytes=file_obj.file.read(), file_part=file_part)

    return api_success(FileSerializer(file).data)


@api_view(["GET"])
# @api_view(["OPTIONS", "HEAD", "GET"])
@transaction.atomic
def download(request: Request, file_id: int) -> Response:
    file = File.find_by_user_and_id(user=request.user, file_id=file_id)
    if file is None or file.binary_message is None:
        return api_error(_("file_id not found."), status.HTTP_404_NOT_FOUND)

    etag = quote_etag(str(file.file_id))

    def add_headers(response, content_length, content_range=None):
        response["Accept-Ranges"] = "bytes"
        response["Cache-Control"] = "public, max-age=604800"
        response["Content-Disposition"] = 'attachment; filename="{}"'.format(file.file_name)
        if request.method != "OPTIONS":
            response["Content-Length"] = content_length
        if content_range is not None:
            response["Content-Range"] = content_range
        response["Content-Type"] = file.mime_type
        response["ETag"] = etag

    if request.method != "GET":
        response = HttpResponse(status=status.HTTP_200_OK)
        add_headers(response=response, content_length=file.file_size)
        return response

    start = 0
    end = file.file_size - 1
    status_code = status.HTTP_200_OK

    if_range = request.META.get("HTTP_IF_RANGE", "").strip()
    if not if_range or if_range == etag:
        rage = request.META.get("HTTP_RANGE", "").strip()
        range_match = range_re.match(rage)
        if range_match:
            start, end = range_match.groups()
            start = int(start) if start else 0
            end = int(end) if end else file.file_size - 1
            if end >= file.file_size:
                end = file.file_size - 1

            if start > end:
                return api_error(_("Invalid Range header."), status.HTTP_416_REQUESTED_RANGE_NOT_SATISFIABLE)

            # Check compatibility
            if end - start + 1 > 1 * 1024 * 1024:  # 1MB
                headers = {"Accept-Ranges": "bytes"}
                return api_error(
                    _("Range length must be less or equal to 1 MB."),
                    status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    headers,
                )

            status_code = status.HTTP_206_PARTIAL_CONTENT

    # Check compatibility
    if status_code == status.HTTP_200_OK and file.file_size > 1 * 1024 * 1024:  # 1MB
        headers = {"Accept-Ranges": "bytes"}
        return api_error(
            _("The requested file is too big. Please use range request instead."),
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            headers,
        )

    byte_ranges = file.download_range(start=start, end=end)

    response = HttpResponse(content=byte_ranges, status=status_code)
    add_headers(
        response=response,
        content_length=len(byte_ranges),
        content_range="bytes {}-{}/{}".format(start, end, file.file_size),
    )
    return response
