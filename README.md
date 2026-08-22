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

## Section 2 : Déploiement sur InfinityFree (hébergement gratuit)

Ce guide explique comment déployer Gyptec System gratuitement sur **InfinityFree**, un hébergeur web PHP classique. InfinityFree ne permet pas l'accès en ligne de commande (SSH), le déploiement se fait donc par transfert de fichiers FTP ou via leur gestionnaire de fichiers en ligne.

### 1. Préparer le paquet de déploiement (en local)
Contrairement aux hébergeurs automatiques, sur InfinityFree vous devez envoyer un projet "prêt à l'emploi". Le dossier `vendor/` et les fichiers CSS/JS compilés doivent être inclus.

Le dossier `deploy-package/` a été généré sur votre ordinateur contenant le projet préparé :
- Les dépendances PHP sont installées (dossier `vendor/` généré via `composer install --no-dev --optimize-autoloader`).
- Les assets front-end sont compilés (dossier `public/build/` généré via `npm run build`).

### 2. Comprendre la structure sur InfinityFree
Sur InfinityFree, le point d'entrée public de votre site est un dossier nommé `htdocs/`.
Pour des raisons de sécurité, le cœur de l'application Laravel **ne doit pas** être dans le dossier public. Voici la structure à adopter :

```text
/ (racine de votre hébergement)
├── gyptec-app/        <-- (À CRÉER) Placez ici TOUT le contenu de deploy-package/ SAUF le dossier public/
└── htdocs/            <-- Placez ici le CONTENU du dossier public/ de deploy-package/
```

### 3. Étapes de mise en ligne (via FileZilla ou le gestionnaire de fichiers)
1. Créez un compte sur InfinityFree, puis créez un nouveau compte d'hébergement.
2. Connectez-vous au FTP (les identifiants sont dans le panel InfinityFree).
3. À la racine de votre hébergement (au même niveau que `htdocs/`), créez un dossier nommé `gyptec-app`.
4. Transférez tout le contenu de votre `deploy-package/` **sauf le dossier `public`** vers le dossier `gyptec-app/`.
5. Ouvrez le dossier `public/` de votre `deploy-package/` local, et transférez **tout son contenu** (les dossiers `build`, le fichier `index.php`, `.htaccess`, etc.) directement à l'intérieur du dossier `htdocs/` sur le serveur.

### 4. Adapter les chemins (Le fichier `index.php`)
Puisque nous avons séparé le cœur de l'application (`gyptec-app/`) du dossier public (`htdocs/`), nous devons indiquer à `index.php` où trouver les fichiers.
Sur le serveur, modifiez le fichier `htdocs/index.php` :

**Remplacez ces lignes :**
```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

**Par ces lignes :**
```php
require __DIR__.'/../gyptec-app/vendor/autoload.php';
$app = require_once __DIR__.'/../gyptec-app/bootstrap/app.php';
```

### 5. Configuration de l'environnement (`.env`)
Sur le serveur, dans le dossier `gyptec-app/`, créez un fichier `.env` (vous pouvez copier le contenu de votre `.env` local).
Modifiez impérativement ces lignes :
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=http://votre-domaine-infinityfree.epizy.com

# File d'attente (Les tâches tourneront en temps réel car il n'y a pas de worker sur InfinityFree)
QUEUE_CONNECTION=sync
```
*Note : Étant donné qu'InfinityFree n'offre pas d'accès SSH ni de tâches Cron (scheduler), toute fonctionnalité nécessitant de tourner en arrière-plan doit être configurée en mode synchrone (`sync`).*

### 6. Base de données et Migrations
1. Sur le panneau de contrôle (cPanel) d'InfinityFree, allez dans la section **MySQL Databases**.
2. Créez une nouvelle base de données et notez les informations fournies (Nom de la base, Utilisateur, Mot de passe, et le "MySQL Hostname").
3. Mettez à jour le `.env` de votre serveur (dans `gyptec-app/`) avec ces accès :
   ```env
   DB_CONNECTION=mysql
   DB_HOST=sqlXXX.epizy.com (Le MySQL Hostname exact)
   DB_PORT=3306
   DB_DATABASE=nom_de_la_base_creee
   DB_USERNAME=utilisateur_fourni
   DB_PASSWORD=mot_de_passe_fourni
   ```
4. **Exécuter les migrations sans terminal :** InfinityFree n'ayant pas d'accès SSH, vous ne pouvez pas faire `php artisan migrate`.
   Pour un déploiement facile, créez un petit script d'installation temporaire.
   Ouvrez le fichier `gyptec-app/routes/web.php` sur le serveur et ajoutez tout à la fin :
   ```php
   Route::get('/install-db', function () {
       \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
       \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
       return 'Base de données installée avec succès !';
   });
   ```
5. Visitez l'URL `http://votre-domaine.com/install-db` depuis votre navigateur. Attendez le message de succès.
6. **TRÈS IMPORTANT :** Supprimez immédiatement cette route du fichier `routes/web.php` pour des raisons de sécurité !

### 7. Vérification
Visitez la page d'accueil de votre site. Tout devrait fonctionner correctement avec le design et la connexion à la base de données opérationnels !
