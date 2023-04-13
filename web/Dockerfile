FROM node:14.19.0-alpine

ARG NODE_ENV \
    REACT_APP_TELEGRAM_BOT_NAME \
    REACT_APP_API_BASE_URL \
    REACT_APP_GOOGLE_ANALYTICS_ID

ENV NODE_ENV=$NODE_ENV \
    REACT_APP_TELEGRAM_BOT_NAME=$REACT_APP_TELEGRAM_BOT_NAME \
    REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL \
    REACT_APP_GOOGLE_ANALYTICS_ID=${REACT_APP_GOOGLE_ANALYTICS_ID}

RUN apk add --update --no-cache

WORKDIR /app
COPY . /app

RUN npm ci \
    && npm run build \
    && npm install -g serve

CMD [ "serve", "-s", "/app/build", "-L", "-l", "8080" ]
