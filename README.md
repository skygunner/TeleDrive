# TeleDrive

[![Build](https://github.com/RashadAnsari/TeleDrive/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/RashadAnsari/TeleDrive/actions/workflows/build.yml)

The ultimate solution for managing your Telegram unlimited cloud storage.

# Local Running

* You must create a Telegram bot using [@BotFather](https://t.me/BotFather) and get the bot token.
* You also need to create a Telegram application [here](https://my.telegram.org/) and get Telegram api_id and api_hash.
* Use the `api/generate_telegram_bot_session.py` script for generating a Telegram bot session.
* Fill below environments variables with the values you got in the previous steps:

    ```bash
        # API
        TELEGRAM_API_ID=
        TELEGRAM_API_HASH=
        TELEGRAM_BOT_TOKEN=
        TELEGRAM_BOT_SESSION=
        # Web
        REACT_APP_TELEGRAM_BOT_NAME=
    ```

* Add `teledrive.local` as your bot domain in Telegram.
* Add the below record to your `/etc/hosts` file:

    ```bash
        127.0.0.1 teledrive.local
    ```

# SSL Certificate

To generate an SSL certificate, you need to use the below commands:

``` bash
brew install certbot
sudo certbot certonly --manual --preferred-challenges dns -d teledrive.io -d www.teledrive.io -d api.teledrive.io
```

# References

* https://github.com/tdlib/telegram-bot-api
* https://core.telegram.org/api/obtaining_api_id
* https://github.com/LonamiWebs/Telethon/wiki/MTProto-vs-HTTP-Bot-API
* https://docs.telethon.dev/en/stable/concepts/botapi-vs-mtproto.html#botapi

# Donate

If you found this project useful, please consider supporting its development with a donation in ETH to the following address:

`0xcAA98CD5BA25AE1fA064813B41952d0716892381`

Or you can donate any amount you want using [PayPal](https://www.paypal.me/RashadAnsari).

Your donation will help cover the costs of maintaining and improving this project, as well as motivate me to continue working on it.

Thank you for your support!
