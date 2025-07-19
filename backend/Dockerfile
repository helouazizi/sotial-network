FROM golang:1.24.2-bullseye as stage1

ENV GO111MODULE=on \
    CGO_ENABLED=1 

WORKDIR /Backend

# Install gcc and libc-dev using apt
RUN apt-get update && apt-get install -y gcc libc6-dev

COPY go.mod go.sum ./
RUN go mod download
COPY . .

RUN go build -o app cmd/main.go
FROM debian:bullseye-slim

WORKDIR /root/
RUN mkdir -p /pkg/db/sqlite
COPY --from=stage1 /Backend/app .
COPY --from=stage1 /Backend/pkg/db/migrations ./pkg/db/migrations
COPY --from=stage1 /Backend/pkg/db/sqlite/ ./pkg/db/sqlite/
EXPOSE 8080

CMD ["./app"]


