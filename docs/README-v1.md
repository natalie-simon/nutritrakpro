# 🥗 NutriTrack Pro - Suivi Nutritionnel 100% Gratuit

Application web complète pour suivre votre alimentation quotidienne avec scan de codes-barres, analyse de photos et recherche manuelle d'aliments. **Entièrement gratuite et respectueuse de votre vie privée !**

## ✨ Fonctionnalités

### 📷 Scanner de Code-Barre (Open Food Facts)
- Scanner caméra en temps réel pour les codes-barres
- Saisie manuelle du code-barre
- **API gratuite et illimitée** - Aucune clé requise
- Informations nutritionnelles complètes :
  - Calories, protéines, glucides, lipides
  - Nutri-Score (A, B, C, D, E)
  - Sucres, fibres, sel
  - Photo du produit

### 🍽️ Analyse de Photo d'Assiette (Clarifai AI)
- Upload de photo par drag & drop ou sélection
- Reconnaissance automatique des aliments via IA
- **1000 analyses gratuites par mois**
- Identification de plusieurs aliments sur une même photo
- Calcul automatique des calories totales
- Niveau de confiance pour chaque aliment détecté

### 🔍 Recherche Manuelle d'Aliments (USDA FoodData Central)
- Base de données de plus de 300 000 aliments
- **API gratuite et illimitée**
- Recherche par nom (en anglais pour meilleurs résultats)
- Informations nutritionnelles détaillées pour chaque aliment

### 📊 Historique et Statistiques
- Historique quotidien avec toutes vos entrées
- **Graphique des 7 derniers jours** (Chart.js)
- Totaux quotidiens : calories, protéines, glucides, lipides
- **Objectif calorique personnalisable** avec barre de progression
- Export des données en **CSV**
- Indicateur de type pour chaque entrée (scanner, photo, recherche)

### ⚙️ Paramètres
- Configuration des clés API (gratuites)
- Gestion de l'objectif calorique quotidien
- **Mode sombre/clair**
- Indicateurs de statut des APIs
- Gestion complète des données

### 💾 Stockage Local
- Toutes les données stockées dans votre navigateur (localStorage)
- Aucune donnée envoyée à des serveurs tiers
- Protection de votre vie privée

## 🚀 Installation et Configuration

### Étape 1 : Installation

1. **Téléchargez les fichiers** :
   ```bash
   # Les 3 fichiers nécessaires :
   - index.html
   - app.js
   - README.md
   ```

2. **C'est tout !** Aucune installation supplémentaire nécessaire.
   - Les dépendances (Tailwind CSS, html5-qrcode, Chart.js) sont chargées via CDN

### Étape 2 : Ouvrir l'application

**Option 1 : Simple (double-clic)**
```bash
# Double-cliquez sur index.html
# Ou clic droit → "Ouvrir avec" → Votre navigateur
```

**Option 2 : Serveur local (recommandé pour la caméra)**
```bash
# Avec Python 3
python -m http.server 8000
# Puis ouvrez http://localhost:8000

# Avec Node.js
npx http-server -p 8000
# Puis ouvrez http://localhost:8000

# Avec PHP
php -S localhost:8000
# Puis ouvrez http://localhost:8000
```

### Étape 3 : Configuration des APIs (OPTIONNEL mais recommandé)

## 🔑 Obtenir vos Clés API Gratuites

### API 1 : Clarifai (Reconnaissance d'aliments)

**Limite gratuite : 1000 requêtes/mois**

#### Instructions détaillées :

