.PHONY: up down build logs restart clean shell db-shell

# Start everything
up:
	docker compose up -d
	@echo "✅ BharatMCP running at http://localhost:8000"
	@echo "📊 MongoDB at localhost:27017"
	@echo "🔴 Redis at localhost:6379"

# Start with live logs
up-logs:
	docker compose up

# Stop everything
down:
	docker compose down

# Rebuild and start
build:
	docker compose build --no-cache
	docker compose up -d

# View logs
logs:
	docker compose logs -f backend

logs-all:
	docker compose logs -f

# Restart backend only (after code changes)
restart:
	docker compose restart backend

# Shell into backend container
shell:
	docker compose exec backend bash

# Shell into MongoDB
db-shell:
	docker compose exec mongodb mongosh -u bharatmcp -p bharatmcp_secret

# Nuke everything (volumes too)
clean:
	docker compose down -v --remove-orphans
	@echo "🧹 Cleaned all containers and volumes"

# Check status
status:
	docker compose ps