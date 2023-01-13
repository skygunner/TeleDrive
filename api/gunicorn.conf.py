# https://docs.gunicorn.org/en/stable/settings.html#settings

import multiprocessing

bind = ":8000"
workers = multiprocessing.cpu_count() * 2 + 1
wsgi_app = "baseapi.wsgi"
