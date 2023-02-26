local: install tramslations format lint

install:
	npm install

tramslations:
	npx i18next -c src/i18next-parser.config.mjs 'src/**/*.{js,jsx}'

format:
	npx prettier --write --ignore-unknown .
	npm run lint:fix

lint:
	npx prettier --check .
	npm run lint

start:
	sudo HOST=teledrive.local PORT=80 npm start