1. **Créez un compte gratuit** :
   - Visitez : [https://www.clarifai.com/](https://www.clarifai.com/)
   - Cliquez sur "Sign Up" (Inscription)
   - Utilisez votre email ou connectez-vous avec GitHub/Google

2. **Créez une application** :
   - Une fois connecté, allez dans "My Apps"
   - Cliquez sur "Create an App"
   - Donnez un nom (ex: "NutriTrack")
   - Sélectionnez "Food" comme cas d'usage
   - Cliquez sur "Create App"

3. **Générez votre clé API** :
   - Dans votre application, allez dans "Settings"
   - Cliquez sur "Security"
   - Sous "API Keys", cliquez sur "Create API Key"
   - Donnez un nom à la clé (ex: "prod")
   - Sélectionnez les permissions nécessaires (Read)
   - Cliquez sur "Save"
   - **COPIEZ la clé** (vous ne pourrez plus la voir après)

4. **Ajoutez la clé dans NutriTrack** :
   - Ouvrez NutriTrack
   - Allez dans l'onglet "⚙️ Paramètres"
   - Collez votre clé dans le champ "Clarifai API Key"
   - Cliquez sur "Enregistrer"

#### Note importante :
- Vous avez **1000 appels gratuits par mois**
- L'application compte vos utilisations localement
- Le compteur se réinitialise chaque mois automatiquement chez Clarifai

### API 2 : USDA FoodData Central (Base nutritionnelle)

**Limite gratuite : ILLIMITÉE**

#### Instructions détaillées :

1. **Visitez la page d'inscription** :
   - [https://fdc.nal.usda.gov/api-key-signup.html](https://fdc.nal.usda.gov/api-key-signup.html)

2. **Remplissez le formulaire** :
   - **First Name** : Votre prénom
   - **Last Name** : Votre nom
   - **Email** : Votre adresse email
   - **Organization** : Optionnel (vous pouvez mettre "Personal" ou laisser vide)
   - Cochez la case des termes d'utilisation
   - Cliquez sur "Submit"

3. **Recevez votre clé** :
   - Vous recevrez un email **INSTANTANÉMENT**
   - L'email contient votre clé API
   - **Aucune vérification supplémentaire nécessaire**

4. **Ajoutez la clé dans NutriTrack** :
   - Ouvrez NutriTrack
   - Allez dans l'onglet "⚙️ Paramètres"
   - Collez votre clé dans le champ "USDA API Key"
   - Cliquez sur "Enregistrer"

#### Note importante :
- **Gratuit et illimité à vie**
- Utilisations commerciales autorisées
- Base de données maintenue par le gouvernement américain
- Plus de 300 000 aliments référencés

### API 3 : Open Food Facts (Scanner de code-barre)

**Limite gratuite : ILLIMITÉE**

#### Bonne nouvelle :
- **AUCUNE CONFIGURATION REQUISE !**
- API totalement gratuite et ouverte
- Aucune clé API nécessaire
- Fonctionne immédiatement dès l'ouverture de l'application

## 📖 Guide d'Utilisation

### Scanner un Produit (Code-Barre)

1. Allez dans l'onglet "📷 Scanner"
2. **Option A : Scanner caméra**
   - Cliquez sur "📸 Démarrer le scanner caméra"
   - Autorisez l'accès à la caméra si demandé
   - Pointez vers un code-barre
   - La détection est automatique
3. **Option B : Saisie manuelle**
   - Entrez le code-barre dans le champ de saisie
   - Cliquez sur "Rechercher"
   - Exemple : `3017620422003` (Nutella)
4. Consultez les informations nutritionnelles
5. Cliquez sur "✅ Ajouter à l'historique"

### Analyser une Photo

1. **Configurez d'abord votre clé API Clarifai** (voir section "Obtenir vos Clés API")
2. Allez dans l'onglet "🍽️ Photo"
3. Glissez-déposez une photo OU cliquez sur "Sélectionner un fichier"
4. Cliquez sur "🔍 Analyser cette photo"
5. L'IA détecte automatiquement les aliments
6. Consultez les résultats avec calories estimées
7. Cliquez sur "✅ Ajouter à l'historique"

**Conseils pour de meilleurs résultats :**
- Utilisez des photos claires et bien éclairées
- Photographiez l'assiette d'en haut
- Évitez les ombres importantes
- Un seul plat par photo pour plus de précision

### Rechercher un Aliment

1. **Configurez d'abord votre clé API USDA** (voir section "Obtenir vos Clés API")
2. Allez dans l'onglet "🔍 Recherche"
3. Entrez le nom d'un aliment (anglais recommandé)
   - Exemples : "chicken breast", "apple", "rice", "broccoli"
   - Français possible mais résultats moins précis
4. Cliquez sur "Rechercher"
5. Parcourez les résultats (10 aliments affichés)
6. Cliquez sur "✅ Ajouter à l'historique" sur l'aliment souhaité

### Consulter l'Historique

1. Allez dans l'onglet "📊 Historique"
2. **Objectif du jour** :
   - Visualisez votre progression vers votre objectif calorique
   - Barre de progression colorée (vert → jaune → rouge)
   - Calories restantes calculées automatiquement
3. **Résumé du jour** :
   - Totaux : calories, protéines, glucides, lipides
   - Mis à jour en temps réel
4. **Graphique 7 jours** :
   - Visualisez vos calories sur la semaine
   - Identifiez vos tendances
5. **Liste des entrées** :
   - Chaque entrée affiche : type (📷/🍽️/🔍), nom, heure, valeurs nutritionnelles
   - Supprimez une entrée en cliquant sur 🗑️
6. **Export CSV** :
   - Cliquez sur "📥 Exporter CSV"
   - Fichier téléchargé automatiquement
   - Compatible Excel, Google Sheets

### Configurer les Paramètres

1. Allez dans l'onglet "⚙️ Paramètres"
2. **Objectif calorique** :
   - Entrez votre objectif quotidien (ex: 2000 kcal)
   - Cliquez sur "Enregistrer"
   - L'objectif s'affiche dans l'onglet Historique
3. **Clés API** :
   - Ajoutez vos clés Clarifai et USDA
   - Vérifiez le statut (✅ ou ❌)
4. **Mode sombre** :
   - Cliquez sur l'icône 🌙/☀️ en haut à droite
   - Le mode est sauvegardé automatiquement

## 🌐 Compatibilité

### Navigateurs Recommandés
| Navigateur | Scanner Caméra | Photo | Recherche | Historique |
|------------|----------------|-------|-----------|------------|
| Chrome     | ✅             | ✅    | ✅        | ✅         |
| Edge       | ✅             | ✅    | ✅        | ✅         |
| Firefox    | ✅             | ✅    | ✅        | ✅         |
| Safari     | ✅ (iOS 11+)   | ✅    | ✅        | ✅         |

### Notes Importantes
- **Scanner caméra** : Nécessite HTTPS ou localhost
- **Mobile** : Interface responsive optimisée
- **Permissions** : Autoriser l'accès caméra pour le scanner

## 💰 Coûts et Limites des APIs

| API | Limite Gratuite | Coût Dépassement | Note |
|-----|----------------|------------------|------|
| **Open Food Facts** | ♾️ Illimité | Toujours gratuit | Aucune clé requise |
| **Clarifai** | 1000/mois | ~$1.20/1000 appels | Largement suffisant |
| **USDA FoodData** | ♾️ Illimité | Toujours gratuit | Base gouvernementale |

### Estimation d'utilisation

**Usage typique** (1 personne) :
- Scanner : 5-10 produits/jour = ~300/mois ✅ Gratuit
- Photos : 2-3 repas/jour = ~90/mois ✅ Gratuit (< 1000)
- Recherche : 5 recherches/jour = ~150/mois ✅ Gratuit

**Vous restez dans les limites gratuites même en utilisant l'app intensivement !**

## 🔒 Vie Privée et Sécurité

### Données Locales Uniquement
- ✅ Toutes vos données sont stockées dans **votre navigateur**
- ✅ Aucun serveur externe ne reçoit vos informations personnelles
- ✅ Historique, clés API, paramètres : tout reste chez vous

### APIs Externes
- Les appels aux APIs (Clarifai, USDA, Open Food Facts) envoient uniquement :
  - Clarifai : l'image uploadée (pour analyse)
  - USDA : le nom de l'aliment recherché
  - Open Food Facts : le code-barre scanné
- **Aucune donnée personnelle n'est transmise**

### Clés API
- Vos clés API sont stockées en localStorage
- Elles ne quittent JAMAIS votre navigateur
- Pour supprimer : "Effacer toutes les données" dans Paramètres

## 🗂️ Structure des Fichiers

```
nutrition-tracker/
│
├── index.html          # Interface utilisateur complète
│                       # - Navigation par onglets
│                       # - Formulaires et zones d'upload
│                       # - Affichage des résultats
│
├── app.js              # Logique applicative (1200+ lignes)
│                       # - Gestion des APIs (Clarifai, USDA, Open Food Facts)
│                       # - Scanner de code-barre
│                       # - Analyse de photos
│                       # - Recherche manuelle
│                       # - Historique et graphiques
│                       # - Export CSV
│                       # - Mode sombre
│
└── README.md           # Ce fichier - Documentation complète
```

## 🐛 Dépannage

### Le scanner caméra ne démarre pas
**Causes possibles :**
- Permissions caméra refusées
- Navigation en HTTP (au lieu de HTTPS ou localhost)
- Caméra utilisée par une autre application

**Solutions :**
1. Vérifiez les permissions du navigateur (🔒 dans la barre d'URL)
2. Utilisez un serveur local (voir section Installation)
3. Fermez les autres apps utilisant la caméra
4. Utilisez la saisie manuelle en dernier recours

### Analyse de photo ne fonctionne pas
**Vérifiez :**
- ✅ Clé API Clarifai configurée et valide
- ✅ Connexion internet active
- ✅ Format de l'image supporté (JPG, PNG)
- ✅ Vous n'avez pas dépassé 1000 requêtes/mois

**Solutions :**
- Allez dans Paramètres → vérifiez le statut Clarifai
- Testez avec une autre photo
- Attendez le mois prochain si limite atteinte

### Recherche d'aliments ne donne pas de résultats
**Problèmes courants :**
- ❌ Clé USDA non configurée
- ❌ Orthographe incorrecte
- ❌ Recherche en français (base américaine)

**Solutions :**
- Configurez votre clé USDA (gratuite, instantanée)
- Essayez en anglais : "banana" au lieu de "banane"
- Utilisez des termes génériques : "chicken" plutôt que "poulet rôti aux herbes"

### Les totaux ne s'affichent pas
**Solutions :**
1. Rafraîchissez la page (F5)
2. Vérifiez que localStorage est activé dans votre navigateur
3. Effacez le cache et rechargez l'application

### Le graphique 7 jours est vide
**C'est normal si :**
- Vous venez d'installer l'application
- Vous n'avez pas encore d'historique

**Solution :**
- Ajoutez des entrées, le graphique se remplira progressivement

### Erreur "API Key Invalid"
**Pour Clarifai :**
1. Vérifiez que la clé est bien copiée (sans espaces)
2. Régénérez une nouvelle clé sur clarifai.com
3. Assurez-vous que votre compte est actif

**Pour USDA :**
1. Vérifiez votre email (clé envoyée instantanément)
2. Redemandez une clé sur fdc.nal.usda.gov

## 📊 Export de Données

### Format CSV

Le fichier CSV exporté contient :
```csv
Date,Heure,Type,Nom,Calories,Protéines (g),Glucides (g),Lipides (g)
09/11/2024,14:30,Scanner,"Nutella",539,6.3,57.5,30.9
09/11/2024,18:45,Photo,"rice, chicken, broccoli",450,35,48,8
```

### Utilisation

**Avec Excel :**
1. Ouvrez Excel
2. Fichier → Ouvrir → Sélectionnez le CSV
3. Les données sont automatiquement formatées

**Avec Google Sheets :**
1. Ouvrez Google Sheets
2. Fichier → Importer → Upload
3. Sélectionnez votre CSV

**Analyses possibles :**
- Graphiques personnalisés
- Calculs de moyennes
- Comparaisons sur plusieurs mois

## 🎯 Conseils d'Utilisation

### Pour un meilleur scan
- ✅ Bon éclairage
- ✅ Code-barre à plat face à la caméra
- ✅ Évitez les reflets
- ✅ Distance : 10-20 cm

### Pour de meilleures photos
- ✅ Photo de haut (bird's eye view)
- ✅ Éclairage naturel
- ✅ Assiette complète dans le cadre
- ✅ Fond neutre si possible

### Pour un meilleur suivi
- 📅 Scannez au moment de consommer
- 📊 Consultez l'historique chaque soir
- 🎯 Ajustez votre objectif selon vos besoins
- 📈 Suivez vos tendances sur 7 jours

## 🤝 Contribuer aux Bases de Données

### Open Food Facts

**Si un produit n'est pas trouvé :**
1. Visitez [https://world.openfoodfacts.org](https://world.openfoodfacts.org)
2. Créez un compte gratuit
3. Ajoutez le produit avec :
   - Photo du produit
   - Photo du code-barre
   - Photo des informations nutritionnelles
4. Votre contribution aide toute la communauté !

**Projet open-source collaboratif** - Plus de 2 millions de produits

## 🆘 Support et Contact

### Bugs ou Suggestions

Si vous rencontrez un problème :
1. Vérifiez cette documentation
2. Consultez la section Dépannage
3. Vérifiez votre configuration API

### Ressources Utiles

- [Documentation Clarifai](https://docs.clarifai.com/)
- [Documentation USDA FoodData](https://fdc.nal.usda.gov/api-guide.html)
- [Open Food Facts](https://world.openfoodfacts.org/)
- [Chart.js Documentation](https://www.chartjs.org/)

## 📜 Licences et Crédits

### APIs Utilisées

- **Open Food Facts** - Licence ODbL
- **Clarifai** - API commerciale (tier gratuit)
- **USDA FoodData Central** - Domaine public (US Gov)

### Bibliothèques

- **Tailwind CSS** - MIT License
- **html5-qrcode** - Apache 2.0
- **Chart.js** - MIT License

### Données

Les données nutritionnelles proviennent de :
- Base collaborative Open Food Facts
- Base gouvernementale USDA FoodData Central

## 🎉 Fonctionnalités Bonus

✨ **Mode sombre** - Confort visuel
📥 **Export CSV** - Analyses avancées
📊 **Graphique 7 jours** - Visualisation des tendances
🎯 **Objectif personnalisable** - Adapté à vos besoins
🔔 **Notifications** - Feedback immédiat
💾 **Sauvegarde automatique** - Aucune perte de données
📱 **Responsive** - Fonctionne sur tous les appareils
🌍 **Multilingue** - Interface en français, données internationales

---

## 🚀 Prêt à Démarrer !

1. ✅ Ouvrez `index.html` dans votre navigateur
2. ✅ Configurez vos clés API gratuites (5 min)
3. ✅ Commencez à tracker votre nutrition !

**Bon appétit et bon suivi nutritionnel ! 🍎🥗**

---

*Application 100% gratuite - Respectueuse de votre vie privée - Open Source Ready*
