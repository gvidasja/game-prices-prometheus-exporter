FROM golang:alpine AS build

WORKDIR /app
COPY . .

RUN go build -o exporter

FROM alpine

WORKDIR /app
COPY --from=build /app/exporter .

CMD [ "./exporter" ]
