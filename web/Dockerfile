FROM node:14.19.0-alpine

ARG API_BASE_URL \
    GOOGLE_ANALYTICS_ID \
    TELEGRAM_BOT_NAME

ENV NODE_ENV=production \
    REACT_APP_API_BASE_URL=${API_BASE_URL} \
    REACT_APP_GOOGLE_ANALYTICS_ID=${GOOGLE_ANALYTICS_ID} \
    REACT_APP_TELEGRAM_BOT_NAME=${TELEGRAM_BOT_NAME}

RUN apk add --update --no-cache

WORKDIR /app
COPY . /app

RUN npm ci \
    && npm run build \
    && npm install -g serve

CMD [ "serve", "-s", "/app/build", "-L", "-l", "8080" ]
