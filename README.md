# Exercices Vitesse - Application Interactive

Application éducative pour aider les élèves de 10-12 ans à apprendre les calculs de vitesse, distance et durée avec la méthode "Si... Alors... Donc...".

## 🚀 Fonctionnalités

- 4 niveaux de difficulté progressifs
- Assistant IA personnalisé (Claude)
- Synthèse vocale pour l'accessibilité
- Système de gamification avec étoiles
- Validation par étapes de la méthode pédagogique
- Interface colorée et engageante

## 📋 Prérequis

- Node.js 16+ installé
- Compte Vercel (gratuit)
- Clé API Anthropic ([obtenir une clé](https://console.anthropic.com/))

## 🛠️ Installation locale

1. **Extraire le ZIP et naviguer dans le dossier**
   ```bash
   cd exercices-vitesse
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Créer un fichier `.env.local`** à la racine du projet
   ```
   ANTHROPIC_API_KEY=votre_clé_api_ici
   ```

4. **Lancer en développement**
   ```bash
   npm start
   ```
   
   L'application sera accessible sur http://localhost:3000

## 🌐 Déploiement sur Vercel

### Méthode 1 : Via GitHub (Recommandée)

1. **Créer un repository GitHub**
   - Allez sur github.com et créez un nouveau repository
   - Ne pas initialiser avec README, .gitignore ou licence

2. **Pousser le code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/votre-username/exercices-vitesse.git
   git push -u origin main
   ```

3. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez sur "Add New Project"
   - Importez votre repository GitHub
   - Ajoutez la variable d'environnement :
     - **Name:** `ANTHROPIC_API_KEY`
     - **Value:** votre clé API Anthropic
   - Cliquez sur "Deploy"

### Méthode 2 : Via CLI Vercel

1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Se connecter**
   ```bash
   vercel login
   ```

3. **Déployer**
   ```bash
   vercel
   ```

4. **Ajouter la variable d'environnement**
   ```bash
   vercel env add ANTHROPIC_API_KEY
   ```
   - Entrez votre clé API quand demandé
   - Sélectionnez : Production, Preview, Development

5. **Redéployer avec les variables**
   ```bash
   vercel --prod
   ```

## 🔐 Sécurité

✅ **Configuration sécurisée** : Cette application utilise une API backend (`/api/chat.js`) pour protéger votre clé API Anthropic. La clé n'est **jamais exposée** côté client.

⚠️ **Important** : 
- Ne commitez JAMAIS le fichier `.env.local` dans Git (déjà exclu via `.gitignore`)
- Ajoutez toujours `ANTHROPIC_API_KEY` dans les variables d'environnement Vercel

## 📁 Structure du projet

```
exercices-vitesse/
├── api/
│   └── chat.js              # API backend sécurisée
├── public/
│   └── index.html           # Template HTML
├── src/
│   ├── App.js               # Composant principal
│   ├── index.js             # Point d'entrée React
│   └── index.css            # Styles globaux
├── .gitignore               # Fichiers à ignorer
├── package.json             # Dépendances
└── README.md                # Ce fichier
```

## 🎨 Personnalisation

Vous pouvez facilement personnaliser :

- **Problèmes** : Modifiez `problemsByLevel` dans `src/App.js`
- **Couleurs** : Ajustez l'objet `styles` en bas de `src/App.js`
- **Niveaux** : Ajoutez/modifiez les niveaux dans la constante `niveaux`

## 🐛 Dépannage

### L'API ne répond pas
- Vérifiez que `ANTHROPIC_API_KEY` est bien configurée dans Vercel
- Consultez les logs Vercel pour voir les erreurs

### La synthèse vocale ne fonctionne pas
- Assurez-vous d'utiliser un navigateur moderne (Chrome, Safari, Firefox)
- Vérifiez que la langue française est disponible sur votre système

### Erreur de build
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez : `npm install`

## 📝 Licence

Ce projet est destiné à un usage éducatif.

## 👥 Support

Pour toute question ou problème :
1. Vérifiez ce README
2. Consultez la [documentation Vercel](https://vercel.com/docs)
3. Consultez la [documentation Anthropic](https://docs.anthropic.com/)

---

**Bon déploiement ! 🎉**
