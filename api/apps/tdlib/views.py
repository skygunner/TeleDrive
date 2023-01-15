from django.db import transaction

from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response


@api_view(["POST"])
@transaction.atomic
def upload(request: Request) -> Response:
    pass


@api_view(["GET"])
@transaction.atomic
def download(request: Request, file_id: int) -> Response:
    print(file_id)
    pass
