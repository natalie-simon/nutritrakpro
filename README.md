# ScanAssiette

**Application web de suivi nutritionnel avec scanner de codes-barres, analyse photo IA, et recherche manuelle.**

[![Version](https://img.shields.io/badge/version-2.0.0--alpha-blue.svg)](https://github.com/natalie-simon/nutritrakpro)
[![Laravel](https://img.shields.io/badge/Laravel-11.x-red.svg)](https://laravel.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.4-green.svg)](https://vuejs.org)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

---

## 🎯 Fonctionnalités

- **Scanner de codes-barres** : Analyse instantanée via Open Food Facts
- **Analyse photo IA** : Reconnaissance d'aliments par Clarifai
- **Recherche manuelle** : Base USDA FoodData Central
- **Statistiques avancées** : Graphiques quotidiens, hebdomadaires, mensuels
- **Export CSV** : Exportation complète des données
- **Multi-utilisateurs** : Authentification JWT + OAuth (Google, Facebook)
- **Mode sombre** : Interface personnalisable
- **100% Gratuit** : Toutes les APIs sont gratuites

---

## 🏗️ Architecture Mono-Repo

```
scanassiette/
├── frontend/           # Vue.js 3 + Vite SPA
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/            # Laravel 11 API RESTful
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── composer.json
├── docs/               # Documentation complète
│   ├── PROJET.md
│   └── database/
├── nutrition-tracker/  # V1.0 (archive)
└── README.md          # Ce fichier
```

---

## 🚀 Installation Rapide

### Option 1 : Avec Docker (Recommandé) 🐳

**Prérequis :** Docker & Docker Compose

```bash
# Cloner le repository
git clone https://github.com/natalie-simon/nutritrakpro.git
cd nutritrakpro

# Installation complète en une commande
make setup

# Résultat :
# ✓ Backend API : http://localhost:8000
# ✓ PHPMyAdmin : http://localhost:8080
```

📖 **Documentation complète Docker :** [README-DOCKER.md](README-DOCKER.md)

---

### Option 2 : Installation Manuelle

**Prérequis :**
- **Node.js** 18+ & NPM 9+
- **PHP** 8.2+ & Composer 2.6+
- **MySQL** 8.0+

### 1. Cloner le Repository

```bash
git clone https://github.com/natalie-simon/nutritrakpro.git
cd nutritrakpro
```

### 2. Configuration Backend

```bash
cd backend

# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env

# Modifier .env avec vos paramètres DB
# DB_DATABASE=scanassiette
# DB_USERNAME=root
# DB_PASSWORD=votre_mot_de_passe

# Générer la clé d'application
php artisan key:generate

# Générer le secret JWT
php artisan jwt:secret

# Exécuter les migrations
php artisan migrate

# Démarrer le serveur
php artisan serve
```

Backend accessible sur : http://localhost:8000

### 3. Configuration Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install

# Créer le fichier d'environnement
cp .env.example .env.local

# Le fichier .env.local devrait contenir :
# VITE_API_URL=http://localhost:8000/api

# Démarrer le serveur de développement
npm run dev
```

Frontend accessible sur : http://localhost:5173

---

## 📖 Documentation Complète

La documentation technique complète est disponible dans **[docs/PROJET.md](docs/PROJET.md)** :

- Architecture détaillée (Frontend, Backend, Database)
- Documentation API REST complète
- Schéma de base de données avec ERD
- Git Flow et conventions
- Plan de développement par phases
- Guide de déploiement production

---

## 🔌 API Endpoints Principaux

### Authentification
```
POST   /api/auth/register       # Inscription
POST   /api/auth/login          # Connexion
POST   /api/auth/logout         # Déconnexion
POST   /api/auth/refresh        # Rafraîchir token
GET    /api/auth/me             # Utilisateur actuel
```

### Nutrition
```
GET    /api/nutrition           # Liste des entrées
POST   /api/nutrition           # Créer une entrée
PUT    /api/nutrition/{id}      # Modifier
DELETE /api/nutrition/{id}      # Supprimer
```

### Statistiques
```
GET    /api/stats/daily         # Stats quotidiennes
GET    /api/stats/weekly        # Stats hebdomadaires
GET    /api/stats/monthly       # Stats mensuelles
```

### Profil
```
GET    /api/profile             # Récupérer profil
PUT    /api/profile             # Modifier profil
POST   /api/profile/export      # Exporter CSV
```

Documentation complète : [docs/PROJET.md#api-rest-documentation](docs/PROJET.md#api-rest-documentation)

---

## 🛠️ Stack Technologique

### Frontend
- Vue.js 3.4 + Composition API
- Vite 5.0 (build tool)
- Vue Router 4.3 (routing)
- Pinia 2.1 (state management)
- Tailwind CSS 3.4 (styling)
- Axios 1.6 (HTTP client)
- Chart.js 4.4 (graphiques)
- html5-qrcode 2.3 (scanner)

### Backend
- Laravel 11 (framework PHP)
- PHP 8.2
- MySQL 8.0
- JWT Auth (tymon/jwt-auth)
- Laravel Sanctum (OAuth)

### APIs Externes
- **Open Food Facts** : Codes-barres (gratuit illimité)
- **Clarifai** : Analyse photos (1000/mois gratuit)
- **USDA FoodData Central** : Nutrition (gratuit illimité)

---

## 🔄 Workflow Git

### Branches Principales
- `main` : Production stable
- `develop` : Développement actif

### Créer une Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ma-nouvelle-feature

# Développer...
git add .
git commit -m "feat(scope): description"

git push origin feature/ma-nouvelle-feature
# Créer une Pull Request vers develop
```

### Conventions de Commits
```bash
feat(auth): add Google OAuth integration
fix(nutrition): correct calorie calculation
docs(api): update endpoints documentation
refactor(frontend): extract reusable components
test(stats): add unit tests for weekly stats
```

Plus de détails : [docs/PROJET.md#git-flow--conventions](docs/PROJET.md#git-flow--conventions)

---

## 🧪 Tests

### Backend (PHPUnit)
```bash
cd backend
php artisan test
```

### Frontend (À venir)
```bash
cd frontend
npm run test
```

---

## 📦 Build Production

### Frontend
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Guide complet : [docs/PROJET.md#déploiement-production](docs/PROJET.md#déploiement-production)

---

## 🗺️ Roadmap

### ✅ Phase 1 : Foundation (Complété)
- ✅ Architecture mono-repo
- ✅ Backend Laravel API
- ✅ Frontend Vue.js 3
- ✅ Authentification JWT
- ✅ Documentation complète

### 🔄 Phase 2 : Migration V1 → V2 (En cours)
- 🔄 Migration composants Vue
- 🔄 Intégration APIs externes
- ⏳ Tests unitaires

### ⏳ Phase 3 : Features Avancées
- ⏳ OAuth Google/Facebook
- ⏳ Recommandations personnalisées
- ⏳ Notifications

### ⏳ Phase 4 : Production
- ⏳ Tests E2E
- ⏳ Optimisation performances
- ⏳ PWA
- ⏳ CI/CD
- ⏳ Déploiement

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter [docs/PROJET.md](docs/PROJET.md) pour les guidelines.

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

---

## 📞 Support

- **Documentation** : [docs/PROJET.md](docs/PROJET.md)
- **Issues** : https://github.com/natalie-simon/nutritrakpro/issues
- **Discussions** : https://github.com/natalie-simon/nutritrakpro/discussions

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur

**Natalie Simon**

- GitHub: [@natalie-simon](https://github.com/natalie-simon)

---

## 🌟 Remerciements

- [Open Food Facts](https://world.openfoodfacts.org/) pour l'API codes-barres
- [Clarifai](https://www.clarifai.com/) pour l'analyse d'images IA
- [USDA](https://fdc.nal.usda.gov/) pour les données nutritionnelles
- La communauté Laravel et Vue.js

---

**Version:** 2.0.0-alpha
**Dernière mise à jour:** 2025-01-09
