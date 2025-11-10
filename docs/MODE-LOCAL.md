# ScanAssiette - Mode Local (Version Hors Ligne)

**Version:** 1.0.0 (Mode Local)
**Date:** 10 Novembre 2025
**Stack:** Vue.js 3 + Vite + Pinia + Tailwind CSS

---

## 🎯 Objectif

Créer une version **100% fonctionnelle hors ligne** de ScanAssiette avec :
- ✅ Stockage 100% local (localStorage)
- ✅ APIs externes gratuites (Clarifai, USDA, Open Food Facts)
- ✅ Pas d'authentification (mode invité)
- ✅ Pas de backend Laravel (pour l'instant)
- ✅ Interface responsive mobile-first
- ✅ Prêt pour migration future vers mode connecté

---

## 📋 Fonctionnalités Requises

### 1. Scanner de Codes-Barres 📷
- Scan caméra (nécessite HTTPS ou localhost)
- Saisie manuelle du code-barre
- Recherche via Open Food Facts
- Ajout direct du produit scanné

### 2. Analyse Photo 🍽️
- Upload/glisser-déposer d'image
- Reconnaissance IA via Clarifai
- Liste des aliments détectés
- Sélection et ajout au journal

### 3. Recherche Manuelle 🔍
- Recherche d'aliments dans USDA FoodData Central
- 300 000+ aliments disponibles
- Affichage des valeurs nutritionnelles
- Ajout manuel si aliment introuvable

### 4. Tableau de Bord du Jour 📊
- Total calories consommées
- Répartition protéines/glucides/lipides
- Barre de progression objectif calorique
- Liste des repas du jour

### 5. Historique 7 Jours 📈
- Graphique Chart.js des calories quotidiennes
- Liste détaillée des repas par jour
- Modification/suppression d'entrées
- Export CSV des données

### 6. Paramètres ⚙️
- Définir objectif calorique quotidien
- Mode sombre/clair
- Gestion des clés API
- Effacer toutes les données

---

## 🏗️ Architecture Technique

### Stack Frontend
```
Vue.js 3.4         → Framework réactif
Vite 5.0           → Build tool ultra-rapide
Pinia 2.1          → State management
Vue Router 4.3     → Navigation SPA
Tailwind CSS 3.4   → Styling
Axios 1.6          → HTTP client
Chart.js 4.4       → Graphiques
html5-qrcode 2.3   → Scanner codes-barres
```

### APIs Externes (Gratuites)
```
Open Food Facts    → Codes-barres (illimité)
Clarifai           → Photos IA (1000/mois)
USDA FoodData      → Nutrition (illimité)
```

### Stockage Local
```javascript
localStorage: {
  scanassiette_meals: [],      // Liste des repas
  scanassiette_settings: {},   // Paramètres utilisateur
  clarifai_usage: 0            // Compteur API Clarifai
}
```

---

## 📁 Structure de Fichiers

```
frontend/
├── src/
│   ├── services/
│   │   ├── api.js                    ✅ Existe - APIs externes
│   │   ├── storage.service.js        🆕 Gestion localStorage
│   │   ├── nutrition.service.js      🆕 CRUD repas
│   │   └── export.service.js         🆕 Export CSV
│   │
│   ├── stores/
│   │   ├── auth.js                   ✅ Existe (désactivé)
│   │   ├── user.js                   ✅ Existe
│   │   ├── meals.js                  🆕 État repas
│   │   └── settings.js               🆕 État paramètres
│   │
│   ├── composables/
│   │   ├── useBarcode.js             🆕 Logique scanner
│   │   ├── usePhoto.js               🆕 Logique photos
│   │   ├── useSearch.js              🆕 Logique recherche
│   │   └── useStats.js               🆕 Calculs stats
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue         🆕 Header
│   │   │   ├── AppNav.vue            🆕 Navigation
│   │   │   └── AppFooter.vue         🆕 Footer
│   │   ├── meals/
│   │   │   ├── MealCard.vue          🆕 Carte repas
│   │   │   ├── MealList.vue          🆕 Liste repas
│   │   │   └── MealForm.vue          🆕 Formulaire ajout/edit
│   │   ├── scanner/
│   │   │   └── BarcodeScanner.vue    🆕 Scanner barcode
│   │   ├── photo/
│   │   │   ├── PhotoUpload.vue       🆕 Upload photo
│   │   │   └── FoodPredictions.vue   🆕 Résultats IA
│   │   ├── search/
│   │   │   └── FoodSearchResults.vue 🆕 Résultats recherche
│   │   ├── dashboard/
│   │   │   ├── DailySummary.vue      🆕 Résumé jour
│   │   │   ├── GoalProgress.vue      🆕 Progression objectif
│   │   │   └── MacrosBreakdown.vue   🆕 Répartition macros
│   │   └── charts/
│   │       └── CaloriesChart.vue     🆕 Graphique Chart.js
│   │
│   └── views/
│       ├── ScannerView.vue           🆕 Page scanner
│       ├── PhotoView.vue             🆕 Page photo
│       ├── SearchView.vue            🆕 Page recherche
│       ├── HistoryView.vue           🆕 Page historique
│       └── SettingsView.vue          🆕 Page paramètres
│
└── public/
    └── icons/                        🆕 Icons SVG
```

---

## 🚀 Plan d'Implémentation

### **Phase 1 : Fondations (Services)**

#### Étape 1.1 : Service de Stockage
**Fichier:** `services/storage.service.js`

```javascript
// Fonctions à implémenter :
- saveMeal(meal)           // Sauvegarder un repas
- getMeals(filters)        // Récupérer repas (avec filtres date)
- updateMeal(id, data)     // Modifier un repas
- deleteMeal(id)           // Supprimer un repas
- getSettings()            // Récupérer paramètres
- updateSettings(settings) // Modifier paramètres
- clearAllData()           // Reset complet
```

#### Étape 1.2 : Service Nutrition
**Fichier:** `services/nutrition.service.js`

```javascript
// Abstraction CRUD avec logique métier :
- addMeal(mealData)        // Valider + sauvegarder
- getMealsByDate(date)     // Repas d'un jour
- getDailyTotal(date)      // Total calories/macros
- getWeeklyStats()         // Stats 7 jours
- calculateGoalProgress()  // % objectif atteint
```

#### Étape 1.3 : Service Export
**Fichier:** `services/export.service.js`

```javascript
// Export CSV :
- exportMealsToCSV(startDate, endDate)
- generateCSVContent(meals)
- downloadCSV(content, filename)
```

---

### **Phase 2 : État Global (Stores Pinia)**

#### Étape 2.1 : Store Settings
**Fichier:** `stores/settings.js`

```javascript
// State :
- dailyCalorieGoal (2000)
- darkMode (false)
- language ('fr')
- clarifaiUsage (0)

// Actions :
- loadSettings()
- updateGoal(calories)
- toggleDarkMode()
- incrementClarifaiUsage()
```

#### Étape 2.2 : Store Meals
**Fichier:** `stores/meals.js`

```javascript
// State :
- meals (Array)
- todayMeals (Computed)
- dailyTotal (Computed)
- weeklyStats (Computed)

// Actions :
- loadMeals()
- addMeal(meal)
- updateMeal(id, data)
- deleteMeal(id)
- getTodayTotal()
```

---

### **Phase 3 : Logique Réutilisable (Composables)**

#### Étape 3.1 : useBarcode
**Fichier:** `composables/useBarcode.js`

```javascript
// Logique scanner codes-barres :
- startScanner(elementId)
- stopScanner()
- searchBarcode(code)
- parseOpenFoodFactsData(product)
```

#### Étape 3.2 : usePhoto
**Fichier:** `composables/usePhoto.js`

```javascript
// Logique analyse photos :
- uploadPhoto(file)
- analyzePhoto(base64)
- parseClarifaiResults(predictions)
- handlePhotoError(error)
```

#### Étape 3.3 : useSearch
**Fichier:** `composables/useSearch.js`

```javascript
// Logique recherche USDA :
- searchFood(query)
- parseUSDAResults(foods)
- getFoodDetails(fdcId)
```

#### Étape 3.4 : useStats
**Fichier:** `composables/useStats.js`

```javascript
// Calculs statistiques :
- calculateDailyTotal(meals)
- calculateGoalProgress(consumed, goal)
- getLast7DaysData()
- calculateMacrosPercentage(proteins, carbs, fats)
```

---

### **Phase 4 : Composants Réutilisables**

#### Étape 4.1 : Layout Components

**AppHeader.vue**
- Logo + titre "ScanAssiette"
- Bouton toggle dark mode
- Résumé calories du jour

**AppNav.vue**
- Navigation tabs (Scanner, Photo, Recherche, Historique, Paramètres)
- Active state styling
- Responsive mobile

**AppFooter.vue**
- Liens vers APIs utilisées
- Mentions légales

#### Étape 4.2 : Meals Components

**MealCard.vue**
```vue
// Props: meal
// Affiche:
- Photo (si disponible)
- Nom + heure
- Calories + macros
- Boutons edit/delete
- Badge méthode (photo/barcode/manual)
```

**MealList.vue**
```vue
// Props: meals, showDate
// Affiche:
- Liste de MealCard
- Groupement par date
- Message si vide
```

**MealForm.vue**
```vue
// Props: meal (pour édition)
// Formulaire:
- Nom du repas
- Calories, protéines, glucides, lipides
- Portion (100g, unité, etc.)
- Bouton sauvegarder
```

#### Étape 4.3 : Scanner Components

**BarcodeScanner.vue**
```vue
// Fonctionnalités:
- Bouton démarrer/arrêter scanner
- Vidéo caméra en direct
- Input saisie manuelle
- Affichage résultat scan
- Gestion erreurs HTTPS
```

#### Étape 4.4 : Photo Components

**PhotoUpload.vue**
```vue
// Fonctionnalités:
- Zone drag & drop
- Bouton upload fichier
- Preview image
- Bouton analyser
- Loading state
```

**FoodPredictions.vue**
```vue
// Props: predictions
// Affiche:
- Liste aliments détectés
- Score de confiance
- Recherche auto USDA pour chaque aliment
- Boutons ajouter individuels
```

#### Étape 4.5 : Dashboard Components

**DailySummary.vue**
```vue
// Affiche:
- 4 cards (Calories, Protéines, Glucides, Lipides)
- Valeurs du jour
- Animation compteur
```

**GoalProgress.vue**
```vue
// Props: consumed, goal
// Affiche:
- Barre de progression
- Pourcentage atteint
- Calories restantes
- Message encouragement
```

**MacrosBreakdown.vue**
```vue
// Props: proteins, carbs, fats
// Affiche:
- Répartition en % des macros
- Graphique circulaire (optionnel)
- Recommandations (optionnel)
```

#### Étape 4.6 : Charts Components

**CaloriesChart.vue**
```vue
// Props: data (7 jours)
// Affiche:
- Graphique Chart.js (bar/line)
- Axe X : dates
- Axe Y : calories
- Ligne objectif calorique
```

---

### **Phase 5 : Vues/Pages**

#### Étape 5.1 : ScannerView.vue
```vue
<template>
  <AppHeader />
  <AppNav active="scanner" />

  <main>
    <BarcodeScanner @scan-success="handleScanSuccess" />

    <div v-if="scannedProduct">
      <ProductPreview :product="scannedProduct" />
      <MealForm :initial-data="scannedProduct" @save="addMeal" />
    </div>
  </main>
</template>
```

#### Étape 5.2 : PhotoView.vue
```vue
<template>
  <AppHeader />
  <AppNav active="photo" />

  <main>
    <PhotoUpload @photo-uploaded="analyzePhoto" />

    <div v-if="predictions">
      <FoodPredictions
        :predictions="predictions"
        @add-food="addMealFromPrediction"
      />
    </div>
  </main>
</template>
```

#### Étape 5.3 : SearchView.vue
```vue
<template>
  <AppHeader />
  <AppNav active="search" />

  <main>
    <SearchBar @search="searchFood" />

    <FoodSearchResults
      :results="searchResults"
      @select="showMealForm"
    />

    <MealForm
      v-if="selectedFood"
      :initial-data="selectedFood"
      @save="addMeal"
    />
  </main>
</template>
```

#### Étape 5.4 : HistoryView.vue
```vue
<template>
  <AppHeader />
  <AppNav active="history" />

  <main>
    <!-- Résumé du jour -->
    <GoalProgress :consumed="todayTotal" :goal="calorieGoal" />
    <DailySummary :data="todayTotal" />

    <!-- Graphique 7 jours -->
    <CaloriesChart :data="weeklyStats" />

    <!-- Actions -->
    <button @click="exportCSV">📥 Exporter CSV</button>
    <button @click="clearHistory">🗑️ Effacer</button>

    <!-- Liste repas -->
    <MealList
      :meals="allMeals"
      @edit="editMeal"
      @delete="deleteMeal"
    />
  </main>
</template>
```

#### Étape 5.5 : SettingsView.vue
```vue
<template>
  <AppHeader />
  <AppNav active="settings" />

  <main>
    <!-- Objectif calorique -->
    <div>
      <label>Objectif quotidien (kcal)</label>
      <input v-model="calorieGoal" type="number" />
      <button @click="saveGoal">Enregistrer</button>
    </div>

    <!-- Mode sombre -->
    <div>
      <label>Mode sombre</label>
      <toggle v-model="darkMode" />
    </div>

    <!-- Statut APIs -->
    <div>
      <h3>📊 Statut des APIs</h3>
      <p>Clarifai : {{ clarifaiUsage }}/1000</p>
      <p>Open Food Facts : ✅ Disponible</p>
      <p>USDA : ✅ Disponible</p>
    </div>

    <!-- Danger zone -->
    <button @click="clearAllData" class="danger">
      ⚠️ Effacer toutes les données
    </button>
  </main>
</template>
```

---

### **Phase 6 : Configuration & Tests**

#### Étape 6.1 : Modifier le Router
**Fichier:** `router/index.js`

```javascript
// Désactiver temporairement l'authentification
router.beforeEach((to, from, next) => {
  // Commenter la vérification auth pour le mode local
  // const authStore = useAuthStore()
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   next({ name: 'Login' })
  // }

  next() // Laisser passer tout le monde
})
```

#### Étape 6.2 : Configuration App.vue
**Fichier:** `App.vue`

```vue
<template>
  <div id="app" :class="{ 'dark': isDarkMode }">
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const isDarkMode = computed(() => settingsStore.darkMode)
</script>
```

#### Étape 6.3 : Tests Manuels

**Checklist de tests :**
- [ ] Scanner code-barre manuel fonctionne
- [ ] Scanner caméra fonctionne (HTTPS/localhost)
- [ ] Upload photo + analyse Clarifai
- [ ] Recherche USDA retourne résultats
- [ ] Ajout repas depuis chaque méthode
- [ ] Total calories du jour correct
- [ ] Graphique 7 jours s'affiche
- [ ] Export CSV télécharge fichier
- [ ] Modification repas fonctionne
- [ ] Suppression repas fonctionne
- [ ] Mode sombre s'active
- [ ] Objectif calorique se sauvegarde
- [ ] Données persistent après refresh

---

## 📊 Structure Données localStorage

### Meal Object
```javascript
{
  id: "1699876543210",              // Timestamp
  date: "2025-11-10",               // Format YYYY-MM-DD
  time: "12:30",                    // Format HH:mm
  name: "Salade César",             // Nom du repas
  calories: 450,                    // kcal
  proteins: 25,                     // grammes
  carbs: 30,                        // grammes
  fats: 20,                         // grammes
  fiber: 5,                         // grammes (optionnel)
  method: "photo",                  // "photo" | "barcode" | "manual"
  source: "clarifai",               // "clarifai" | "openfoodfacts" | "usda" | "manual"
  photo: "data:image/jpeg;base64...", // Base64 ou null
  barcode: "3017620422003",         // Code EAN ou null
  confidence: 0.95,                 // Score IA (0-1) ou null
  portion: {
    quantity: 150,                  // Nombre
    unit: "g"                       // "g" | "ml" | "unité"
  },
  createdAt: "2025-11-10T12:30:00.000Z",
  updatedAt: "2025-11-10T12:35:00.000Z"
}
```

### Settings Object
```javascript
{
  dailyCalorieGoal: 2000,           // kcal
  darkMode: false,                  // boolean
  language: "fr",                   // "fr" | "en"
  clarifaiUsage: 0,                 // Compteur mois en cours
  clarifaiResetDate: "2025-11-01",  // Reset compteur chaque mois
  units: "metric",                  // "metric" | "imperial"
  notifications: true               // Activer notifications (PWA)
}
```

---

## 🔧 Configuration APIs Externes

### Clarifai (Analyse Photos)
```javascript
// services/api.js
export const CLARIFAI_API_KEY = 'VOTRE_CLE_ICI'
const CLARIFAI_MODEL = 'food-item-recognition'
const CLARIFAI_LIMIT = 1000 // Requêtes/mois

// Endpoint
POST https://api.clarifai.com/v2/models/food-item-recognition/outputs
Headers: { Authorization: `Key ${CLARIFAI_API_KEY}` }
```

### USDA FoodData Central (Recherche)
```javascript
// services/api.js
export const USDA_API_KEY = 'VOTRE_CLE_ICI'

// Endpoint
GET https://api.nal.usda.gov/fdc/v1/foods/search?api_key=XXX&query=apple
```

### Open Food Facts (Codes-barres)
```javascript
// Pas de clé requise
// Endpoint
GET https://world.openfoodfacts.org/api/v0/product/{barcode}.json
```

---

## ⚠️ Gestion des Erreurs & Fallbacks

### Clarifai (Limité 1000/mois)
```javascript
if (clarifaiUsage >= 1000) {
  // Fallback : Afficher message + proposer recherche manuelle
  showError('Limite Clarifai atteinte ce mois-ci. Utilisez la recherche manuelle.')
  redirectTo('/search')
}
```

### Connexion Réseau
```javascript
try {
  const result = await searchUSDAFood(query)
} catch (error) {
  if (!navigator.onLine) {
    showError('Pas de connexion internet. Cette fonctionnalité nécessite une connexion.')
  } else {
    showError('Erreur API USDA. Réessayez plus tard.')
  }
}
```

### Scanner Caméra (HTTPS requis)
```javascript
if (!window.isSecureContext) {
  showWarning('Scanner caméra nécessite HTTPS. Utilisez la saisie manuelle.')
  disableCameraScanner()
}
```

---

## 🎨 Design System (Tailwind CSS)

### Palette de Couleurs
```css
/* Primaires */
--green-primary: #10b981   /* Actions principales */
--blue-primary: #3b82f6    /* Analyse/Photo */
--purple-primary: #8b5cf6  /* Stats/Graphiques */

/* États */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6

/* Neutres */
--gray-50: #f9fafb
--gray-800: #1f2937
```

### Composants
```
Buttons : rounded-lg, font-semibold, transition
Cards : bg-white, rounded-lg, shadow-xl, p-6
Inputs : border-gray-300, focus:ring-2, focus:ring-green-500
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Base: < 640px
sm: 640px   (tablettes)
md: 768px   (tablettes large)
lg: 1024px  (desktop)
xl: 1280px  (desktop large)
```

---

## 🚀 Commandes de Développement

```bash
# Installation
cd frontend
npm install

# Développement
npm run dev
# → http://localhost:5173

# Build production
npm run build

# Preview production
npm run preview
```

---

## 📈 Migration Future vers Mode Connecté

### Étapes de Migration (Phase 2)

1. **Activer l'authentification**
   - Décommenter guards dans router
   - Créer pages Login/Register

2. **Créer endpoints Laravel**
   ```
   POST /api/meals          → Créer repas
   GET  /api/meals          → Liste repas
   PUT  /api/meals/{id}     → Modifier
   DELETE /api/meals/{id}   → Supprimer
   GET  /api/stats/daily    → Stats jour
   GET  /api/stats/weekly   → Stats semaine
   ```

3. **Modifier services**
   ```javascript
   // nutrition.service.js
   const USE_LOCAL_MODE = false // Basculer vers API

   async addMeal(meal) {
     if (USE_LOCAL_MODE) {
       return storageService.saveMeal(meal)
     } else {
       return apiClient.post('/meals', meal)
     }
   }
   ```

4. **Synchronisation**
   - Sync local → serveur au login
   - Offline mode avec queue de sync
   - Résolution conflits

---

## 🎯 Prochaines Étapes Immédiates

### À Faire Maintenant

1. ✅ Valider ce plan avec vous
2. 🔨 Créer les services (storage, nutrition, export)
3. 🔨 Créer les stores Pinia (settings, meals)
4. 🔨 Créer les composables (useBarcode, usePhoto, etc.)
5. 🔨 Créer les composants réutilisables
6. 🔨 Créer les vues/pages
7. 🧪 Tests manuels complets
8. 🚀 Déployer sur Vercel/Netlify

---

## 📝 Notes Importantes

- **Pas de backend** pour cette version
- **localStorage suffit** pour le mode local
- **APIs gratuites** mais avec limites (Clarifai 1000/mois)
- **HTTPS requis** pour scanner caméra (ou localhost)
- **Mobile-first** : interface optimisée mobile
- **Progressive** : facile de migrer vers API plus tard

---

## 📞 Support & Ressources

### Documentation APIs
- [Open Food Facts API](https://world.openfoodfacts.org/data)
- [Clarifai Food Recognition](https://www.clarifai.com/models/food-item-recognition)
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)

### Documentation Vue.js
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Pinia State Management](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)

### Librairies
- [html5-qrcode Scanner](https://github.com/mebjas/html5-qrcode)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Prêt à démarrer l'implémentation !** 🚀
