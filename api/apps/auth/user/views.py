from django.db import transaction

from auth.user.serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from api.views import api_success


@api_view(["GET"])
@transaction.atomic
def get_user(request: Request) -> Response:
    return api_success(UserSerializer(request.user).data)
