FROM node:alpine

WORKDIR /app

RUN apk add --no-cache \
  chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  PUPPETEER_NO_SANDBOX=true

COPY package.json yarn.lock ./
RUN yarn
