local: install translation format lint

install:
	npm install

translation:
	npm run translation

format:
	npx prettier --write --ignore-unknown .
	npm run lint:fix

lint:
	npx prettier --check .
	npm run lint

start:
	sudo HOST=teledrive.local PORT=80 npm start
