# Développement Local avec Fonctions Serverless

Pour tester l'analyse photo en local (qui nécessite la fonction serverless Clarifai), suivez ces étapes :

## Prérequis

Vercel CLI est déjà installé globalement.

## Démarrage en mode développement

### Option 1 : Mode développement complet (recommandé)

Lancez Vercel dev qui démarre à la fois le serveur Vite et les fonctions serverless :

```bash
vercel dev
```

Puis suivez les instructions :
1. Choisissez "Link to existing project" ou "Set up a new project"
2. L'application sera disponible sur http://localhost:3000
3. Les fonctions serverless seront actives

### Option 2 : Deux terminaux séparés

**Terminal 1 - Frontend Vite :**
```bash
cd frontend
npm run dev
```
→ Frontend sur http://localhost:5173

**Terminal 2 - Vercel CLI (fonctions serverless) :**
```bash
vercel dev --listen 3000
```
→ Fonctions serverless sur http://localhost:3000

Le proxy Vite redirigera automatiquement `/api/clarifai` vers `http://localhost:3000`

## Variables d'environnement

Le fichier `.env` à la racine contient déjà la clé Clarifai nécessaire :
```
CLARIFAI_API_KEY=5d6ee14430e642408cc08bd89c64dd28
```

## Test de l'analyse photo

1. Allez sur http://localhost:5173/photo (ou :3000 si mode Vercel)
2. Uploadez une photo de nourriture
3. Cliquez sur "Analyser"
4. Les aliments détectés devraient s'afficher sans erreur CORS

## Debugging

Si vous avez une erreur CORS :
- Vérifiez que Vercel CLI tourne bien sur le port 3000
- Vérifiez que le proxy Vite est configuré dans `frontend/vite.config.js`
- Consultez les logs dans le terminal Vercel CLI

Si la fonction retourne "CLARIFAI_API_KEY not configured" :
- Vérifiez que le fichier `.env` existe à la racine
- Redémarrez Vercel CLI pour recharger les variables d'environnement
