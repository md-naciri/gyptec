# Gyptec System - Gestion Plâtre

Application de gestion commerciale (ventes, bons de livraison, encaissements, clients, etc.) développée avec **Laravel 11**, **React**, et **Inertia.js**.

---

## Section 1 : Installation et exécution en local (avec Laragon)

Ce guide détaille pas à pas comment installer et lancer le projet sur une machine Windows en utilisant Laragon.

### 1. Prérequis
Avant de commencer, assurez-vous d'avoir installé les logiciels suivants :
- **Laragon** (version Full recommandée, incluant Apache/Nginx et MySQL)
- **PHP** : version **8.3** (strictement requise par Laravel 11)
- **Composer** : installé globalement ou via Laragon
- **Node.js** : version 18 ou supérieure (avec `npm`)

### 2. Cloner ou récupérer le projet
Placez-vous dans le dossier racine de vos projets Laragon (généralement `C:\laragon\www`) et récupérez le code source. Si vous utilisez Git :
```bash
cd C:\laragon\www
git clone <URL_DU_DEPOT> gyptec-system
cd gyptec-system/gestion-platre
```
*(Si vous avez reçu le projet sous forme d'archive ZIP, extrayez simplement le dossier `gestion-platre` dans `C:\laragon\www\gyptec-system` et ouvrez un terminal dans ce dossier).*

### 3. Installation des dépendances
Le projet utilise Composer pour le back-end (PHP) et NPM pour le front-end (React). Exécutez les deux commandes suivantes dans le terminal, à la racine du projet (`gestion-platre`) :

```bash
# Installation des packages PHP
composer install

# Installation des packages JavaScript
npm install
```

### 4. Configuration de l'environnement (`.env`)
Laravel utilise un fichier `.env` pour stocker la configuration locale.
1. Copiez le fichier d'exemple fourni pour créer le vôtre :
   ```bash
   cp .env.example .env
   ```
   *(Sur Windows via CMD, utilisez `copy .env.example .env`)*

2. Générez la clé unique de l'application (elle sera ajoutée automatiquement à votre `.env`) :
   ```bash
   php artisan key:generate
   ```

3. Ouvrez le fichier `.env` dans votre éditeur de code et configurez **EXACTEMENT** ces variables pour que Laragon puisse s'y connecter (lignes 11 à 16 environ) :
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=gyptec_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Laissez `DB_PASSWORD` vide car c'est le réglage par défaut de MySQL sous Laragon).*

### 5. Base de données et Seeders
1. Ouvrez **Laragon** et cliquez sur **Start All** (Tout Démarrer) pour lancer MySQL.
2. Cliquez sur le bouton **Database** dans Laragon (ceci ouvre HeidiSQL ou phpMyAdmin).
3. Connectez-vous avec l'utilisateur `root` (sans mot de passe).
4. Créez une nouvelle base de données et nommez-la **exactement** `gyptec_db`.
5. Retournez dans votre terminal (à la racine du projet) et exécutez les migrations pour créer les tables, ainsi que les "seeders" pour insérer les données de démonstration :
   ```bash
   php artisan migrate:fresh --seed
   ```
   *Note : Cette commande va créer toutes les tables et exécuter le `DatabaseSeeder`, qui à son tour lance : `RoleSeeder` (création des rôles), `UserSeeder` (création des comptes), `ProduitSeeder` et `ClientSeeder` (données de test).*

### 6. Lancer l'application
Pour que le projet fonctionne, vous devez lancer à la fois le moteur front-end et le serveur back-end.

Ouvrez un terminal et compilez les assets (React/Tailwind) :
```bash
# En phase de développement actif, utilisez plutôt : npm run dev
npm run build
```

Ouvrez un **deuxième terminal** (ou un nouvel onglet) et lancez le serveur local de Laravel :
```bash
php artisan serve
```
Le projet est maintenant accessible depuis votre navigateur à l'adresse : **[http://localhost:8000](http://localhost:8000)**

### 7. Comptes de test (Démo)
Les seeders ont généré trois comptes pour tester les différents rôles. Tous partagent le même mot de passe.

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Administrateur** | `admin@gyptec.local` | `password` |
| **Commercial** | `commercial@gyptec.local` | `password` |
| **Comptable** | `comptable@gyptec.local` | `password` |

### 8. Dépannage courant (FAQ)
- **Page blanche ou erreur Vite au chargement :**
  Si vous aviez lancé `npm run dev` puis fermé le terminal, Laravel cherche toujours le serveur Vite. Pour résoudre ça : soit vous relancez `npm run dev`, soit vous supprimez le fichier `public/hot` (s'il existe) et exécutez `npm run build`.
- **Erreur "Access denied for user 'root'@'localhost'" :**
  Vérifiez que votre Laragon/MySQL est bien démarré, et que `DB_PASSWORD` est bien **vide** dans votre fichier `.env`.
- **Erreur "No supported encrypter found" :**
  Vous avez oublié d'exécuter `php artisan key:generate`.
- **La base de données n'existe pas lors du migrate :**
  Assurez-vous d'avoir bien créé manuellement la base `gyptec_db` (vide) dans phpMyAdmin/HeidiSQL avant de lancer `php artisan migrate`.

---

## Section 2 : Déploiement sur Wasmer (hébergement gratuit)

Ce guide explique comment déployer Gyptec System gratuitement sur **[Wasmer](https://wasmer.io)**. Wasmer est une plateforme d'hébergement innovante qui supporte les applications web modernes.

### 1. Préparer le dépôt GitHub
Avant de déployer, votre code doit être prêt sur GitHub (ou GitLab/Bitbucket).
- Ne committez **jamais** les dossiers `vendor/` ou `node_modules/`, ni votre fichier `.env`. Ces règles sont normalement déjà définies dans le fichier `.gitignore` par défaut de Laravel.
- **Fichiers publics (Build)** : Par défaut, Wasmer ne lance pas nécessairement de build front-end (Node.js) si l'environnement PHP est sélectionné. Le plus simple est de générer les fichiers locaux et de les envoyer sur GitHub.
  1. Éditez votre fichier `.gitignore` et commentez ou supprimez la ligne `/public/build` (pour autoriser le versioning de ce dossier).
  2. Compilez vos assets localement : `npm run build`.
  3. Ajoutez les fichiers modifiés et committez-les : 
     ```bash
     git add .
     git commit -m "Build assets for production"
     git push origin main
     ```

### 2. Créer l'application sur Wasmer
1. Rendez-vous sur [wasmer.io](https://wasmer.io) et créez un compte (gratuit).
2. Depuis le tableau de bord, cliquez sur **"Create App"** (Créer une application) ou **"New Deploy"**.
3. Liez votre compte GitHub et sélectionnez le dépôt contenant `gyptec-system`.
4. Wasmer devrait automatiquement détecter qu'il s'agit d'une application **PHP / Laravel**.
5. Pour la base de données, Wasmer propose souvent des bases de données intégrées (comme MySQL managé ou SQLite). S'ils proposent un Add-on MySQL, ajoutez-le au projet. Sinon, vous pouvez utiliser un service gratuit distant comme *PlanetScale* ou *Aiven* et récupérer les identifiants.

### 3. Configurer les Variables d'Environnement (.env)
Sur l'interface de Wasmer, allez dans les **Settings** (Paramètres) ou **Environment Variables**.
Saisissez les clés suivantes pour la production :

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:VOTRE_CLE_ICI (Copiez la valeur exacte depuis votre .env local)
APP_URL=https://votre-app.wasmer.app (Remplacez par l'URL fournie par Wasmer)

# Configuration de la base de données (si MySQL fourni par Wasmer) :
DB_CONNECTION=mysql
DB_HOST=host.wasmer.database (Donné par Wasmer)
DB_PORT=3306
DB_DATABASE=nom_de_la_base
DB_USERNAME=utilisateur
DB_PASSWORD=mot_de_passe_secret
```

### 4. Exécuter les Migrations en Production
Pour créer les tables dans la base de données de production :
- Si Wasmer propose une **Console / Terminal intégré**, ouvrez-la et tapez :
  ```bash
  php artisan migrate --force
  ```
- *(Optionnel)* Si vous voulez les données de démo en ligne, tapez aussi :
  ```bash
  php artisan db:seed --force
  ```
- Si Wasmer permet de définir un **"Post Deploy Script"** (Script après déploiement) ou une commande de démarrage, vous pouvez configurer `php artisan migrate --force` pour s'exécuter à chaque déploiement.

### 5. Vérifier le déploiement
1. Cliquez sur le lien généré par Wasmer (ex: `https://votre-nom-gyptec.wasmer.app`).
2. La page d'accueil avec le nouveau design doit s'afficher sans aucune erreur CSS (prouvant que le dossier `public/build` est bien lu).
3. Cliquez sur **Se connecter** et utilisez l'adresse `admin@gyptec.local` (et le mot de passe `password`) pour tester la liaison avec la base de données de production.
4. Si vous rencontrez une erreur 500, vérifiez les **Logs** sur le tableau de bord Wasmer pour diagnostiquer un éventuel problème de connexion MySQL ou une variable `.env` manquante.
