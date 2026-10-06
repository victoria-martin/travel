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

## Un composant parent tient son sous-arbre — fichier et dossier côte à côte

Pour une vue composée, le fichier parent `<Parent>.tsx` et le dossier `<Parent>/` de ses enfants
sont deux frères au même niveau — jamais le fichier déplacé **dans** un dossier du même nom
(`<Parent>/<Parent>.tsx`, qui l'imbrique sous lui-même). Exemple :
[domains/cities/CitiesView.tsx](src/domains/cities/CitiesView.tsx) à côté de
[domains/cities/CitiesView/](src/domains/cities/CitiesView/) (`CitiesHeader.tsx`,
`CitiesHeaderActions.tsx`).

## Un menu déroulant vit dans `shared/select/` ou `shared/menu/`, selon ce qu'il fait

Tout composant React construit sur Radix `DropdownMenu` se range dans `shared/`, jamais recréé
localement à un écran, selon un critère :

- **choisir une valeur** (statut, type, offre, quantité…) → [src/shared/select/](src/shared/select/) ;
- **menu d'en-tête** qui ouvre un panneau ou des actions (Réglages, Trier, Filtrer, Ajouter) →
  [src/shared/menu/](src/shared/menu/), assemblé avec `ToolbarMenu` (déclencheur + contenu en
  `children`).

Un menu propre à un domaine (le filtre de la carte, le menu d'ajout des hébergements) reste dans
son domaine mais s'assemble avec `ToolbarMenu`. Objectif : repérer les doublons d'un coup d'œil au
lieu de les laisser se recréer sous des noms différents. A trouvé un doublon dès sa création :
`VocabularyDropdown.tsx`, recréé à l'identique de `TagDropdown.tsx` par une session parallèle qui
ignorait le renommage — supprimé.

## Un champ de formulaire de modale vit dans `shared/`, créé avant le deuxième consommateur

Le balisage `.field`/`.field-row` d'un champ de modale (label + input/textarea/select, titre
Ajouter/Modifier, bouton d'enregistrement) ne se réécrit jamais en clair dans le formulaire d'une
entité : il passe par un composant générique de [src/shared/](src/shared/) —
[TextField.tsx](src/shared/TextField.tsx), [TextareaField.tsx](src/shared/TextareaField.tsx),
[SelectField.tsx](src/shared/SelectField.tsx), [FieldRow.tsx](src/shared/FieldRow.tsx),
[ModalSaveButton.tsx](src/shared/ModalSaveButton.tsx), [ModalTitle.tsx](src/shared/ModalTitle.tsx)
— à compléter dès qu'un nouveau type de champ apparaît. **Exception explicite à « un fichier
n'existe que s'il est utilisé par d'autres fichiers »** : la migration va porter ~20 types de
modale (`MODAL_TYPES`, [js/modals/modal.js](js/modals/modal.js)), donc un deuxième consommateur est
certain à l'avance — attendre qu'il apparaisse pour généraliser coûte juste un aller-retour pour
rien, le même principe que pour le renommage `*Form` → `*Modal`. Repéré sur `FixedCostModal.tsx`,
écrit avec son propre `.field`/`<select>`/bouton de sauvegarde en dur alors qu'`ActualExpenseModal`
avait déjà le même balisage juste avant.

## Un fichier = une responsabilité

- `<vue>.js` — le `render…View`, rien d'autre.
- `header.js` — en-tête (titre, filtres, boutons).
- `columns.js` — `COLUMN_SETS`, `SORT_DEFAULTS` **et** les libellés de ses cellules.
- `cards.js` — la grille et la carte de la vue.
- `get-<entité>.js` — le getter.
- `modal/form.js` / `modal/save.js` — rendu et écriture, jamais ensemble.
- Une fonctionnalité avec ses propres données ou son état garde sa logique et son rendu dans sa
  brique dédiée ; le header ou la vue ne fait que l'assembler.

## Les globales vivent à côté de leur consommateur

Pas de `data.js` ni de `helpers.js` fourre-tout (démantelés en `87bc0c4`).

## Ne jamais reproduire avec Playwright sur ce projet

Ne jamais lancer ni piloter un navigateur (Playwright ou autre) pour reproduire un bug ou vérifier
un rendu sur l'app travel — même pour diagnostiquer. Diagnostiquer en lisant le code (CSS/JS,
`getComputedStyle` mentalement, ancêtres `overflow`…), pas en pilotant un navigateur. Si une
vérification visuelle est vraiment nécessaire, le dire et laisser l'utilisatrice regarder à l'écran.

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

## Un plan d'exécution vit dans `docs/en-cours/`, puis dans `docs/archivé/`

Un fichier « plan d'exécution pour un agent » (`docs/*-plan.md`) se range selon son avancement :
[docs/en-cours/](docs/en-cours/) tant qu'il reste du backlog, [docs/archivé/](docs/archivé/) une
fois son backlog épuisé — jamais supprimé, voir § précédent. Quand un agent termine le dernier item
d'un plan (son « Backlog épuisé »/« Fait » dans PLAN.md), il déplace le fichier de `en-cours/` vers
`archivé/` dans le même tour que la mise à jour PLAN.md/spec, et met à jour tous les liens croisés
qui le référencent (PLAN.md, les autres plans, les commentaires de code `docs/en-cours/xxx-plan.md
§ N`) — un chemin réécrit se résout, pas seulement se devine.



## Le board se recharge tout seul — je ne le relance pas

`pnpm plan` tourne en `node --watch`, et l'écran se rafraîchit par SSE. Après une modif de
`tools/plan-board/` :

- le process tourne → je dis que c'est rechargé, rien d'autre à faire ;
- il ne tourne pas → je demande si elle veut voir les changements, et j'ouvre.

## Journal

L'historique des décisions vit dans [docs/journal-archi.md](docs/journal-archi.md), hors du chargement de session.
