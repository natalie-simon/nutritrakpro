# NutriTrackPro - Documentation Projet

## 📋 Vue d'ensemble

**NutriTrackPro** est une application web moderne de suivi nutritionnel offrant trois méthodes de saisie :
- Scanner de codes-barres (Open Food Facts API)
- Analyse de photos par IA (Clarifai API)
- Recherche manuelle (USDA FoodData Central API)

### Objectifs
- ✅ Suivi nutritionnel quotidien simple et rapide
- ✅ Multi-utilisateurs avec authentification sécurisée
- ✅ Synchronisation cloud des données
- ✅ Statistiques et visualisations avancées
- ✅ 100% gratuit (APIs gratuites)

---

## 🏗️ Architecture Technique

### Approche : Mono-Repo avec Séparation Front/Back

```
nutritrakpro/
├── frontend/          # SPA Vue.js 3 + Vite
├── backend/           # API RESTful Laravel 11
├── database/          # Migrations & seeders
└── docs/              # Documentation complète
```

### Architecture Globale

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Vue.js 3 SPA (frontend/)                  │  │
│  │  - Components (Scanner, Photo, Search, History)   │  │
│  │  - State Management (Pinia)                       │  │
│  │  - Router (Vue Router)                            │  │
│  │  - API Client (Axios)                             │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTPS/JSON
┌─────────────────────────────────────────────────────────┐
│              BACKEND API (Laravel 11)                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Routes API (/api/*)                              │  │
│  │  ├── /auth (login, register, refresh, logout)    │  │
│  │  ├── /nutrition (CRUD entries)                    │  │
│  │  ├── /profile (user settings)                     │  │
│  │  └── /stats (analytics, charts)                   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Middleware                                        │  │
│  │  ├── JWT Authentication                           │  │
│  │  ├── CORS                                          │  │
│  │  ├── Rate Limiting                                 │  │
│  │  └── Request Validation                           │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services                                          │  │
│  │  ├── AuthService (JWT, OAuth)                     │  │
│  │  ├── NutritionService (CRUD logic)                │  │
│  │  └── StatsService (calculations)                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕ SQL
┌─────────────────────────────────────────────────────────┐
│                  MySQL Database                          │
│  ├── users                                               │
│  ├── user_profiles                                       │
│  ├── nutrition_entries                                   │
│  ├── oauth_sessions                                      │
│  └── password_resets                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 💻 Stack Technologique

### Frontend
| Technologie | Version | Rôle |
|------------|---------|------|
| **Vue.js** | 3.4+ | Framework SPA réactif |
| **Vite** | 5.0+ | Build tool ultra-rapide |
| **TypeScript** | 5.0+ | Typage statique |
| **Pinia** | 2.1+ | State management |
| **Vue Router** | 4.2+ | Routing SPA |
| **Axios** | 1.6+ | Client HTTP API |
| **Tailwind CSS** | 3.4+ | Framework CSS utility-first |
| **Chart.js** | 4.4+ | Graphiques et visualisations |
| **html5-qrcode** | 2.3+ | Scanner codes-barres |

### Backend
| Technologie | Version | Rôle |
|------------|---------|------|
| **Laravel** | 11.x | Framework PHP API |
| **PHP** | 8.2+ | Langage backend |
| **MySQL** | 8.0+ | Base de données relationnelle |
| **JWT Auth** | tymon/jwt-auth | Authentification stateless |
| **Laravel Sanctum** | 4.x | OAuth social login |
| **Composer** | 2.6+ | Gestionnaire dépendances PHP |

### APIs Externes (Gratuites)
| API | Limite Gratuite | Usage |
|-----|----------------|-------|
| **Open Food Facts** | Illimité | Recherche par code-barre |
| **Clarifai Food Recognition** | 1000/mois | Analyse photos IA |
| **USDA FoodData Central** | Illimité | Recherche manuelle nutrition |

### DevOps & Outils
- **Git** + **GitHub** : Versioning (Git Flow)
- **Docker** : Containerisation (optionnel)
- **NPM** : Gestionnaire dépendances JS
- **ESLint** + **Prettier** : Linting frontend
- **PHP-CS-Fixer** : Linting backend

---

## 🗄️ Schéma de Base de Données

### Modèle Entité-Relation (ERD)

```
┌─────────────────────┐         ┌──────────────────────┐
│      users          │1      1 │   user_profiles      │
├─────────────────────┤─────────├──────────────────────┤
│ id (PK)             │         │ id (PK)              │
│ email (unique)      │         │ user_id (FK)         │
│ password            │         │ name                 │
│ email_verified_at   │         │ age                  │
│ created_at          │         │ gender               │
│ updated_at          │         │ height               │
└─────────────────────┘         │ weight               │
         │                       │ activity_level       │
         │                       │ calorie_goal         │
         │1                     │ dark_mode            │
         │                       │ created_at           │
         │                       │ updated_at           │
         │                       └──────────────────────┘
         │
         │
         │*
┌─────────────────────┐
│ nutrition_entries   │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ food_name           │
│ barcode             │
│ calories            │
│ proteins            │
│ carbs               │
│ fats                │
│ fiber               │
│ serving_size        │
│ serving_unit        │
│ meal_type           │ (breakfast, lunch, dinner, snack)
│ source              │ (barcode, photo, manual)
│ photo_url           │
│ consumed_at         │
│ created_at          │
│ updated_at          │
└─────────────────────┘


┌─────────────────────┐         ┌──────────────────────┐
│      users          │1      * │  oauth_sessions      │
├─────────────────────┤─────────├──────────────────────┤
│ id (PK)             │         │ id (PK)              │
│ ...                 │         │ user_id (FK)         │
└─────────────────────┘         │ provider             │ (google, facebook)
                                │ provider_user_id     │
                                │ access_token         │
                                │ refresh_token        │
                                │ expires_at           │
                                │ created_at           │
                                │ updated_at           │
                                └──────────────────────┘
```

### Détails des Tables

#### `users`
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);
```

#### `user_profiles`
```sql
CREATE TABLE user_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    age INT UNSIGNED NULL,
    gender ENUM('male', 'female', 'other') NULL,
    height DECIMAL(5,2) NULL COMMENT 'cm',
    weight DECIMAL(5,2) NULL COMMENT 'kg',
    activity_level ENUM('sedentary', 'light', 'moderate', 'active', 'very_active') DEFAULT 'moderate',
    calorie_goal INT UNSIGNED DEFAULT 2000,
    dark_mode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### `nutrition_entries`
```sql
CREATE TABLE nutrition_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    barcode VARCHAR(50) NULL,
    calories DECIMAL(8,2) NOT NULL,
    proteins DECIMAL(8,2) DEFAULT 0,
    carbs DECIMAL(8,2) DEFAULT 0,
    fats DECIMAL(8,2) DEFAULT 0,
    fiber DECIMAL(8,2) DEFAULT 0,
    serving_size DECIMAL(8,2) DEFAULT 100,
    serving_unit VARCHAR(50) DEFAULT 'g',
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NULL,
    source ENUM('barcode', 'photo', 'manual') NOT NULL,
    photo_url VARCHAR(500) NULL,
    consumed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_consumed (user_id, consumed_at),
    INDEX idx_meal_type (meal_type)
);
```

#### `oauth_sessions`
```sql
CREATE TABLE oauth_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    provider ENUM('google', 'facebook') NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT NULL,
    refresh_token TEXT NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider_user (provider, provider_user_id)
);
```

#### `password_resets`
```sql
CREATE TABLE password_resets (
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (token)
);
```

---

## 🔌 API REST Documentation

### Base URL
```
Production: https://api.nutritrakpro.com/api
Development: http://localhost:8000/api
```

### Authentication
Toutes les routes (sauf `/auth/*`) requièrent un token JWT dans le header :
```
Authorization: Bearer {token}
```

---

### 🔐 Authentication Endpoints

#### POST /api/auth/register
Créer un nouveau compte utilisateur

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "password_confirmation": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "profile": {
        "name": "John Doe",
        "calorie_goal": 2000,
        "dark_mode": false
      }
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_in": 3600
  }
}
```

**Errors:**
- `422` : Validation failed (email déjà utilisé, mot de passe faible)

---

#### POST /api/auth/login
Connexion avec email/password

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "profile": {...}
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_in": 3600
  }
}
```

**Errors:**
- `401` : Invalid credentials

---

#### POST /api/auth/refresh
Rafraîchir le token JWT

**Headers:**
```
Authorization: Bearer {current_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_in": 3600
  }
}
```

---

#### POST /api/auth/logout
Déconnexion (invalide le token)

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

#### GET /api/auth/oauth/{provider}
Redirection OAuth (Google/Facebook)

**Parameters:**
- `provider`: `google` | `facebook`

**Response:** Redirect to provider OAuth page

---

#### GET /api/auth/oauth/{provider}/callback
Callback OAuth après authentification

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_in": 3600
  }
}
```

---

### 🍎 Nutrition Entries Endpoints

#### GET /api/nutrition
Récupérer toutes les entrées de l'utilisateur

**Query Parameters:**
- `start_date` (optional): `2024-01-01`
- `end_date` (optional): `2024-01-31`
- `meal_type` (optional): `breakfast` | `lunch` | `dinner` | `snack`
- `page` (optional): pagination, default 1
- `per_page` (optional): items per page, default 50

**Response (200):**
```json
{
  "success": true,
  "data": {
    "entries": [
      {
        "id": 123,
        "food_name": "Banana",
        "barcode": "3017620422003",
        "calories": 89,
        "proteins": 1.1,
        "carbs": 22.8,
        "fats": 0.3,
        "fiber": 2.6,
        "serving_size": 100,
        "serving_unit": "g",
        "meal_type": "breakfast",
        "source": "barcode",
        "photo_url": null,
        "consumed_at": "2024-01-15T08:30:00Z",
        "created_at": "2024-01-15T08:30:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "current_page": 1,
      "per_page": 50,
      "last_page": 3
    }
  }
}
```

---

#### POST /api/nutrition
Créer une nouvelle entrée nutritionnelle

**Request Body:**
```json
{
  "food_name": "Banana",
  "barcode": "3017620422003",
  "calories": 89,
  "proteins": 1.1,
  "carbs": 22.8,
  "fats": 0.3,
  "fiber": 2.6,
  "serving_size": 100,
  "serving_unit": "g",
  "meal_type": "breakfast",
  "source": "barcode",
  "photo_url": null,
  "consumed_at": "2024-01-15T08:30:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Nutrition entry created successfully",
  "data": {
    "entry": {...}
  }
}
```

**Errors:**
- `422` : Validation failed

---

#### PUT /api/nutrition/{id}
Modifier une entrée existante

**Request Body:** Same as POST

**Response (200):**
```json
{
  "success": true,
  "message": "Nutrition entry updated successfully",
  "data": {
    "entry": {...}
  }
}
```

**Errors:**
- `404` : Entry not found
- `403` : Not authorized (entry belongs to another user)

---

#### DELETE /api/nutrition/{id}
Supprimer une entrée

**Response (200):**
```json
{
  "success": true,
  "message": "Nutrition entry deleted successfully"
}
```

---

### 📊 Statistics Endpoints

#### GET /api/stats/daily
Statistiques quotidiennes

**Query Parameters:**
- `date` (optional): `2024-01-15`, default today

**Response (200):**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "totals": {
      "calories": 1847,
      "proteins": 65.3,
      "carbs": 210.5,
      "fats": 58.2,
      "fiber": 28.4
    },
    "goal": {
      "calories": 2000,
      "percentage": 92.35
    },
    "by_meal": {
      "breakfast": { "calories": 450, "count": 3 },
      "lunch": { "calories": 680, "count": 2 },
      "dinner": { "calories": 550, "count": 2 },
      "snack": { "calories": 167, "count": 2 }
    }
  }
}
```

---

#### GET /api/stats/weekly
Statistiques hebdomadaires (7 derniers jours)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2024-01-09",
      "end": "2024-01-15"
    },
    "daily": [
      {
        "date": "2024-01-09",
        "calories": 1950,
        "proteins": 72.5,
        "carbs": 220.3,
        "fats": 60.1
      },
      ...
    ],
    "averages": {
      "calories": 1890,
      "proteins": 68.2,
      "carbs": 215.7,
      "fats": 59.3
    }
  }
}
```

---

### 👤 Profile Endpoints

#### GET /api/profile
Récupérer le profil de l'utilisateur

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "profile": {
      "name": "John Doe",
      "age": 30,
      "gender": "male",
      "height": 178,
      "weight": 75,
      "activity_level": "moderate",
      "calorie_goal": 2000,
      "dark_mode": false
    }
  }
}
```

---

#### PUT /api/profile
Mettre à jour le profil

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "age": 31,
  "gender": "male",
  "height": 178,
  "weight": 73,
  "activity_level": "active",
  "calorie_goal": 2200,
  "dark_mode": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": {...}
  }
}
```

---

#### POST /api/profile/export
Exporter les données en CSV

**Query Parameters:**
- `start_date` (optional): `2024-01-01`
- `end_date` (optional): `2024-01-31`

**Response (200):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="nutrition_export_2024-01-15.csv"

Date,Food,Calories,Proteins,Carbs,Fats,Fiber,Meal
2024-01-15 08:30,Banana,89,1.1,22.8,0.3,2.6,breakfast
...
```

---

## 🔄 Git Flow & Conventions

### Branches Principales

| Branch | Rôle | Protection |
|--------|------|------------|
| `main` | Production stable | ✅ Protected, merge via PR only |
| `develop` | Intégration développement | ✅ Protected, merge via PR |

### Branches de Travail

| Type | Naming | Exemple | Merge vers |
|------|--------|---------|------------|
| Feature | `feature/{description}` | `feature/oauth-google` | `develop` |
| Bugfix | `bugfix/{description}` | `bugfix/login-error` | `develop` |
| Hotfix | `hotfix/{description}` | `hotfix/security-patch` | `main` + `develop` |
| Release | `release/{version}` | `release/v1.0.0` | `main` + `develop` |

### Workflow

```
main ─────────────────────────────────────────────────
      ↖                                           ↗
       release/v1.0.0 ─────────────────────────→
                                                  ↗
develop ─────────────────────────────────────────────
         ↖         ↗    ↖         ↗
          feature/A      feature/B
```

### Conventions de Commits

Format : `<type>(<scope>): <description>`

**Types:**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage code (pas de changement logique)
- `refactor`: Refactoring (pas de feat/fix)
- `test`: Ajout/modification tests
- `chore`: Tâches maintenance (build, deps)

**Exemples:**
```bash
git commit -m "feat(auth): add Google OAuth integration"
git commit -m "fix(nutrition): correct calorie calculation for imported foods"
git commit -m "docs(api): update authentication endpoints documentation"
git commit -m "refactor(frontend): extract nutrition card component"
```

### Pull Requests

**Template PR:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No console errors

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Closes #123
```

---

## 📅 Plan de Développement

### Phase 1 : Foundation (Semaines 1-2)
**Objectif:** Infrastructure de base fonctionnelle

- [ ] Setup mono-repo complet
- [ ] Configuration Laravel backend (API routes, JWT)
- [ ] Configuration Vue.js frontend (Vite, Router, Pinia)
- [ ] Migrations base de données (users, profiles)
- [ ] API Authentication (register, login, logout, refresh)
- [ ] Frontend : Pages Login/Register
- [ ] Tests unitaires authentication

**Livrable:** API auth fonctionnelle + Frontend de connexion

---

### Phase 2 : Migration V1 → V2 (Semaines 3-4)
**Objectif:** Porter fonctionnalités existantes vers nouvelle architecture

- [ ] Migration code scanner barcode → Vue component
- [ ] Migration analyse photo → Vue component
- [ ] Migration recherche manuelle → Vue component
- [ ] API endpoints CRUD nutrition entries
- [ ] Frontend : State management (Pinia stores)
- [ ] Intégration APIs externes (Clarifai, USDA, Open Food Facts)
- [ ] Migration localStorage → API calls

**Livrable:** Parité fonctionnelle avec V1 en architecture V2

---

### Phase 3 : Features Avancées (Semaines 5-6)
**Objectif:** Nouveautés multi-utilisateurs

- [ ] OAuth Google integration
- [ ] OAuth Facebook integration
- [ ] API stats endpoints (daily, weekly, monthly)
- [ ] Frontend : Dashboards statistiques avancés
- [ ] Recommandations personnalisées basées sur profil
- [ ] Export CSV amélioré (backend)
- [ ] Notifications/reminders (optionnel)

**Livrable:** Application complète multi-utilisateurs

---

### Phase 4 : Polish & Production (Semaines 7-8)
**Objectif:** Optimisation et déploiement

- [ ] Tests E2E (Cypress/Playwright)
- [ ] Optimisation performances (lazy loading, caching)
- [ ] SEO & PWA (manifest, service worker)
- [ ] Documentation API Swagger/OpenAPI
- [ ] CI/CD Pipeline (GitHub Actions)
- [ ] Déploiement production (frontend + backend)
- [ ] Monitoring & logging (Sentry, Laravel Telescope)

**Livrable:** Application en production stable

---

## 🚀 Guide de Déploiement

### Prérequis

**Frontend:**
- Node.js 18+
- NPM 9+

**Backend:**
- PHP 8.2+
- Composer 2.6+
- MySQL 8.0+
- Extension PHP : mbstring, openssl, pdo, tokenizer, xml, ctype, json, bcmath

---

### Installation avec Docker (Recommandé pour Développement)

**Prérequis Docker :**
- Docker 20.10+
- Docker Compose 2.0+
- Make (optionnel)

**Installation en une commande :**
```bash
git clone https://github.com/natalie-simon/nutritrakpro.git
cd nutritrakpro
make setup
```

Cette commande :
- ✅ Construit les images Docker (PHP 8.2, Nginx, MySQL 8.0)
- ✅ Démarre tous les conteneurs
- ✅ Installe les dépendances Composer
- ✅ Configure l'environnement
- ✅ Génère les clés (APP_KEY, JWT_SECRET)
- ✅ Exécute les migrations

**Services démarrés :**
- Backend API : http://localhost:8000
- PHPMyAdmin : http://localhost:8080 (user: nutritrak, password: root)
- MySQL : localhost:3306

**Commandes Docker courantes :**
```bash
make up              # Démarrer les conteneurs
make down            # Arrêter les conteneurs
make logs            # Voir les logs
make shell           # Accéder au shell backend
make migrate         # Exécuter les migrations
make test            # Exécuter les tests
make help            # Voir toutes les commandes
```

📖 **Documentation complète :** [README-DOCKER.md](../README-DOCKER.md)

---

### Installation Locale (Manuelle)

#### 1. Clone Repository
```bash
git clone https://github.com/natalie-simon/nutritrakpro.git
cd nutritrakpro
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=nutritrakpro
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations
php artisan migrate

# Generate JWT secret
php artisan jwt:secret

# Start development server
php artisan serve
# Backend running on http://localhost:8000
```

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure API URL in .env.local
echo "VITE_API_URL=http://localhost:8000/api" > .env.local

# Start development server
npm run dev
# Frontend running on http://localhost:5173
```

---

### Déploiement Production

#### Frontend (Netlify/Vercel)

**Build:**
```bash
cd frontend
npm run build
# Output: dist/
```

**Deploy to Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Environment Variables:**
```
VITE_API_URL=https://api.nutritrakpro.com/api
VITE_CLARIFAI_KEY=5d6ee14430e642408cc08bd89c64dd28
VITE_USDA_KEY=PS2HqdAYDA7GatNE6wqMdfTvbvJOTG3Ars876FrD
```

---

#### Backend (Hébergement Mutualisé cPanel)

**1. Build & Prepare:**
```bash
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**2. Upload Files:**
- Upload tout le dossier `backend/` via FTP
- Placer le contenu de `public/` dans `public_html/`
- Le reste dans un dossier privé (ex: `/home/user/laravel/`)

**3. Configure .htaccess:**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**4. Environment (.env):**
```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.nutritrakpro.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=username_nutritrak
DB_USERNAME=username_dbuser
DB_PASSWORD=SecurePassword

JWT_SECRET=GeneratedSecretKey
```

**5. Database:**
- Créer base MySQL via cPanel
- Importer migrations : `php artisan migrate --force`

**6. Permissions:**
```bash
chmod -R 755 storage bootstrap/cache
```

---

## 🔒 Sécurité

### Backend
✅ **JWT Authentication** : Tokens stateless avec expiration
✅ **Bcrypt Password Hashing** : Stockage sécurisé mots de passe
✅ **Prepared Statements** : Protection SQL injection (Eloquent ORM)
✅ **CORS Configuration** : Whitelist domaines autorisés
✅ **Rate Limiting** : Protection brute force (60 req/min)
✅ **HTTPS Only** : Force SSL en production
✅ **Input Validation** : Laravel Form Requests
✅ **CSRF Protection** : Laravel Sanctum pour OAuth

### Frontend
✅ **XSS Protection** : Vue.js auto-escape HTML
✅ **Secure Storage** : JWT en httpOnly cookie (recommandé)
✅ **HTTPS Camera API** : Requis pour accès caméra
✅ **Environment Variables** : APIs keys non exposées

### APIs Externes
⚠️ **Hardcoded Keys** : Pour v1.0 uniquement (development)
🔄 **Migration Future** : Déplacer vers backend en v2.0

---

## 📞 Support & Contribution

### Reporting Issues
Utilisez GitHub Issues : https://github.com/natalie-simon/nutritrakpro/issues

### Contributing
1. Fork le repository
2. Créer une branche feature : `git checkout -b feature/amazing-feature`
3. Commit changements : `git commit -m 'feat: add amazing feature'`
4. Push : `git push origin feature/amazing-feature`
5. Ouvrir une Pull Request

---

## 📄 License

Ce projet est sous licence MIT.

---

**Version:** 2.0.0-alpha
**Dernière mise à jour:** 2025-01-09
**Auteur:** Natalie Simon
