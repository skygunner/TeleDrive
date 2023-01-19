import base64

from django.db import transaction

from auth.user.serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from tdlib.wrapper import td_client

from api.views import api_success


@api_view(["GET"])
@transaction.atomic
def get_user(request: Request) -> Response:
    user_entity = td_client().get_entity(request.user.id)
    photo_bytes = td_client().download_profile_photo(entity=user_entity, file=bytes)
    photo_url = "data:image/jpg;base64,{}".format(base64.b64encode(photo_bytes).decode("UTF-8"))

    request.user.update(
        first_name=user_entity.first_name,
        last_name=user_entity.last_name,
        username=user_entity.username,
        photo_url=photo_url,
    )

    return api_success(UserSerializer(request.user).data)
