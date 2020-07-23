ARG BASE_IMAGE=node:alpine

FROM ${BASE_IMAGE}

WORKDIR /app

COPY . .

RUN apk add --no-cache \
  chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  PUPPETEER_NO_SANDBOX=true

RUN yarn

EXPOSE 3000

ENTRYPOINT yarn start