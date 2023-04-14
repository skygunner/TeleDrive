FROM python:3.8.12-alpine

ENV PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONIOENCODING=UTF-8 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

RUN apk add --update --no-cache \
    libc6-compat ca-certificates bash build-base gcc \
    python3-dev libpq postgresql-dev musl-dev libffi-dev \
    clang libjpeg-turbo-dev libwebp-dev zlib-dev rust cargo curl \
    postgresql-client

WORKDIR /app
COPY . /app

RUN install_python_packages.sh
