from datetime import datetime

from django.db import transaction
from django.utils import timezone

from auth.models import InvalidToken, User
from auth.tokens import generate_user_token
from auth.validators import validate_sign_in_request
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.request import Request
from rest_framework.response import Response

from api.views import api_success


@api_view(["POST"])
@authentication_classes([])
@transaction.atomic
def sign_in(request: Request) -> Response:
    request_data = request.data
    validate_sign_in_request(request_data)

    user = User.find_by_telegram_id(telegram_id=request_data["id"])
    if user is None:
        user = User.create(
            telegram_id=request_data["id"],
            first_name=request_data["first_name"],
            last_name=request_data["last_name"],
            username=request_data["username"],
            photo_url=request_data["photo_url"],
        )
    else:
        user.update(
            first_name=request_data["first_name"],
            last_name=request_data["last_name"],
            username=request_data["username"],
            photo_url=request_data["photo_url"],
        )

    jwt_token, expire_at = generate_user_token(user)

    response = {"jwt_token": jwt_token, "expire_at": expire_at}
    return api_success(response)


@api_view(["POST"])
@transaction.atomic
def sign_out(request: Request) -> Response:
    token_id = request.auth["jti"]
    expire_at = datetime.fromtimestamp(request.auth["exp"]).replace(tzinfo=timezone.get_current_timezone())

    InvalidToken.create(token_id, request.user, InvalidToken.REASON_SIGN_OUT, expire_at)

    return api_success({})
