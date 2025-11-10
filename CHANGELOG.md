# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [0.1.0] - 2025-11-10

### ✨ Première version fonctionnelle - Mode Local

Version initiale de ScanAssiette en mode 100% local (localStorage) sans backend.

### Ajouté

#### 🎯 Fonctionnalités principales
- **Historique des repas** : Tableau de bord avec vue sur 7 jours
- **Scanner de codes-barres** : Intégration Open Food Facts pour scanner les produits
- **Recherche manuelle** : Base USDA FoodData Central avec 25 résultats par recherche
- **Ajout manuel** : Formulaire pour créer des repas personnalisés
- **Paramètres** : Configuration de l'objectif calorique journalier et mode sombre

#### 📊 Dashboard et statistiques
- Suivi de l'objectif calorique journalier avec barre de progression
- Affichage des macronutriments (calories, protéines, glucides, lipides)
- Regroupement des repas par date (7 derniers jours)
- Cartes résumé avec couleurs différenciées par macro

#### 🔧 Gestion des repas
- Ajustement de portions pour produits scannés (100g de base)
- Recalcul automatique des valeurs nutritionnelles selon la portion
- Badges de méthode (manuel, barcode, recherche)
- Édition et suppression de repas
- Horodatage date/heure pour chaque repas

#### 💾 Persistance locale
- Stockage 100% localStorage (pas de base de données)
- Service de stockage avec CRUD complet
- Service de nutrition avec validation de données
- Export CSV des données
- Gestion du compteur d'utilisation Clarifai (prêt pour future intégration)

#### 🎨 Interface utilisateur
- Design responsive mobile-first
- Mode sombre complet
- Tailwind CSS pour le styling
- Navigation par onglets
- Animations et transitions fluides

#### 🔌 Intégrations API
- **Open Food Facts** : Scanner de codes-barres (illimité, pas de CORS)
- **USDA FoodData Central** : Recherche d'aliments (illimité, pas de CORS)
- **Clarifai** : Code présent mais fonctionnalité désactivée (problèmes CORS en mode local)

#### 📦 Architecture technique
- Vue.js 3 avec Composition API
- Pinia pour la gestion d'état globale
- Vue Router pour la navigation
- Composables réutilisables (useBarcode, useSearch, usePhoto)
- Services métier (storage, nutrition, export)
- Build optimisé avec Vite et esbuild

### 🚫 Limitations connues

- **Analyse photo IA désactivée** : Nécessite un backend ou serverless pour contourner CORS
- **Pas de synchronisation cloud** : Données uniquement en localStorage (par design)
- **Pas d'authentification** : Mode local-first sans comptes utilisateurs
- **Export limité** : CSV uniquement (pas de JSON/PDF pour l'instant)

### 📝 Notes techniques

- **Local mode activé** : `LOCAL_MODE = true` dans le router
- **Minification** : Utilise esbuild (plus rapide que terser)
- **Bundle size** : ~540 KB total (~172 KB gzippé)
- **Compatibilité** : Node.js >= 18.0.0, navigateurs modernes

### 🎯 Prochaines étapes suggérées (non implémentées)

- Graphiques de progression sur 7 jours (Chart.js déjà installé)
- Mode PWA pour utilisation offline
- Amélioration de l'ajustement des portions (unités multiples)
- Backend Laravel pour synchronisation (architecture prête)
- Réactivation de l'analyse photo avec backend

---

**Mode de développement** : `npm run dev` dans `/frontend`
**Build production** : `npm run build` dans `/frontend`
**Démo en ligne** : Déployable sur tout hébergeur statique (Netlify, GitHub Pages, etc.)
