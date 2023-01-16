from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import transaction
from django.utils.translation import gettext as _

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.request import Request
from rest_framework.response import Response
from tdlib.models import File
from telethon.helpers import generate_random_long
from utils.validators import is_integer

from api.views import api_error, api_success


@api_view(["POST"])
@parser_classes([FileUploadParser])
@transaction.atomic
def upload(request: Request) -> Response:
    request_data = request.query_params

    file_id = request_data.get("file_id", None)

    file_part = request_data.get("file_part", None)
    if file_part is None or not is_integer(file_part) or not int(file_part) > 0:
        return api_error(_("Invalid file_part"), status.HTTP_400_BAD_REQUEST)
    file_part = int(file_part)

    file_obj = request.data.get("file", None)
    if file_obj is None or not isinstance(file_obj, InMemoryUploadedFile):
        return api_error(_("Invalid file object"), status.HTTP_400_BAD_REQUEST)

    if file_part == 1:
        total_parts = request_data.get("total_parts", None)
        if total_parts is None or not is_integer(total_parts) or not int(total_parts) > 0:
            return api_error(_("Invalid total_parts"), status.HTTP_400_BAD_REQUEST)
        total_parts = int(total_parts)

        if file_obj.name is None:
            return api_error(_("Invalid filename"), status.HTTP_400_BAD_REQUEST)

        file_size = request_data.get("file_size", None)
        if file_size is None or not is_integer(file_size) or not int(file_size) > 0:
            return api_error(_("Invalid file_size"), status.HTTP_400_BAD_REQUEST)
        file_size = int(file_size)
        if file_size > 2 * 1024 * 1024 * 1024:  # 2GB
            return api_error(_("file_size must be less or equal to 2GB"), status.HTTP_400_BAD_REQUEST)

        part_size = file_obj.size
        if file_part != total_parts:
            if part_size % 1024 != 0:
                return api_error(_("The file part size must be evenly divisible by 1024"), status.HTTP_400_BAD_REQUEST)
            if part_size / 1024 > 512:
                return api_error(_("The file part size must be less or equal to 512KB"), status.HTTP_400_BAD_REQUEST)

            calculated_total_parts = (file_size + part_size - 1) / part_size
            if total_parts != calculated_total_parts:
                return api_error(
                    _("total_parts must be {}".format(calculated_total_parts)), status.HTTP_400_BAD_REQUEST
                )
        else:
            if file_size != part_size:
                return api_error(
                    _("Provided file_size is not equal to the actual file size"), status.HTTP_400_BAD_REQUEST
                )

        generated_file_id = generate_random_long()
        file_id = generated_file_id

        file = File.create(
            user=request.user,
            file_id=file_id,
            file_name=file_obj.name,
            file_size=file_size,
            part_size=part_size,
            total_parts=total_parts,
        )

    if file_id is None or not is_integer(file_id):
        return api_error(_("Invalid file_id"), status.HTTP_400_BAD_REQUEST)
    file_id = int(file_id)

    file = File.find_by_user_and_id(user=request.user, file_id=file_id)
    if file is None:
        return api_error(_("file_id not found."), status.HTTP_404_NOT_FOUND)

    if file_part != file.last_uploaded_part + 1:
        return api_error(
            _("You must upload part {} now".format(file.last_uploaded_part + 1)), status.HTTP_400_BAD_REQUEST
        )

    file.upload_part(file_obj.file.read(), file_part)

    return api_success({})


@api_view(["GET"])
@transaction.atomic
def download(request: Request, file_id: int) -> Response:
    pass
