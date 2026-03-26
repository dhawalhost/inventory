.PHONY: build run test migrate docker-up docker-down help

# Variables
APP_NAME=inventory
DOCKER_COMPOSE=docker-compose

help: ## Display this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build the bundled application
	npm run build
	go build -o bin/$(APP_NAME) cmd/api/main.go

run: ## Run the backend locally
	go run cmd/api/main.go

test: ## Run Go tests
	go test ./...

migrate: ## Run database migrations
	go run cmd/migrate/main.go

docker-up: ## Start the bundled container
	$(DOCKER_COMPOSE) up --build -d

docker-down: ## Stop services
	$(DOCKER_COMPOSE) down

frontend-install: ## Install frontend dependencies
	npm install
