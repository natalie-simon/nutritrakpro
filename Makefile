# NutriTrackPro - Docker Development Commands

.PHONY: help build up down restart logs shell composer artisan migrate migrate-fresh test clean

# Colors
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Afficher l'aide
	@echo "$(BLUE)NutriTrackPro - Commandes Docker$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

build: ## Construire les images Docker
	@echo "$(YELLOW)Building Docker images...$(NC)"
	docker-compose build --no-cache

up: ## Démarrer tous les conteneurs
	@echo "$(YELLOW)Starting containers...$(NC)"
	docker-compose --env-file .env.docker up -d
	@echo "$(GREEN)✓ Containers started!$(NC)"
	@echo "$(BLUE)Backend API: http://localhost:8000$(NC)"
	@echo "$(BLUE)PHPMyAdmin: http://localhost:8080$(NC)"

down: ## Arrêter tous les conteneurs
	@echo "$(YELLOW)Stopping containers...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Containers stopped!$(NC)"

restart: ## Redémarrer tous les conteneurs
	@echo "$(YELLOW)Restarting containers...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Containers restarted!$(NC)"

logs: ## Voir les logs (Ctrl+C pour quitter)
	docker-compose logs -f

logs-app: ## Voir les logs du backend uniquement
	docker-compose logs -f app

logs-nginx: ## Voir les logs nginx
	docker-compose logs -f nginx

logs-db: ## Voir les logs MySQL
	docker-compose logs -f db

shell: ## Accéder au shell du conteneur backend
	docker-compose exec app bash

shell-db: ## Accéder au shell MySQL
	docker-compose exec db mysql -u nutritrak -proot nutritrakpro

composer: ## Installer les dépendances Composer
	@echo "$(YELLOW)Installing Composer dependencies...$(NC)"
	docker-compose exec app composer install
	@echo "$(GREEN)✓ Dependencies installed!$(NC)"

composer-update: ## Mettre à jour les dépendances Composer
	docker-compose exec app composer update

artisan: ## Exécuter une commande Artisan (ex: make artisan cmd="route:list")
	docker-compose exec app php artisan $(cmd)

key-generate: ## Générer la clé d'application Laravel
	@echo "$(YELLOW)Generating application key...$(NC)"
	docker-compose exec app php artisan key:generate
	@echo "$(GREEN)✓ Application key generated!$(NC)"

jwt-secret: ## Générer le secret JWT
	@echo "$(YELLOW)Generating JWT secret...$(NC)"
	docker-compose exec app php artisan jwt:secret
	@echo "$(GREEN)✓ JWT secret generated!$(NC)"

migrate: ## Exécuter les migrations
	@echo "$(YELLOW)Running migrations...$(NC)"
	docker-compose exec app php artisan migrate
	@echo "$(GREEN)✓ Migrations completed!$(NC)"

migrate-fresh: ## Réinitialiser la base de données et exécuter les migrations
	@echo "$(YELLOW)Resetting database and running migrations...$(NC)"
	docker-compose exec app php artisan migrate:fresh
	@echo "$(GREEN)✓ Database reset and migrations completed!$(NC)"

migrate-rollback: ## Annuler la dernière migration
	docker-compose exec app php artisan migrate:rollback

seed: ## Exécuter les seeders
	docker-compose exec app php artisan db:seed

test: ## Exécuter les tests PHPUnit
	docker-compose exec app php artisan test

test-coverage: ## Exécuter les tests avec coverage
	docker-compose exec app php artisan test --coverage

cache-clear: ## Vider tous les caches
	@echo "$(YELLOW)Clearing cache...$(NC)"
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear
	@echo "$(GREEN)✓ Cache cleared!$(NC)"

optimize: ## Optimiser l'application (cache config, routes, views)
	@echo "$(YELLOW)Optimizing application...$(NC)"
	docker-compose exec app php artisan config:cache
	docker-compose exec app php artisan route:cache
	docker-compose exec app php artisan view:cache
	@echo "$(GREEN)✓ Application optimized!$(NC)"

permissions: ## Fixer les permissions des dossiers storage et bootstrap/cache
	docker-compose exec app chmod -R 775 storage bootstrap/cache
	docker-compose exec app chown -R www-data:www-data storage bootstrap/cache

clean: ## Nettoyer les conteneurs, volumes et images
	@echo "$(YELLOW)Cleaning up...$(NC)"
	docker-compose down -v
	docker system prune -f
	@echo "$(GREEN)✓ Cleanup completed!$(NC)"

setup: ## Installation complète (build, up, composer, migrate)
	@echo "$(BLUE)=== NutriTrackPro - Installation Complète ===$(NC)"
	@echo ""
	@echo "$(YELLOW)1/6 Building Docker images...$(NC)"
	@make build
	@echo ""
	@echo "$(YELLOW)2/6 Starting containers...$(NC)"
	@make up
	@sleep 5
	@echo ""
	@echo "$(YELLOW)3/6 Installing dependencies...$(NC)"
	@make composer
	@echo ""
	@echo "$(YELLOW)4/6 Copying environment file...$(NC)"
	docker-compose exec app cp .env.example .env
	@echo ""
	@echo "$(YELLOW)5/6 Generating keys...$(NC)"
	@make key-generate
	@make jwt-secret
	@echo ""
	@echo "$(YELLOW)6/6 Running migrations...$(NC)"
	@make migrate
	@echo ""
	@echo "$(GREEN)✓✓✓ Installation terminée! ✓✓✓$(NC)"
	@echo ""
	@echo "$(BLUE)Backend API disponible sur: http://localhost:8000$(NC)"
	@echo "$(BLUE)PHPMyAdmin disponible sur: http://localhost:8080$(NC)"
	@echo ""
	@echo "Utilisateur DB: nutritrak / root"

status: ## Voir le statut des conteneurs
	docker-compose ps

ps: status ## Alias pour status
