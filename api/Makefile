local: dependencies-lock translations code-format lint

dependencies-lock:
	poetry lock --no-update

code-format:
	isort .
	black .

translations:
	python manage.py makemessages -l en_US
	python manage.py compilemessages -l en_US

lint:
	flake8
	isort --check .
	black --check .

test:
	pytest

db-makemigrations:
	python manage.py makemigrations

db-migrate:
	python manage.py migrate

db-shell:
	python manage.py dbshell

generate_telegram_bot_session:
	python generate_telegram_bot_session.py

runserver:
	# python manage.py runserver 0.0.0.0:8000
	gunicorn --config gunicorn.conf.py --workers 2 --reload

gunicorn:
	gunicorn --config gunicorn.conf.py

dependencies-up:
	docker-compose up -d postgres

up:
	docker-compose up -d

down:
	docker-compose down
