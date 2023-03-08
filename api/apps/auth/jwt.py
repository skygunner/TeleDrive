from calendar import timegm
from datetime import timedelta
from typing import Tuple

from django.conf import settings
from django.utils import timezone

import jwt
from auth.models import InvalidToken, User
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from utils.models import make_uuid


def generate_user_token(user: User) -> Tuple[str, int]:
    now = timezone.now()
    exp = now + timedelta(hours=settings.JWT_TOKEN_EXP_HOURS)
    unix_exp = timegm(exp.utctimetuple())

    payload = {
        "iat": now,
        "exp": exp,
        "uid": user.id,
        "jti": make_uuid(),
        "iss": "https://teledrive.io",
    }
    headers = {
        "kid": settings.JWT_TOKEN_KEY_ID,
    }

    return jwt.encode(payload=payload, key=settings.JWT_TOKEN_KEY, algorithm="HS512", headers=headers), unix_exp


class JWTTokenAuthentication(BaseAuthentication):
    bearer = "Bearer"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or len(auth) != 2 or auth[0].decode().lower() != self.bearer.lower():
            raise AuthenticationFailed()

        try:
            payload = jwt.decode(jwt=auth[1].decode(), key=settings.JWT_TOKEN_KEY, algorithms=["HS512"])
        except jwt.InvalidTokenError:
            raise AuthenticationFailed()

        invalid_token = InvalidToken.find_by_token_id(payload["jti"])
        if invalid_token is not None:
            raise AuthenticationFailed()

        user = User.find_by_id(payload["uid"])
        if user is None:
            raise AuthenticationFailed()

        return (user, payload)

    def authenticate_header(self, request):
        return self.bearer
