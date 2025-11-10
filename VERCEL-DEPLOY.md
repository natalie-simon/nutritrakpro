# Déploiement sur Vercel

Ce guide explique comment déployer ScanAssiette sur Vercel avec les fonctions serverless pour résoudre les problèmes CORS.

## Prérequis

- Un compte GitHub (déjà fait)
- Un compte Vercel (gratuit) : https://vercel.com

## Étapes de déploiement

### 1. Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up"
3. Choisissez "Continue with GitHub"
4. Autorisez Vercel à accéder à vos repos

### 2. Importer le projet

1. Dans le dashboard Vercel, cliquez sur "Add New..." → "Project"
2. Sélectionnez votre repo `nutritrakpro` (ou le nom actuel)
3. Vercel détectera automatiquement la configuration grâce au fichier `vercel.json`
4. Cliquez sur "Deploy"

### 3. Configurer les variables d'environnement

**Important :** Après le premier déploiement, configurez la clé API :

1. Dans votre projet Vercel, allez dans **Settings** → **Environment Variables**
2. Ajoutez la variable suivante :
   - **Name:** `CLARIFAI_API_KEY`
   - **Value:** `5d6ee14430e642408cc08bd89c64dd28`
   - **Environments:** Cochez `Production`, `Preview`, et `Development`
3. Cliquez sur **Save**
4. **Redéployez** le projet pour que les changements prennent effet :
   - Allez dans **Deployments**
   - Cliquez sur les 3 points du dernier déploiement
   - Cliquez sur "Redeploy"

### 4. Vérifier le déploiement

Une fois déployé, vous aurez une URL comme : `https://votre-projet.vercel.app`

Testez l'analyse photo pour vérifier que le problème CORS est résolu.

## Architecture

### Fonctions Serverless

Le dossier `/api` contient les fonctions serverless :

- **`/api/clarifai.js`** : Proxy pour l'API Clarifai
  - Reçoit l'image en base64 depuis le frontend
  - Appelle l'API Clarifai côté serveur (pas de CORS)
  - Retourne les résultats au frontend

### Configuration

- **`vercel.json`** : Configuration du projet Vercel
  - Définit le dossier de build (`frontend/dist`)
  - Configure les rewrites pour les fonctions serverless
  - Configure le framework Vite

## Développement local

Pour tester les fonctions serverless en local, vous aurez besoin de Vercel CLI :

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Démarrer en local
vercel dev
```

Cela démarrera un serveur local qui simulera l'environnement Vercel.

## Problèmes courants

### "CLARIFAI_API_KEY not configured"

➡️ Vérifiez que vous avez bien ajouté la variable d'environnement dans Vercel et redéployé le projet.

### Erreur 404 sur /api/clarifai

➡️ Assurez-vous que le fichier `vercel.json` est bien à la racine du projet et que le dossier `/api` existe.

### L'app fonctionne en dev mais pas en prod

➡️ Vérifiez que le build a réussi dans les logs Vercel.

## Mise à jour du déploiement

Vercel redéploie automatiquement à chaque push sur la branche `develop`.

Pour forcer un redéploiement :
1. Allez dans **Deployments**
2. Cliquez sur les 3 points du dernier déploiement
3. Cliquez sur "Redeploy"

## Sécurité

✅ La clé API Clarifai est maintenant stockée côté serveur (variable d'environnement)
✅ Elle n'est plus visible dans le code frontend
✅ Les appels sont faits depuis le serveur Vercel, pas depuis le navigateur
