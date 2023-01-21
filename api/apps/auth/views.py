import hashlib
import hmac
import time
from datetime import datetime

from django.conf import settings
from django.db import transaction
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.translation import gettext as _

from auth.jwt import generate_user_token
from auth.models import InvalidToken, User
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.request import Request
from rest_framework.response import Response
from utils.views import request_validator

from api.views import api_success


@request_validator
def validate_sign_in_request(errors, request_data):
    request_data = request_data.copy()

    received_hash = request_data["hash"]
    auth_date = request_data["auth_date"]

    request_data.pop("hash", None)
    request_data_alphabetical_order = sorted(request_data.items(), key=lambda x: x[0])

    data_check_string = []

    for data_pair in request_data_alphabetical_order:
        key, value = data_pair[0], data_pair[1]
        data_check_string.append(key + "=" + str(value))

    data_check_string = "\n".join(data_check_string)

    secret_key = hashlib.sha256(settings.TELEGRAM_BOT_TOKEN.encode()).digest()
    _hash = hmac.new(secret_key, msg=data_check_string.encode(), digestmod=hashlib.sha256).hexdigest()

    unix_time_now = int(time.time())
    unix_time_auth_date = int(auth_date)

    if unix_time_now - unix_time_auth_date > 24 * 60 ^ 60:
        errors.append(_("The authentication data is from more than a day ago."))

    if _hash != received_hash:
        errors.append(_("The authentication data is not related to the Telegram user!"))


@api_view(["POST"])
@authentication_classes([])
@transaction.atomic
def sign_in(request: Request) -> Response:
    from tdlib.wrapper import TD_CLIENT

    request_data = request.data
    validate_sign_in_request(request_data)

    user = User.find_by_id(id=request_data["id"])
    if user is None:
        user = User.create(
            id=request_data["id"],
            first_name=request_data["first_name"],
            last_name=request_data["last_name"],
            username=request_data["username"],
        )

        welcome_message = render_to_string(template_name="welcome.txt")
        TD_CLIENT.send_message(entity=user.id, message=welcome_message)
    else:
        user.update(
            first_name=request_data["first_name"],
            last_name=request_data["last_name"],
            username=request_data["username"],
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
