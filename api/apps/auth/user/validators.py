from django.conf import settings
from django.utils.translation import gettext as _

from auth.passwords import is_valid_password
from utils.validators import request_validator


@request_validator
def validate_update_user_request(errors, request_data):
    first_name = request_data.get("first_name", None)
    last_name = request_data.get("last_name", None)

    if not isinstance(first_name, str) or len(first_name) < 3 or len(first_name) > settings.VARCHAR_LENGTH_LIMIT:
        errors.append(_("Invalid first name."))

    if not isinstance(last_name, str) or len(last_name) < 3 or len(last_name) > settings.VARCHAR_LENGTH_LIMIT:
        errors.append(_("Invalid first name."))


@request_validator
def validate_change_password_request(errors, request_data):
    current_password = request_data.get("current_password", None)
    new_password = request_data.get("new_password", None)

    if not is_valid_password(current_password):
        errors.append(_("Your current password is invalid."))

    if not is_valid_password(new_password):
        errors.append(_("Your new password is invalid."))
