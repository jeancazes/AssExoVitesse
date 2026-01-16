# 🚀 Vitesse App - Déploiement Vercel

## Structure du projet
```
vitesse-vercel/
├── api/
│   └── chat.js      ← API pour Claude
├── index.html       ← Application
└── package.json     ← Dépendances
```

## Déploiement

### 1. Mettre sur GitHub

1. Crée un nouveau repo sur github.com
2. Upload ces fichiers :
   - `index.html` (à la racine)
   - `package.json` (à la racine)
   - Le dossier `api/` avec `chat.js` dedans

### 2. Déployer sur Vercel

1. Va sur vercel.com → "Add New Project"
2. Importe ton repo GitHub
3. **AVANT de cliquer Deploy** :
   - Ouvre "Environment Variables"
   - Ajoute : `ANTHROPIC_API_KEY` = ta clé sk-ant-...
4. Clique Deploy

### 3. C'est prêt !

URL : `https://ton-projet.vercel.app`

## Dépannage

**Erreur 404 ?**
→ Vérifie que index.html est bien à la RACINE du repo (pas dans un sous-dossier)

**Pas de réponse de l'IA ?**
→ Vérifie que ANTHROPIC_API_KEY est bien ajoutée dans Vercel Settings → Environment Variables

**Pour voir les erreurs :**
→ Vercel Dashboard → ton projet → Deployments → Logs
