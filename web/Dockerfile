FROM node:14.19.0-alpine as build

ARG NODE_ENV \
    REACT_APP_TELEGRAM_BOT_NAME \
    REACT_APP_API_BASE_URL

ENV NODE_ENV=$NODE_ENV \
    REACT_APP_TELEGRAM_BOT_NAME=$REACT_APP_TELEGRAM_BOT_NAME \
    REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN apk add --update --no-cache

WORKDIR /app
COPY . ./

RUN npm ci
RUN npm run build

# ==================================================

FROM nginx:1.23.3-alpine

RUN apk add --update --no-cache

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
