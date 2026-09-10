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

Une app statique, sans build ni bundler : chaque fichier est chargé tel quel par `index.html`, dans l'ordre.

```
index.html                                 balises + ordre de chargement
styles.css                                 tout le style
js/data.js                                 types d'hébergement, état global
js/storage.js                              cache localStorage
js/sync.js                                 synchro Google Sheets (voir plus bas)
js/helpers.js                              utilitaires
js/render.js                               rendu de la coquille + barre latérale
js/views/accommodations/accommodations.js  vue Hébergements — assemblage + favoris
js/views/accommodations/header.js          en-tête de la vue (filtres, bascule tableau/cartes)
js/views/accommodations/table/table.js     tableau — <table> et en-têtes
js/views/accommodations/table/row.js       une ligne du tableau
js/views/accommodations/cards/cards.js     grille de cartes
js/views/accommodations/cards/card.js      une carte
js/views/simple-lists.js                   vues Voitures et Charges fixes
js/views/scenarios/scenarios.js            vue Scénarios (liste, créer, dupliquer)
js/views/scenarios/header.js               en-tête de la vue
js/views/scenarios/list/list.js            liste des scénarios
js/views/scenarios/list/row.js             une ligne de scénario
js/views/scenarios/detail/detail.js        vue détail d’un scénario + actions d’étape
js/views/scenarios/detail/header.js        en-tête du détail (titre éditable)
js/views/scenarios/detail/step-list.js     liste des étapes
js/views/scenarios/detail/step-card.js     une carte d’étape
js/views/scenarios/detail/recap.js         récap hébergements du scénario
js/views/scenarios/detail/recap-row.js     une ligne du récap
js/views/map.js                            vue Carte (Leaflet)
js/modals.js                               modales et formulaires
js/init.js                                 démarrage — doit rester chargé en dernier
apps-script/Code.js                        le backend Apps Script (voir plus bas)
```

Les boutons de l'app appellent les fonctions directement dans le HTML (`onclick="..."`), donc les
fichiers JS sont des scripts classiques et **pas** des modules ES : ajouter un fichier = ajouter une
balise `<script src>` dans `index.html`, avant `js/init.js`.

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
