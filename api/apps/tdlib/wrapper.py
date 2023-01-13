import logging

from django.conf import settings

from telethon.sessions import StringSession
from telethon.sync import TelegramClient

logger = logging.getLogger(__name__)

global TD_CLIENT


def setup():
    global TD_CLIENT

    if "TD_CLIENT" in globals():
        return

    if (
        not settings.TELEGRAM_BOT_SESSION
        or not settings.TELEGRAM_API_ID
        or not settings.TELEGRAM_API_HASH
        or not settings.TELEGRAM_BOT_TOKEN
    ):
        logger.warning(
            "You must set all these variables to setup the Telegram client: "
            + "[TELEGRAM_BOT_SESSION, TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_BOT_TOKEN]"
        )
        return

    TD_CLIENT = TelegramClient(
        session=StringSession(settings.TELEGRAM_BOT_SESSION),
        api_id=settings.TELEGRAM_API_ID,
        api_hash=settings.TELEGRAM_API_HASH,
        base_logger=logger,
        receive_updates=False,
    )

    TD_CLIENT.connect()
    TD_CLIENT.sign_in(bot_token=settings.TELEGRAM_BOT_TOKEN)
