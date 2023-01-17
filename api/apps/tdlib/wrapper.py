import asyncio
import logging

from django.conf import settings

from telethon.sessions import StringSession
from telethon.sync import TelegramClient

logger = logging.getLogger(__name__)


def td_client():
    global TD_CLIENT

    if "TD_CLIENT" in globals():
        return TD_CLIENT

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    TD_CLIENT = TelegramClient(
        session=StringSession(settings.TELEGRAM_BOT_SESSION),
        api_id=settings.TELEGRAM_API_ID,
        api_hash=settings.TELEGRAM_API_HASH,
        base_logger=logger,
        receive_updates=False,
    )

    TD_CLIENT.connect()

    if not TD_CLIENT.is_user_authorized():
        print("here")
        TD_CLIENT.sign_in(bot_token=settings.TELEGRAM_BOT_TOKEN)

    return TD_CLIENT
