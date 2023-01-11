from datetime import datetime

from django.db import transaction
from django.utils import timezone

from auth.models import InvalidToken
from auth.tokens import JWTRefreshTokenAuthentication, generate_user_access_token
from auth.validators import validate_sign_in_request
from rest_framework.authentication import get_authorization_header
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

    response = {"refresh_token": "refresh_token", "access_token": "access_token"}
    return api_success(response)


@api_view(["GET"])
@authentication_classes([JWTRefreshTokenAuthentication])
@transaction.atomic
def refresh_access_token(request: Request) -> Response:
    auth = get_authorization_header(request).split()
    refresh_token = auth[1].decode()
    access_token = generate_user_access_token(refresh_token)

    response = {"access_token": access_token}
    return api_success(response)


@api_view(["POST"])
@authentication_classes([JWTRefreshTokenAuthentication])
@transaction.atomic
def sign_out(request: Request) -> Response:
    token_id = request.auth["jti"]
    expire_at = datetime.fromtimestamp(request.auth["exp"]).replace(tzinfo=timezone.get_current_timezone())

    InvalidToken.create(token_id, request.user, InvalidToken.REASON_SIGN_OUT, expire_at)

    return api_success({})
