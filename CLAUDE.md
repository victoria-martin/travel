# Conventions d'archi — app travel

Les critères de découpage : où vit quoi. Ce fichier grossit à chaque « redécoupe ».

## Contraintes dures

- Scripts classiques, pas de modules ES : tout est global, appelé en `onclick="…"`.
- Nouveau fichier = balise `<script src>` dans [index.html](index.html), avant `js/init.js`, après
  ce qu'il utilise s'il exécute du code au chargement (`registerList(…)`, `COLUMN_SETS.villes = …`).

## Où vit quoi

| Emplacement | Ce qui y vit |
| --- | --- |
| `js/*.js` | état, stockage, synchro, primitives transverses |
| `js/views/*.js` à plat | briques utilisées par **plusieurs** vues |
| `js/views/list/` | la liste générique (tableau, cartes, notes, modale) |
| `js/views/<domaine>/` | tout ce qui n'appartient qu'à ce domaine |

## Un dossier = un domaine, jamais un degré de complexité

`cars/`, `fixed-costs/`, `cities/`. Ne pas regrouper deux domaines parce qu'ils paraissent
« simples » — c'était le défaut de `simple-lists/`. Un dossier ne porte un mécanisme (`list/`,
`locate/`) que s'il sert plusieurs domaines.

## Un fichier = une responsabilité

- `<vue>.js` — le `render…View`, rien d'autre.
- `header.js` — en-tête (titre, filtres, boutons).
- `columns.js` — `COLUMN_SETS`, `SORT_DEFAULTS` **et** les libellés de ses cellules.
- `list.js` — la déclaration `registerList`.
- `get-<entité>.js` — le getter.
- `modal/form.js` / `modal/save.js` — rendu et écriture, jamais ensemble.

## Les globales vivent à côté de leur consommateur

Pas de `data.js` ni de `helpers.js` fourre-tout (démantelés en `87bc0c4`).

## Journal

- **2026-09-11** — `simple-lists/` éclaté en `cars/`, `fixed-costs/` et le générique `list/`.
- **2026-09-11** — `cities/table.js` + `row.js` fondus dans le tableau générique, colonnes sorties
  dans [cities/columns.js](js/views/cities/columns.js).
