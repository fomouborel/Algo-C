# 🚀 Guide de Mise en Ligne (Déploiement 100 % Gratuit)

La plateforme **Algo & C99 — Parcours Ingénieur 1A** fonctionne entièrement dans le navigateur de l'étudiant (cours, compilateur C99, interpréteur Pseudo-code et sauvegarde `IndexedDB`). Elle ne nécessite **aucun serveur payant ni base de données externe** (**coût : 0,00 €**).

Les fichiers de configuration pour l'hébergement sont déjà inclus dans le projet :
- `netlify.toml` (configuration Netlify)
- `vercel.json` (configuration Vercel)
- `.github/workflows/deploy.yml` (déploiement automatique GitHub Pages)
- `vite.config.ts` (configuré avec `base: './'` pour fonctionner sur n'importe quelle URL ou sous-dossier)

Voici les **3 méthodes gratuites** pour mettre la plateforme en ligne.

---

## Prérequis (si vous avez modifié le code)

Le dossier prêt à être hébergé s'appelle **`dist/`**. Il est déjà généré dans le projet.
Si vous modifiez le code plus tard, régénérez-le simplement avec :

```powershell
npm run build
```

---

## Option 1 : Glisser-Déposer en 30 secondes (Sans Git ni ligne de commande)

Idéal pour obtenir un lien en ligne immédiatement sans utiliser GitHub.

### Avec Netlify Drop :
1. Créez un compte gratuit sur [app.netlify.com/drop](https://app.netlify.com/drop).
2. Ouvrez votre explorateur de fichiers Windows dans le dossier du projet (`guide etudiant`).
3. **Glissez-déposez le dossier `dist`** directement dans l'encadré de la page Netlify.
4. En **10 secondes**, votre site est en ligne avec un lien HTTPS partageable (ex. `https://mon-guide-algo-c.netlify.app`).
5. *(Optionnel)* Dans **Site configuration** > **Change site name**, personnalisez gratuitement le nom du sous-domaine.

### Alternative avec Cloudflare Pages :
1. Créez un compte gratuit sur [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Allez dans **Workers & Pages** > **Create** > onglet **Pages** > **Upload assets**.
3. Donnez un nom au projet, glissez le dossier **`dist`** et cliquez sur **Deploy site**.

---

## Option 2 : GitHub Pages (100 % gratuit et mis à jour automatiquement)

Idéal si vous souhaitez héberger le code sur GitHub et que le site se mette à jour tout seul à chaque modification grâce au fichier `.github/workflows/deploy.yml` déjà présent.

### Étape 1 : Envoyer le projet sur GitHub
1. Créez un nouveau dépôt (repository) public sur [github.com/new](https://github.com/new) (par exemple `algo-c-ingenieur`).
2. Ouvrez un terminal PowerShell dans le dossier du projet et exécutez :

```powershell
git init
git add .
git commit -m "Version initiale de la plateforme Algo & C99"
git branch -M main
git remote add origin https://github.com/VOTRE_PSEUDO/algo-c-ingenieur.git
git push -u origin main
```
*(Remplacez `VOTRE_PSEUDO` et `algo-c-ingenieur` par vos informations GitHub).*

### Étape 2 : Activer GitHub Pages
1. Sur la page GitHub de votre dépôt, cliquez sur l'onglet **Settings** (en haut).
2. Dans le menu de gauche, cliquez sur **Pages**.
3. Dans la section **Build and deployment** > **Source**, choisissez **GitHub Actions** dans le menu déroulant.
4. Patientez environ 1 minute (vous pouvez suivre l'avancement dans l'onglet **Actions** du dépôt).
5. Votre plateforme est disponible en ligne à l'adresse :
   `https://VOTRE_PSEUDO.github.io/algo-c-ingenieur/`

---

## Option 3 : Vercel ou Netlify (En 1 commande ou relié à GitHub)

Les fichiers `vercel.json` et `netlify.toml` configurent automatiquement la compilation (`npm run build`) et le dossier de sortie (`dist`).

### Méthode A — En 1 commande depuis votre terminal (sans GitHub)
Ouvrez un terminal dans le dossier du projet et lancez :

```powershell
npx vercel --prod
```
1. Connectez-vous gratuitement à Vercel lorsque le terminal vous le propose.
2. Appuyez sur `Entrée` aux questions par défaut.
3. En 20 secondes, le terminal affiche votre lien public de production (`https://....vercel.app`).

### Méthode B — Depuis le site web Vercel ou Netlify (avec GitHub)
1. Connectez-vous sur [vercel.com](https://vercel.com) ou [netlify.com](https://www.netlify.com) avec votre compte GitHub.
2. Cliquez sur **Add New Project** (Vercel) ou **Import an existing project** (Netlify).
3. Sélectionnez votre dépôt GitHub et cliquez sur **Deploy**.
4. Tous les réglages (`npm run build` et dossier `dist`) sont détectés automatiquement.

---

## 💡 Rappel important pour l'étudiant une fois en ligne

- **Sauvegarde automatique par appareil** : La progression de l'étudiant est enregistrée automatiquement dans le navigateur de son ordinateur/tablette (`IndexedDB`).
- **Passage d'un ordinateur à un autre** : Si l'étudiant change d'ordinateur (ex. PC personnel $\rightarrow$ PC de l'école), il lui suffit d'aller dans **Sauvegarde & Paramètres** sur le site pour **Exporter sa sauvegarde (`.json`)** et l'**Importer** sur le second poste.
