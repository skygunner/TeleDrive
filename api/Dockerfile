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
    python3-dev libpq postgresql-dev musl-dev libffi-dev

ENV HOME=/home/app
RUN mkdir -p $HOME \
    && addgroup -S app \
    && adduser -S app -G app

ENV APP_HOME=$HOME/base-api
RUN mkdir -p $APP_HOME

WORKDIR $APP_HOME

COPY install_python_packages.sh $APP_HOME
COPY poetry.lock pyproject.toml $APP_HOME
RUN $APP_HOME/install_python_packages.sh

COPY . $APP_HOME
RUN chown -R app:app $APP_HOME

USER app
