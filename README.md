# Voyage Toscane — app de préparation de voyage

## Déployer sur GitHub Pages (une fois)

1. Va sur [github.com/new](https://github.com/new) et crée un repo (ex: `voyage-toscane`). Peut être privé ou public.
2. Ajoute tout le contenu de ce dossier à la racine du repo, en gardant l'arborescence : `index.html`, `styles.css`, `data.json`, le dossier `js/` et le dossier `apps-script/`.
   - Via l'interface web GitHub : bouton "Add file" → "Upload files", puis glisse le **dossier entier** (les sous-dossiers sont conservés), commit.
3. Va dans **Settings** (du repo) → **Pages** (menu de gauche).
4. Sous "Build and deployment" → Source : **Deploy from a branch**. Branch : **main**, dossier : **/ (root)**. Sauvegarde.
5. Attends 1–2 minutes, puis ton site est en ligne à :
   `https://TON-PSEUDO-GITHUB.github.io/voyage-toscane/`

Envoie ce lien à qui tu veux.

## Structure des fichiers

Une app statique, sans build ni bundler : chaque fichier est chargé tel quel par `index.html`, dans l'ordre.

```
index.html                    balises + ordre de chargement
styles.css                    tout le style
data.json                     données de départ (source « officielle »)
js/data.js                    presets de villes, état global, données par défaut
js/storage.js                 data.json, localStorage, export / import
js/sync.js                    synchro Google Sheets (voir plus bas)
js/helpers.js                 utilitaires
js/render.js                  rendu de la coquille + barre latérale
js/views/accommodations.js    vue Hébergements
js/views/simple-lists.js      vues Voitures et Charges fixes
js/views/scenarios.js         vues Scénarios
js/views/map.js               vue Carte (Leaflet)
js/modals.js                  modales et formulaires
js/init.js                    démarrage — doit rester chargé en dernier
apps-script/Code.gs           le script à coller dans Google Apps Script
```

Les boutons de l'app appellent les fonctions directement dans le HTML (`onclick="..."`), donc les
fichiers JS sont des scripts classiques et **pas** des modules ES : ajouter un fichier = ajouter une
balise `<script src>` dans `index.html`, avant `js/init.js`.

## Comment ça marche

- **`data.json`** = ta base de données (hébergements, voitures, charges, scénarios). C'est le fichier "officiel", celui que tout le monde voit en ouvrant le site pour la première fois.
- Quand tu utilises l'app dans ton navigateur, tes modifications sont sauvegardées **automatiquement dans ce navigateur** (localStorage) — pratique pour ne rien perdre en travaillant, mais **ça ne modifie pas encore `data.json` sur GitHub**, et ça ne se voit pas depuis un autre appareil ou par quelqu'un d'autre.
- Pour rendre tes changements "officiels" et visibles par tout le monde : clique sur **"📥 Exporter data.json"** dans la barre latérale de l'app, ça télécharge le fichier à jour → remplace l'ancien `data.json` dans ton repo GitHub (upload + commit) → le site se met à jour en 1–2 minutes.
- **"↺ Revenir à data.json"** : efface tes modifs locales non exportées et recharge la version officielle du fichier.
- **"📤 Importer un data.json"** : charge un fichier `data.json` que tu as ailleurs (ex: récupéré depuis GitHub, ou modifié à la main).

## Éditer `data.json` directement

C'est un fichier texte JSON classique — éditable :

- Directement dans GitHub (clique sur le fichier → crayon "Edit")
- Dans VS Code, Notepad++, etc.
- En le convertissant en tableau (voir ci-dessous)

## Convertir en Excel / CSV si tu préfères éditer en tableur

Le plus simple : utilise le bouton **"📋 Importer depuis un tableau"** dans l'app (colle tes lignes copiées depuis Excel/Sheets), ça alimente directement `data.json` sans conversion manuelle.

## Travailler à plusieurs en même temps (Google Sheets)

L'app peut se synchroniser avec un Google Sheet qui devient la base partagée : chaque personne
voit les modifications des autres en quelques secondes, et le Sheet reste éditable à la main
comme un tableur normal (un onglet par table, une ligne par entrée).

### Mise en place (une fois)

1. Crée un Google Sheet vide (n'importe quel nom).
2. Dans ce Sheet : menu **Extensions** → **Apps Script**.
3. Supprime le contenu de `Code.gs` et colle à la place tout le fichier [apps-script/Code.gs](apps-script/Code.gs). Enregistre.
4. Bouton **Déployer** → **Nouveau déploiement** → type **Application web**, puis :
   - Description : ce que tu veux
   - Exécuter en tant que : **moi**
   - Qui a accès : **tout le monde**
5. Déploie, autorise l'accès quand Google le demande, puis copie l'**URL de l'application web** (elle finit par `/exec`).
6. Dans l'app, clique sur le bouton d'état en bas de la barre latérale (⚪ « Local seulement »), colle l'URL, **Connecter**.
7. Chaque personne fait l'étape 6 avec la **même** URL, sur son navigateur.

Le Sheet vide est amorcé automatiquement avec les données de la première personne qui se connecte.
Si tes données locales et le Sheet diffèrent à la première connexion, l'app te demande laquelle des
deux versions sert de point de départ.

### Ce que fait la synchro

- Les modifications sont envoyées au Sheet ~1 seconde après chaque édition, et l'app relit le Sheet toutes les 5 secondes.
- **Fusion entrée par entrée** : si vous éditez deux hébergements différents en même temps, les deux modifications sont gardées. Sur _la même_ entrée, la dernière personne qui enregistre gagne.
- Éditer directement dans le Sheet fonctionne : les changements arrivent dans l'app au prochain rafraîchissement. Ne touche pas aux colonnes `id` ni aux en-têtes.
- Hors ligne, tout continue en localStorage ; ce qui a été modifié pendant la coupure est renvoyé à la reconnexion.
- Le bouton d'état affiche 🟢 synchronisé / 🔄 en cours / 🔴 erreur (le détail au survol). Cliquer dessus ouvre les réglages, avec un bouton **Déconnecter**.

`data.json` reste utile comme point de départ et comme sauvegarde : « 📥 Exporter data.json » marche toujours.

### Limites

- Les onglets du Sheet ont des colonnes fixes (voir `COLLECTIONS` en haut de [apps-script/Code.gs](apps-script/Code.gs)). Si tu ajoutes un champ dans l'app, ajoute-le aussi dans cette liste, sinon il ne sera pas conservé côté Sheet.
- Une nouvelle version du script Apps Script demande un **nouveau déploiement** (ou « Gérer les déploiements » → modifier la version) pour être prise en compte.
- Ce n'est pas du temps réel à la milliseconde (5 secondes de latence), et le Sheet est ouvert à qui a l'URL : ne mets rien de sensible dedans.
