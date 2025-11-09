# NutriTrackPro - Guide Docker (Développement)

Ce guide explique comment utiliser Docker pour le développement du backend Laravel.

---

## 🐳 Architecture Docker

### Services Conteneurisés

| Service | Image | Port | Description |
|---------|-------|------|-------------|
| **app** | PHP 8.2-FPM | - | Application Laravel |
| **nginx** | Nginx Alpine | 8000 | Serveur web |
| **db** | MySQL 8.0 | 3306 | Base de données |
| **phpmyadmin** | PHPMyAdmin | 8080 | Interface DB (optionnel) |

### Volumes Persistants

- `nutritrakpro-mysql-data` : Données MySQL (persiste après `docker-compose down`)
- `./backend` : Code source monté en volume (hot-reload)

---

## 🚀 Installation Rapide

### Prérequis

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Make** (optionnel, pour commandes simplifiées)

### Installation Complète (Recommandé)

Une seule commande pour tout installer :

```bash
make setup
```

Cette commande :
1. ✅ Construit les images Docker
2. ✅ Démarre tous les conteneurs
3. ✅ Installe les dépendances Composer
4. ✅ Configure l'environnement (.env)
5. ✅ Génère les clés (APP_KEY, JWT_SECRET)
6. ✅ Exécute les migrations

**Résultat :**
- Backend API : http://localhost:8000
- PHPMyAdmin : http://localhost:8080 (user: `nutritrak`, password: `root`)

---

## 📖 Commandes Make

### Gestion des Conteneurs

```bash
make up           # Démarrer tous les conteneurs
make down         # Arrêter tous les conteneurs
make restart      # Redémarrer tous les conteneurs
make status       # Voir le statut des conteneurs
make logs         # Voir tous les logs (temps réel)
make logs-app     # Logs du backend uniquement
make logs-nginx   # Logs nginx uniquement
make logs-db      # Logs MySQL uniquement
```

### Développement Laravel

```bash
make shell        # Accéder au shell du conteneur backend
make composer     # Installer les dépendances
make artisan cmd="route:list"  # Exécuter une commande Artisan

# Exemples de commandes Artisan
make artisan cmd="migrate"
make artisan cmd="db:seed"
make artisan cmd="make:controller MyController"
make artisan cmd="tinker"
```

### Base de Données

```bash
make migrate             # Exécuter les migrations
make migrate-fresh       # Réinitialiser et migrer
make migrate-rollback    # Annuler la dernière migration
make seed                # Exécuter les seeders
make shell-db            # Accéder au shell MySQL
```

### Tests

```bash
make test                # Exécuter les tests PHPUnit
make test-coverage       # Tests avec coverage
```

### Cache & Optimisation

```bash
make cache-clear         # Vider tous les caches
make optimize            # Optimiser (cache config/routes/views)
```

### Nettoyage

```bash
make clean               # Nettoyer conteneurs, volumes, images
```

### Aide

```bash
make help                # Afficher toutes les commandes disponibles
```

---

## 🛠️ Utilisation Sans Make

Si vous n'avez pas Make, utilisez directement Docker Compose :

### Installation Manuelle

```bash
# 1. Construire les images
docker-compose build

# 2. Démarrer les conteneurs
docker-compose --env-file .env.docker up -d

# 3. Installer les dépendances
docker-compose exec app composer install

# 4. Copier et configurer .env
docker-compose exec app cp .env.example .env

# 5. Générer les clés
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan jwt:secret

# 6. Exécuter les migrations
docker-compose exec app php artisan migrate
```

### Commandes Courantes

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Logs
docker-compose logs -f

# Accéder au shell
docker-compose exec app bash

# Exécuter Artisan
docker-compose exec app php artisan [commande]

# Composer
docker-compose exec app composer [commande]
```

---

## 🔧 Configuration

### Variables d'Environnement

Les variables Docker sont dans `.env.docker` :

```env
DB_DATABASE=nutritrakpro
DB_USERNAME=nutritrak
DB_PASSWORD=root
```

La configuration Laravel est dans `backend/.env` (créé automatiquement) :

```env
APP_NAME=NutriTrackPro
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=db                    # ← Nom du service Docker
DB_PORT=3306
DB_DATABASE=nutritrakpro
DB_USERNAME=nutritrak
DB_PASSWORD=root

JWT_SECRET=...                # Généré automatiquement
```

### Ports Personnalisés

Pour changer les ports, éditez `docker-compose.yml` :

```yaml
services:
  nginx:
    ports:
      - "8080:80"    # Backend sur port 8080

  db:
    ports:
      - "3307:3306"  # MySQL sur port 3307

  phpmyadmin:
    ports:
      - "8081:80"    # PHPMyAdmin sur port 8081
