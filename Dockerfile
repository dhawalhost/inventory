# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Backend
FROM golang:1.23-alpine AS backend-builder
RUN apk add --no-cache git gcc musl-dev
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
# CGO_ENABLED=1 is required for SQLite
RUN CGO_ENABLED=1 GOOS=linux go build -o main ./cmd/api/main.go
RUN CGO_ENABLED=1 GOOS=linux go build -o migrator ./cmd/migrate/main.go

# Stage 3: Final Image
FROM alpine:latest
RUN apk add --no-cache bash ca-certificates
WORKDIR /app
# Copy backend binaries
COPY --from=backend-builder /app/main .
COPY --from=backend-builder /app/migrator .
# Copy frontend build to the build directory (where Go looks for it)
COPY --from=frontend-builder /app/build ./build

# Create data directory for SQLite persistence
RUN mkdir /data
ENV DB_TYPE=sqlite
ENV DB_NAME=/data/inventory.db

EXPOSE 8080
# Run migrator then start the app
CMD ["sh", "-c", "./migrator && ./main"]