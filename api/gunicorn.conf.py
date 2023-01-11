# https://docs.gunicorn.org/en/stable/settings.html#settings

bind = ":8000"
workers = 2
wsgi_app = "baseapi.wsgi"
