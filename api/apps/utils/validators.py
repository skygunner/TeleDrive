from rest_framework.exceptions import ValidationError


def request_validator(func):
    def _wrapper(request_data):
        errors = []
        func(errors, request_data)
        if len(errors) > 0:
            raise ValidationError(errors)

    return _wrapper
