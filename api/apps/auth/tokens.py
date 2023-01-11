from datetime import timedelta

from django.conf import settings
from django.utils import timezone

import jwt
from auth.models import InvalidToken, User
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from utils.models import make_uuid


def generate_user_refresh_token(user: User) -> str:
    now = timezone.now()
    exp = now + timedelta(hours=settings.JWT_REFRESH_TOKEN_EXP_HOURS)

    payload = {
        "iat": now,
        "exp": exp,
        "jti": make_uuid(),
        "uid": user.id,
    }
    headers = {
        "kid": settings.JWT_REFRESH_TOKEN_KEY_ID,
    }

    return jwt.encode(payload=payload, key=settings.JWT_REFRESH_TOKEN_KEY, algorithm="HS512", headers=headers)


def generate_user_access_token(refresh_token: str) -> str:
    refresh_token_payload = jwt.decode(refresh_token, options={"verify_signature": False})

    now = timezone.now()
    exp = now + timedelta(hours=settings.JWT_ACCESS_TOKEN_EXP_HOURS)

    payload = {
        "iat": now,
        "exp": exp,
        "jti": make_uuid(),
        "uid": refresh_token_payload["uid"],
        "rti": refresh_token_payload["jti"],
    }
    headers = {
        "kid": settings.JWT_ACCESS_TOKEN_KEY_ID,
    }

    return jwt.encode(payload=payload, key=settings.JWT_ACCESS_TOKEN_KEY, algorithm="HS256", headers=headers)


class JWTRefreshTokenAuthentication(BaseAuthentication):
    bearer = "Bearer"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or len(auth) != 2 or auth[0].decode().lower() != self.bearer.lower():
            raise AuthenticationFailed()

        try:
            payload = jwt.decode(jwt=auth[1].decode(), key=settings.JWT_REFRESH_TOKEN_KEY, algorithms=["HS512"])
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


class JWTAccessTokenAuthentication(BaseAuthentication):
    bearer = "Bearer"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        if not auth or len(auth) != 2 or auth[0].decode().lower() != self.bearer.lower():
            raise AuthenticationFailed()

        try:
            payload = jwt.decode(jwt=auth[1].decode(), key=settings.JWT_ACCESS_TOKEN_KEY, algorithms=["HS256"])
        except jwt.InvalidTokenError:
            raise AuthenticationFailed()

        invalid_token = InvalidToken.find_by_token_id(payload["rti"])
        if invalid_token is not None:
            raise AuthenticationFailed()

        user = User.find_by_id(payload["uid"])
        if user is None:
            raise AuthenticationFailed()

        return (user, payload)

    def authenticate_header(self, request):
        return self.bearer
