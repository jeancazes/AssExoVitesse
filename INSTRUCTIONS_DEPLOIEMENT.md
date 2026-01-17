# 🚀 Guide de Déploiement Rapide

## Déploiement en 5 minutes sur Vercel

### Étape 1 : Obtenir une clé API Anthropic

1. Allez sur https://console.anthropic.com/
2. Créez un compte ou connectez-vous
3. Allez dans "API Keys"
4. Cliquez sur "Create Key"
5. Copiez votre clé (elle commence par `sk-ant-...`)

### Étape 2 : Créer un compte Vercel

1. Allez sur https://vercel.com
2. Cliquez sur "Sign Up"
3. Connectez-vous avec GitHub (recommandé)

### Étape 3 : Préparer le code

1. **Si vous utilisez GitHub (recommandé)** :
   - Créez un nouveau repository sur GitHub
   - Extrayez le ZIP sur votre ordinateur
   - Ouvrez un terminal dans le dossier
   - Exécutez :
     ```bash
     git init
     git add .
     git commit -m "Premier déploiement"
     git branch -M main
     git remote add origin https://github.com/VOTRE-USERNAME/exercices-vitesse.git
     git push -u origin main
     ```

2. **Si vous voulez tester localement d'abord** :
   - Extrayez le ZIP
   - Ouvrez un terminal dans le dossier
   - Créez un fichier `.env.local` avec :
     ```
     ANTHROPIC_API_KEY=votre_clé_ici
     ```
   - Exécutez :
     ```bash
     npm install
     npm start
     ```
   - Testez sur http://localhost:3000

### Étape 4 : Déployer sur Vercel

1. Sur Vercel, cliquez sur "Add New Project"
2. Sélectionnez "Import Git Repository"
3. Choisissez votre repository GitHub
4. Dans "Environment Variables", ajoutez :
   - Name : `ANTHROPIC_API_KEY`
   - Value : votre clé API copiée à l'étape 1
5. Cliquez sur "Deploy"
6. Attendez 2-3 minutes ⏱️

### Étape 5 : C'est terminé ! 🎉

Vercel vous donnera une URL comme : `https://exercices-vitesse.vercel.app`

Votre application est maintenant en ligne et sécurisée !

## ❓ Questions fréquentes

**Q : L'application ne fonctionne pas après le déploiement**
- Vérifiez que vous avez bien ajouté `ANTHROPIC_API_KEY` dans les variables d'environnement Vercel
- Allez dans Settings > Environment Variables sur Vercel pour vérifier

**Q : Comment mettre à jour l'application ?**
- Faites vos modifications dans le code
- Committez et pushez sur GitHub :
  ```bash
  git add .
  git commit -m "Mes modifications"
  git push
  ```
- Vercel redéploiera automatiquement !

**Q : L'API coûte cher ?**
- Non ! Anthropic offre des crédits gratuits pour commencer
- Chaque conversation coûte environ 0,001€ (1 centime pour 10 conversations)

**Q : Puis-je personnaliser les exercices ?**
- Oui ! Éditez le fichier `src/App.js` et modifiez l'objet `problemsByLevel`

**Q : Comment obtenir mon propre nom de domaine ?**
- Dans Vercel, allez dans Settings > Domains
- Ajoutez votre domaine personnalisé (ex: exercices-maths.fr)

## 🆘 Besoin d'aide ?

1. Consultez le README.md pour plus de détails
2. Vérifiez les logs dans le dashboard Vercel
3. Documentation Vercel : https://vercel.com/docs
4. Documentation Anthropic : https://docs.anthropic.com/

---

**Bonne chance ! 🍀**
