# 🚀 Vitesse App - Application éducative

Application pour apprendre les calculs de vitesse, distance et durée avec la méthode "Si... Alors... Donc..."

## ✨ Fonctionnalités

- **Connexion personnalisée** : Chaque élève entre son prénom
- **4 niveaux** : Débutant, Apprenti, Maître, Expert
- **48 exercices variés** : 12 par niveau avec des thèmes différents
- **Assistant IA** : Guide l'élève en utilisant son prénom
- **Système d'étoiles** : Récompense chaque étape
- **Calculatrice flottante** : Accessible à tout moment
- **Sauvegarde automatique** : Progrès sauvegardés localement
- **Tableau de bord** : Suivi des scores pour l'enseignant

## 📁 Structure du projet

```
vitesse-vercel/
├── index.html       ← Application principale
├── scores.html      ← Tableau de bord enseignant
├── api/
│   ├── chat.js      ← API pour Claude
│   └── scores.js    ← API pour les scores
├── package.json
├── vercel.json
└── README.md
```

## 🔧 Déploiement sur Vercel

### 1. Mettre sur GitHub

1. Crée un nouveau repo sur github.com
2. Upload tous les fichiers (garde la structure avec le dossier `api/`)

### 2. Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com) → "Add New Project"
2. Importe ton repo GitHub
3. **AVANT de cliquer Deploy** :
   - Ouvre "Environment Variables"
   - Ajoute : `ANTHROPIC_API_KEY` = ta clé `sk-ant-...`
4. Clique Deploy

### 3. C'est prêt !

## 🔗 URLs de ton application

| Page | URL |
|------|-----|
| Application | `https://ton-projet.vercel.app/` |
| Tableau de bord | `https://ton-projet.vercel.app/scores.html` |
| Scores (JSON) | `https://ton-projet.vercel.app/api/scores` |
| Scores (CSV) | `https://ton-projet.vercel.app/api/scores?format=csv` |

## 📊 Tableau de bord enseignant

Pour voir les scores de tous les élèves :
1. Va sur `https://ton-projet.vercel.app/scores.html`
2. Tu verras le classement avec étoiles, problèmes résolus, etc.
3. Tu peux télécharger un fichier CSV pour Excel

## 💡 Utilisation en classe

1. Partage le lien de l'application aux élèves
2. Chaque élève entre son prénom à la première connexion
3. Les scores sont automatiquement sauvegardés
4. Consulte le tableau de bord pour suivre les progrès

## ⚠️ Note sur les scores

- **Sur l'appareil de l'élève** : sauvegarde permanente (localStorage)
- **Sur le serveur** : peut être réinitialisé lors des mises à jour

## 🔧 Dépannage

**Page blanche ?**
→ Vérifie que `index.html` est à la RACINE du repo

**Pas de réponse de l'IA ?**
→ Vérifie `ANTHROPIC_API_KEY` dans Vercel → Settings → Environment Variables

**Pour voir les erreurs :**
→ Vercel Dashboard → ton projet → Deployments → Logs
