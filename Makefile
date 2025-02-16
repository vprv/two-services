
PROJECT_NAME=nestjs_project

COMPOSE_FILE=docker-compose.yml


up:
	@echo "🚀 Starting application..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d


down:
	@echo "🛑 Stopping application..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down


restart:
	@echo "🔄 Restarting application..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d


logs:
	@echo "📜 Showing logs..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) logs -f


ps:
	@echo "🔍 Checking running containers..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) ps


clean:
	@echo "🧹 Cleaning up containers, images, and volumes..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans


rebuild:
	@echo "🔨 Rebuilding containers..."
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) down
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) build
	docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE) up -d

.PHONY: up down restart logs ps clean rebuild
