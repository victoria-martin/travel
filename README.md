# Voyage Toscane — app de préparation de voyage

## Déployer sur GitHub Pages (une fois)

1. Va sur [github.com/new](https://github.com/new) et crée un repo (ex: `voyage-toscane`). Peut être privé ou public.
2. Ajoute tout le contenu de ce dossier à la racine du repo, en gardant l'arborescence : `index.html`, `styles.css`, le dossier `js/` et le dossier `apps-script/`.
   - Via l'interface web GitHub : bouton "Add file" → "Upload files", puis glisse le **dossier entier** (les sous-dossiers sont conservés), commit.
3. Va dans **Settings** (du repo) → **Pages** (menu de gauche).
4. Sous "Build and deployment" → Source : **Deploy from a branch**. Branch : **main**, dossier : **/ (root)**. Sauvegarde.
5. Attends 1–2 minutes, puis ton site est en ligne à :
   `https://TON-PSEUDO-GITHUB.github.io/voyage-toscane/`

Envoie ce lien à qui tu veux.

## Structure des fichiers

Une app statique, sans build ni bundler : chaque fichier est chargé tel quel par `index.html`, dans
l'ordre — une balise `<script src>` par fichier, avant `js/init.js`. Les boutons appellent les
fonctions directement dans le HTML (`onclick="..."`), donc les fichiers JS sont des scripts
classiques et **pas** des modules ES.

Le détail des critères de découpage (où vit quoi) est dans [CLAUDE.md](CLAUDE.md).

```
index.html                       balises + ordre de chargement
styles.css                       tout le style
js/state.js                      état global partagé (`state`)
js/storage.js                    cache localStorage
js/sync.js                       synchro Google Sheets (voir plus bas)
js/prefs.js                      préférences d'affichage, propres au navigateur
js/geocode.js                    géocodage d'une adresse
js/routing.js                    tracé routier (OSRM)
js/homeexchange.js               lecture d'une annonce HomeExchange collée
js/columns.js  js/sort.js        colonnes masquables et tri des tableaux
js/uid.js  js/escape-html.js     primitives
js/accommodation-types.js        types d'hébergement
js/accommodation-statuses.js     statuts d'hébergement
js/render.js                     rendu de la coquille + barre latérale
js/modals/                       ouverture des modales, état du géocodage
js/views/*.js                    briques utilisées par plusieurs vues (tableau, cartes,
                                 favoris, tags, duplication, suppression, édition en ligne)
js/views/cells/                  cellules de tableau partagées (+ actions/)
js/views/locate/                 bloc de localisation partagé
js/views/accommodations.js       vue Hébergements — assemblage, filtres, favoris
js/views/accommodations/         son en-tête, ses colonnes, ses cartes, sa modale, l'import collé
js/views/cities/                 vue Villes
js/views/cars/                   vue Voitures
js/views/fixed-costs/            vue Charges fixes
js/views/scenarios/              vue Scénarios — liste (list/), détail (detail/), et les briques
                                 communes : nuits, dates d'étapes, lettres, montants, carte
js/views/map.js                  vue Carte (Leaflet)
js/views/notes.js                vue Notes
js/init.js                       démarrage — doit rester chargé en dernier
apps-script/Code.js              le backend Apps Script (voir plus bas)
```

## Le board du backlog

```
pnpm plan
```

Ouvre <http://localhost:4321> : les tâches de [PLAN.md](PLAN.md), rangées par section, filtrables
par statut et par recherche. `PLAN_PORT=4399 pnpm plan` pour un autre port.

Cliquer une tâche ouvre son panneau — rien n'est lancé au clic. On y édite le titre, le statut et le
détail (enregistrer réécrit la puce dans PLAN.md, à cent colonnes comme le reste du fichier), et on y
lance sa session Claude :

- **Aucune session** : le prompt d'amorce est affiché et modifiable avant de lancer. Le bouton ouvre
  une fenêtre iTerm sur `claude --session-id <uuid>` avec ce prompt en argument.
- **Session existante** : le bouton la rouvre avec `claude --resume <uuid>`.
- **Archiver** sort la puce de PLAN.md — git en garde l'histoire, comme pour un item terminé. Le
  board la garde sous le filtre « 📦 archivées », avec son statut et sa session, toujours réouvrable.

L'URL porte la tâche ouverte (`#t-<id>`), donc un lien mène droit à une tâche.

**⧉ Détacher** sort le board du navigateur dans une petite fenêtre flottante, au-dessus de tout et
déplaçable — la même mécanique que la vignette de Google Meet (API Document Picture-in-Picture). Le
board y passe en colonne unique. Fermer la fenêtre le remet dans l'onglet, dans l'état où il était.
Le bouton n'apparaît que sur un navigateur qui sait le faire : Chrome et Arc oui, Firefox et Safari
non.

Les statuts sont une liste figée dans [statuses.js](tools/plan-board/statuses.js), partagée par le
serveur et la page. La liaison tâche → session vit dans `.claude/plan-sessions.json`, non versionné :
les sessions sont propres à ta machine.

## Travailler à plusieurs en même temps (Google Sheets)

Le Google Sheet est la **seule** base de données : l'app n'embarque aucune donnée, elle est vide
tant qu'aucune URL de Sheet n'est renseignée. Chaque personne voit les modifications des autres en
quelques secondes, et le Sheet reste éditable à la main comme un tableur normal (un onglet par
table, une ligne par entrée).

### Mise en place (une fois)

1. Crée un Google Sheet vide (n'importe quel nom).
2. Dans ce Sheet : menu **Extensions** → **Apps Script**.
3. Supprime le contenu de `Code.gs` et colle à la place tout le fichier [apps-script/Code.js](apps-script/Code.js). Enregistre.
4. Bouton **Déployer** → **Nouveau déploiement** → type **Application web**, puis :
   - Description : ce que tu veux
   - Exécuter en tant que : **moi**
   - Qui a accès : **tout le monde**
5. Déploie, autorise l'accès quand Google le demande, puis copie l'**URL de l'application web** (elle finit par `/exec`).
6. Dans l'app, clique sur le bouton d'état en bas de la barre latérale (⚪ « Sheet non connecté »), colle l'URL, **Connecter**.
7. Chaque personne fait l'étape 6 avec la **même** URL, sur son navigateur.

Le Sheet vide est amorcé automatiquement à la première connexion. Si le cache local de ton
navigateur et le Sheet diffèrent, l'app te demande laquelle des deux versions sert de point de
départ.

### Mettre à jour le script déployé

`apps-script/Code.js` est la source de vérité : ne modifie plus le code dans l'éditeur web, le
prochain push l'écraserait.

Une fois, sur chaque machine :

```
pnpm install
pnpm exec clasp login
pnpm exec clasp pull
```

Il faut aussi activer l'API Apps Script sur
[script.google.com/home/usersettings](https://script.google.com/home/usersettings).

`clasp pull` récupère le manifeste `appsscript.json` du projet, indispensable pour pousser — mais il
récupère aussi le code distant : vérifie avec `git diff` qu'il n'a pas écrasé ta version locale.

Ensuite, après chaque modification :

```
pnpm run push-script
```

Le code part et le déploiement existant est mis à jour : l'URL `/exec` ne change pas, personne n'a à
reconnecter son app.

Ce push est automatique : le hook [pre-push](.githooks/pre-push) lance `pnpm push-script` dès qu'un
push emporte des changements dans `apps-script/`. Il faut avoir pointé git dessus une fois :

```
git config core.hooksPath .githooks
```

L'identifiant du déploiement vit dans `.clasp-deployment`, non versionné : c'est la partie secrète de
l'URL `/exec` et ce repo est public. Sur une nouvelle machine, le recréer avec l'identifiant que
donne `pnpm exec clasp list-deployments`.

### Ce que fait la synchro

- Les modifications sont envoyées au Sheet ~1 seconde après chaque édition, et l'app relit le Sheet toutes les 5 secondes.
- **Fusion entrée par entrée** : si vous éditez deux hébergements différents en même temps, les deux modifications sont gardées. Sur _la même_ entrée, la dernière personne qui enregistre gagne.
- Éditer directement dans le Sheet fonctionne : les changements arrivent dans l'app au prochain rafraîchissement. Ne touche pas aux colonnes `id` ni aux en-têtes.
- Hors ligne, tout continue en localStorage ; ce qui a été modifié pendant la coupure est renvoyé à la reconnexion.
- Le bouton d'état affiche 🟢 synchronisé / 🔄 en cours / 🔴 erreur (le détail au survol). Cliquer dessus ouvre les réglages, avec un bouton **Déconnecter**.

### Limites

- Les onglets du Sheet ont des colonnes fixes (voir `COLLECTIONS` en haut de [apps-script/Code.js](apps-script/Code.js)). Si tu ajoutes un champ dans l'app, ajoute-le aussi dans cette liste, sinon il ne sera pas conservé côté Sheet.
- Ce n'est pas du temps réel à la milliseconde (5 secondes de latence), et le Sheet est ouvert à qui a l'URL : ne mets rien de sensible dedans.
