ARG BASE_IMAGE=node:alpine

FROM ${BASE_IMAGE} as BUILD

WORKDIR /app

COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN yarn
RUN ./node_modules/.bin/tsc

FROM ${BASE_IMAGE}

WORKDIR /app

RUN apk add --no-cache \
  chromium

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  PUPPETEER_NO_SANDBOX=true

COPY package.json yarn.lock
RUN yarn --frozen-lockfile
COPY --from=BUILD /app/dist /dist

EXPOSE 3000

ENTRYPOINT node dist