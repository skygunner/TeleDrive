import json

from dotenv import load_dotenv
from environ import Env
from telethon.sessions import StringSession
from telethon.sync import TelegramClient

load_dotenv()
env = Env()

client = TelegramClient(
    session=StringSession(),
    api_id=env.str("TELEGRAM_API_ID"),
    api_hash=env.str("TELEGRAM_API_HASH"),
    receive_updates=False,
)

client.connect()
client.sign_in(bot_token=env.str("TELEGRAM_BOT_TOKEN"))

print(json.dumps({"session": client.session.save()}))
