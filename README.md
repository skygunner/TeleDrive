# TeleDrive

[![Build API](https://github.com/RashadAnsari/TeleDrive/actions/workflows/build-api.yml/badge.svg?branch=master)](https://github.com/RashadAnsari/TeleDrive/actions/workflows/build-api.yml)
[![Build Web](https://github.com/RashadAnsari/TeleDrive/actions/workflows/build-web.yml/badge.svg?branch=master)](https://github.com/RashadAnsari/TeleDrive/actions/workflows/build-web.yml)

Use Telegram for unlimited cloud storage.

# Local Running

* You must create a Telegram bot using [@BotFather](https://t.me/BotFather) and get the bot token.
* You also need to create a Telegram application [here](https://my.telegram.org/) and get Telegram api_id and api_hash.
* Use the `api/generate_telegram_bot_session.py` script for generating a Telegram bot session.

# SSL Certificate

To generate an SSL certificate, you need to use the below commands:

``` bash
brew install certbot
$ sudo certbot certonly --manual --preferred-challenges dns -d teledrive.io -d www.teledrive.io -d api.teledrive.io
```

# References

* https://github.com/tdlib/telegram-bot-api
* https://core.telegram.org/api/obtaining_api_id
* https://github.com/LonamiWebs/Telethon/wiki/MTProto-vs-HTTP-Bot-API
* https://docs.telethon.dev/en/stable/concepts/botapi-vs-mtproto.html#botapi
