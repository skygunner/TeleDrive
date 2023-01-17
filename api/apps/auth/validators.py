import hashlib
import hmac
import time

from django.conf import settings
from django.utils.translation import gettext as _

from utils.validators import request_validator


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