```

---

## 🐛 Dépannage

### Problème : Port déjà utilisé

**Erreur :** `Bind for 0.0.0.0:8000 failed: port is already allocated`

**Solution :**
```bash
# Vérifier quel processus utilise le port
lsof -i :8000

# Arrêter le processus ou changer le port dans docker-compose.yml
```

### Problème : Permissions refusées

**Erreur :** `Permission denied` pour storage ou bootstrap/cache

**Solution :**
```bash
make permissions
# ou
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### Problème : Connexion MySQL refusée

**Erreur :** `SQLSTATE[HY000] [2002] Connection refused`

**Solution :**
```bash
# Vérifier que le conteneur MySQL est démarré
docker-compose ps

# Vérifier les logs MySQL
make logs-db

# Attendre que MySQL soit complètement démarré (peut prendre 10-20s)
docker-compose exec db mysqladmin ping -h localhost -u root -proot
```

### Problème : Composer très lent

**Solution :** Utiliser le cache Composer

Ajoutez ce volume dans `docker-compose.yml` :
```yaml
services:
  app:
    volumes:
      - ~/.composer:/home/nutritrak/.composer
```

### Reconstruire Complètement

Si les problèmes persistent :

```bash
# Tout nettoyer
make clean

# Réinstaller
make setup
```

---

## 📊 Accès PHPMyAdmin

**URL :** http://localhost:8080

**Connexion :**
- Serveur : `db`
- Utilisateur : `nutritrak`
- Mot de passe : `root`
- Base de données : `nutritrakpro`

---

## 🔐 Sécurité

### Mode Développement vs Production

**⚠️ Cette configuration Docker est pour le DÉVELOPPEMENT uniquement !**

**Ne pas utiliser en production :**
- Mots de passe en clair
- Debug activé
- Ports exposés sans firewall
- PHPMyAdmin accessible publiquement

### Pour la Production

Voir le guide de déploiement dans `docs/PROJET.md`.

---

## 📁 Structure Docker

```
nutritrakpro/
├── docker-compose.yml           # Orchestration services
├── .env.docker                  # Variables Docker
├── Makefile                     # Commandes simplifiées
└── backend/
    ├── Dockerfile               # Image PHP personnalisée
    ├── .dockerignore            # Fichiers exclus de l'image
    └── docker/
        ├── nginx/
        │   └── default.conf     # Config nginx
        ├── php/
        │   └── php.ini          # Config PHP
        └── mysql/
            └── my.cnf           # Config MySQL
```

---

## 🚀 Workflow Développement

### Démarrage Quotidien

```bash
# Démarrer l'environnement
make up

# Vérifier que tout fonctionne
make status
make logs-app
```

### Pendant le Développement

```bash
# Le code est synchronisé en temps réel (hot-reload)
# Modifiez les fichiers dans backend/

# Pour les migrations
make migrate

# Pour vider le cache après modifications
make cache-clear

# Accéder au shell si nécessaire
make shell
```

### Fin de Journée

```bash
# Arrêter les conteneurs (données MySQL préservées)
make down
```

### Tests

```bash
# Exécuter les tests
make test

# Avec coverage
make test-coverage
```

---

## 🔄 Mise à Jour

### Mise à Jour du Code

```bash
# Pull les dernières modifications
git pull origin develop

# Redémarrer les conteneurs
make restart

# Mettre à jour les dépendances
make composer-update

# Exécuter les nouvelles migrations
make migrate
```

### Mise à Jour des Images Docker

```bash
# Reconstruire les images
make build

# Redémarrer avec nouvelles images
make down
make up
```

---

## 💡 Astuces

### Exécuter des Commandes Artisan Rapidement

Ajoutez un alias dans votre shell (`~/.bashrc` ou `~/.zshrc`) :

```bash
alias nutriart='docker-compose exec app php artisan'
```

Ensuite :
```bash
nutriart migrate
nutriart make:controller UserController
nutriart route:list
```

### Voir les Requêtes SQL en Temps Réel

```bash
# Dans le shell backend
make shell

# Installer le package
composer require barryvdh/laravel-debugbar --dev

# Les requêtes apparaîtront dans les logs
```

### Backup de la Base de Données

```bash
# Exporter
docker-compose exec db mysqldump -u nutritrak -proot nutritrakpro > backup.sql

# Importer
docker-compose exec -T db mysql -u nutritrak -proot nutritrakpro < backup.sql
```

---

## 📞 Support

Pour toute question ou problème :

1. Consultez la section **Dépannage** ci-dessus
2. Vérifiez les logs : `make logs`
3. Consultez `docs/PROJET.md` pour la documentation complète
4. Ouvrez une issue sur GitHub

---

**Version Docker :** 1.0.0
**Dernière mise à jour :** 2025-01-09
