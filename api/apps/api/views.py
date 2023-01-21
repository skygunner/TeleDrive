import logging

from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.exceptions import APIException
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import exception_handler as original_exception_handler

logger = logging.getLogger(__name__)


@api_view(["GET"])
@authentication_classes([])
def health(request: Request) -> Response:
    from tdlib.wrapper import TD_CLIENT

    TD_CLIENT.get_me()  # Check TD_CLIENT health

    return api_success({})


def api_success(data, status_code: int = status.HTTP_200_OK, headers=None) -> Response:
    data = {
        "status": "SUCCESS",
        "status_code": status_code,
        "data": data,
    }

    return Response(data=data, status=status_code, headers=headers)


def api_error(details, status_code: int, headers=None) -> Response:
    if not isinstance(details, list):
        details = [details]

    data = {
        "status": "ERROR",
        "status_code": status_code,
        "details": details,
    }

    return Response(data=data, status=status_code, headers=headers)


def exception_handler(exception, context) -> Response:
    response = original_exception_handler(exception, context)

    if response is None:
        logger.error("unhandled exception", exc_info=True)
        return exception_handler(APIException(), context)

    details = response.data

    if isinstance(response.data, dict) and "detail" in response.data:
        if isinstance(response.data["detail"], list):
            details = response.data["detail"]
        elif isinstance(response.data["detail"], str):
            details = [response.data["detail"]]

    if not isinstance(details, list):
        logger.warning(f"invalid error details: {details}")
        details = []

    return api_error(details=details, status_code=response.status_code)
