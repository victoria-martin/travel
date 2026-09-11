# Conventions d'archi — app travel

Les critères de découpage : où vit quoi. Ce fichier grossit à chaque « redécoupe ».

## Contraintes dures

- Scripts classiques, pas de modules ES : tout est global, appelé en `onclick="…"`.
- Nouveau fichier = balise `<script src>` dans [index.html](index.html), avant `js/init.js`, après
  ce qu'il utilise s'il exécute du code au chargement (`registerList(…)`, `COLUMN_SETS.villes = …`).

## Où vit quoi

| Emplacement            | Ce qui y vit                                    |
| ---------------------- | ----------------------------------------------- |
| `js/*.js`              | état, stockage, synchro, primitives transverses |
| `js/views/*.js` à plat | briques utilisées par **plusieurs** vues        |
| `js/views/<domaine>/`  | tout ce qui n'appartient qu'à ce domaine        |

## Un dossier = un domaine, jamais un degré de complexité

`cars/`, `fixed-costs/`, `cities/`. Ne pas regrouper deux domaines parce qu'ils paraissent
« simples » — c'était le défaut de `simple-lists/`. Un dossier ne porte un mécanisme
(`locate/`, `modals/`) que s'il sert plusieurs domaines.

## Un fichier = une responsabilité

- `<vue>.js` — le `render…View`, rien d'autre.
- `header.js` — en-tête (titre, filtres, boutons).
- `columns.js` — `COLUMN_SETS`, `SORT_DEFAULTS` **et** les libellés de ses cellules.
- `cards.js` — la grille et la carte de la vue.
- `get-<entité>.js` — le getter.
- `modal/form.js` / `modal/save.js` — rendu et écriture, jamais ensemble.

## Les globales vivent à côté de leur consommateur

Pas de `data.js` ni de `helpers.js` fourre-tout (démantelés en `87bc0c4`).

## Fin de tâche → PLAN.md → spec

Une tâche n'est finie que quand les deux docs ont suivi, dans le même tour, sans attendre qu'on me
le demande :

- **L'item fait sort de [PLAN.md](PLAN.md)** : le backlog ne garde que ce qui reste à faire, git
  archive le reste.
- **Il devient une feature décrite dans
  [docs/spec-voyage-toscane.md](docs/spec-voyage-toscane.md)** — dans le bloc d'écran concerné
  (« Les écrans »), et dans « Décisions actées » si l'implémentation a tranché un arbitrage de fond.
- **Dans l'autre sens** : dès que PLAN.md bouge — elle comme moi — vérifier ce que ça change dans la
  spec ; un item ajouté contredit peut-être une décision actée ou une section d'écran.

Le [pre-push](.githooks/pre-push) refuse un push qui touche l'app sans toucher `PLAN.md` ni `docs/`.

## Journal

- **2026-09-12** — `js/views/travels/` créé pour le domaine Voyage : `get-travel.js`,
  `selector.js` (le bouton et le menu de la barre latérale) et `modal/`. Le voyage ouvert et le
  filtrage des collections vivent dans [current-travel.js](js/current-travel.js), à côté de
  [prefs.js](js/prefs.js) qui le stocke.
- **2026-09-11** — `js/views/cells/` créé pour les briques de cellule partagées : `text-cell.js`,
  `link-cell.js` et `actions/` (`edit-button.js`, `duplicate-button.js`, `delete-button.js`).
  `linkButton`, qui ne sert qu'aux cartes, est sorti dans [link-button.js](js/views/link-button.js).
- **2026-09-11** — les cinq `duplicate*` regroupés dans [duplicate.js](js/views/duplicate.js),
  sortis de `scenarios.js` et de `fixed-costs/`.
- **2026-09-11** — `simple-lists/` éclaté en `cars/`, `fixed-costs/` et le générique `list/`.
- **2026-09-11** — `cities/table.js` + `row.js` fondus dans le tableau générique, colonnes sorties
  dans [cities/columns.js](js/views/cities/columns.js).
- **2026-09-11** — `js/views/list/` démantelé : Voitures et Charges fixes écrivent leurs fichiers
  en clair comme Villes et Hébergements, le tableau partagé remonte dans
  [table.js](js/views/table.js).
- **2026-09-12** — un seul accès à `localStorage`, dans [local-store.js](js/local-store.js) :
  `readStore` / `writeStore` / `removeStore` (+ variantes `…String` pour l'URL de synchro, stockée
  en texte brut). Lecture muette, écriture bruyante. Les quatre clés passent par là ;
  `readLocalStorage` disparaît, `persist` devient `persistState`, `saveSyncBase` devient
  `persistSyncBase`, et `persistSyncUrl` remplace les deux écritures inline de `sync.js`.
