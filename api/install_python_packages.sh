pip install --upgrade pip
pip install "poetry==1.1.12"
poetry config virtualenvs.create false
poetry install --no-dev --no-interaction --no-ansi
