# ComptaScan — PWA

Scanner de factures avec génération d'écritures comptables (Entreprise & Association).  
Application installable sur Android via GitHub Pages.

---

## 🚀 Déploiement sur GitHub Pages (étape par étape)

### Étape 1 — Créer un compte GitHub
Rendez-vous sur [github.com](https://github.com) et créez un compte gratuit si ce n'est pas déjà fait.

### Étape 2 — Créer un nouveau dépôt
1. Cliquez sur le bouton vert **"New"** (ou **"+"** en haut à droite)
2. Nommez le dépôt : `comptascan`
3. Laissez-le en **Public**
4. Ne cochez rien d'autre, cliquez **"Create repository"**

### Étape 3 — Mettre à jour le fichier package.json
Ouvrez `package.json` et remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub :
```json
"homepage": "https://VOTRE_USERNAME.github.io/comptascan",
```

### Étape 4 — Uploader les fichiers
Sur la page de votre dépôt vide, cliquez **"uploading an existing file"** et glissez-déposez **tous les fichiers** de ce dossier.

Ou si vous avez Git installé :
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/comptascan.git
git push -u origin main
```

### Étape 5 — Activer GitHub Pages
1. Dans votre dépôt, allez dans **Settings** → **Pages**
2. Sous "Source", sélectionnez **"GitHub Actions"**
3. Sauvegardez

### Étape 6 — Lancer le déploiement
Allez dans l'onglet **Actions** de votre dépôt.  
Le workflow "Deploy ComptaScan to GitHub Pages" va se lancer automatiquement.  
Attendez 2-3 minutes ⏳

### Étape 7 — Accéder à l'application
Votre app sera disponible à :  
**`https://VOTRE_USERNAME.github.io/comptascan`**

---

## 📱 Installer sur Android

1. Ouvrez Chrome sur votre téléphone
2. Naviguez vers `https://VOTRE_USERNAME.github.io/comptascan`
3. Appuyez sur les **3 points** en haut à droite
4. Sélectionnez **"Ajouter à l'écran d'accueil"**
5. Confirmez → l'icône ComptaScan apparaît sur votre écran !

Une fois installée, l'application s'ouvre en plein écran sans la barre Chrome, et le sélecteur de fichiers fonctionne correctement (galerie photo native Android).

---

## 🔧 Développement local

```bash
npm install
npm run dev
```

Ouvrez http://localhost:5173

---

## 📦 Structure du projet

```
comptascan-pwa/
├── src/
│   ├── main.jsx          # Point d'entrée React
│   └── ComptaScan.jsx    # Application principale
├── public/
│   ├── icon-192.png      # Icône PWA
│   ├── icon-512.png      # Icône PWA grande
│   └── favicon.ico
├── .github/
│   └── workflows/
│       └── deploy.yml    # Déploiement automatique
├── index.html
├── vite.config.js
└── package.json
```
