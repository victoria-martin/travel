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

- **2026-09-12** — un type ou un statut qui manque se tape dans le panneau, et
  [vocabulary.js](tools/plan-board/vocabulary.js) l'écrit dans
  [types.js](tools/plan-board/types.js) / [statuses.js](tools/plan-board/statuses.js) : les listes
  restent la source de vérité en code, versionnées, et le mot rejoint aussi le tableau vivant parce
  que `plan.js` en tient une référence déstructurée — un `require` rejoué ne changerait rien à
  `planType`. Le format de PLAN.md impose deux refus côté serveur : les deux vocabulaires doivent
  rester disjoints, `splitRest` reconnaissant un morceau de ligne en l'interrogeant dans l'une puis
  l'autre liste, et un libellé ne porte pas la syntaxe de la puce (`·`, `:`, parenthèses). Côté
  écran, [new-vocabulary.js](tools/plan-board/new-vocabulary.js) tient le formulaire et
  [emoji-picker.js](tools/plan-board/emoji-picker.js) prend une cible — `title` insère au caret,
  `vocabulaire` remplace la pastille. Le bloc Type / Statut venant de `draftFields`, le `＋`
  s'affiche dans les deux panneaux : le réserver à la création demanderait de passer un mode au
  bloc, soit la prop de configuration qu'on évite.

- **2026-09-12** — une tâche se glisse comme une section : [task-drag.js](tools/plan-board/task-drag.js)
  déplace son bloc entier dans PLAN.md — puce et lignes de continuation — et un dépôt sous un autre
  titre la change de section, puisque l'ordre du fichier EST l'ordre affiché. Le dépôt nomme la
  tâche devant laquelle il atterrit, ou la portée dont il vise la fin quand il n'y a plus rien
  après. Le marquage de la ligne de dépôt, commun aux deux, sort dans
  [drag.js](tools/plan-board/drag.js) ; côté CSS, `.dragging` / `.drop-before` / `.drop-after` ne
  sont plus rattachés à la barre latérale et se posent après les cartes, dont ils remplacent
  l'ombre le temps du geste.

- **2026-09-12** — un titre de tâche peut porter un emoji :
  [emojis.js](tools/plan-board/emojis.js) est le vocabulaire, liste figée sur le modèle de
  [statuses.js](tools/plan-board/statuses.js), avec les mots-clés français qui servent à le
  chercher ; [emoji-picker.js](tools/plan-board/emoji-picker.js) est le panneau, qui écrit dans le
  champ à la position du curseur. Le panneau vit sous le champ Titre de `draftFields`, donc les deux
  modes du tiroir — ajouter et éditer — l'ont sans rien en savoir. La position du curseur se lit à
  l'ouverture du panneau : au clic sur une vignette, le champ a déjà perdu le focus.

- **2026-09-12** — la barre latérale du board sort de `board.js` dans
  [sections-nav.js](tools/plan-board/sections-nav.js) : elle n'est plus une liste d'ancres mais un
  ordre qu'on manipule, la section s'attrape et se dépose. Le drop écrit PLAN.md — `moveSection`
  déplace le bloc `##` entier, tâches comprises — parce que l'ordre du fichier EST l'ordre affiché ;
  rien ne le mémorise à côté. Un titre de section porte un emoji, qui est de la décoration et jamais
  du nom : la reconnaissance de « Données à saisir », seule section exclue du board et tenue en
  dernière place, se fait donc sur le nom sans son premier mot.

- **2026-09-12** — `js/views/link-button.js` devient
  [external-link.js](js/views/external-link.js) : la responsabilité est d'ouvrir une URL dans un
  onglet, et elle a deux formes — `externalLink` pour une cellule ou un popup, `linkButton` pour une
  carte. Les trois `<a target="_blank" style="color:…">` écrits en clair
  ([link-cell.js](js/views/cells/link-cell.js), la colonne Booking, le popup de
  [map.js](js/views/map.js)) passent par la première, et le style inline devient `.external-link`.
- **2026-09-12** — `js/views/toolbar/` créé : `button.js`, `panel.js` (le bouton qui ouvre son
  propre panneau), `toggle-group.js`, `filter-panel.js` et `menu.js` (le ⋮). Chaque header écrit sa
  barre en clair à partir de ces briques — pas de `toolbar(kind, {…})` qui fabriquerait l'écran.
  `sortPanel` perd son argument `filters` : trier et filtrer sont deux boutons. La préférence des
  libellés vit dans [button-labels.js](js/views/button-labels.js), à plat, parce qu'elle a deux
  consommateurs — la barre latérale et le menu ⋮ ; `listModeToggle` rejoint `setListMode` dans
  [list-mode.js](js/views/list-mode.js). Côté CSS, `.filter-toggle` et `.col-picker` disparaissent
  au profit d'un seul `.toolbar-btn`, porté aussi bien par un `<button>` que par un `<summary>`.
  Le détail d'un scénario a la même barre, mêmes briques.
- **2026-09-12** — `tools/plan-board/` créé : le backlog de [PLAN.md](PLAN.md) devient un écran,
  chaque tâche ouvrant sa session Claude. Un outil de dev, pas un domaine du voyage — d'où `tools/`
  et pas `js/views/`. Le lien tâche → session tient à un marqueur `<!--t:id-->` dans PLAN.md, donc
  un renommage ne le casse pas ; la liaison elle-même vit hors du plan, dans
  `.claude/plan-sessions.json`. Le chat Claude de VS Code ne déclare pas d'`uriHandler` : rien ne
  l'ouvre depuis l'extérieur, le lancement passe par iTerm et `claude --session-id` / `--resume`.
- **2026-09-12** — PLAN.md devient un format lu **et écrit**. Deux axes indépendants sur une tâche,
  chacun une liste figée sur le modèle d'[accommodation-statuses.js](js/accommodation-statuses.js) :
  [types.js](tools/plan-board/types.js) dit sur quoi elle porte — plusieurs à la fois, une page
  neuve est presque toujours écran **et** modèle — et [statuses.js](tools/plan-board/statuses.js) où
  elle en est. Ils s'écrivent dans une même liste `·` parce que leurs vocabulaires sont disjoints.
  Le corps d'une tâche se lit en paragraphes logiques : le retour à la ligne à cent colonnes
  n'appartient qu'à l'écriture du fichier, et ne coupe jamais un code span ni un lien. Les sections
  `##` servent de portée à la création — ce sont les pages de l'app, `Transverse` étant le global —
  et une portée absente s'écrit à la volée : le `##` ou le `###` manquant est posé par la première
  tâche qui s'y range, avant « Données à saisir » qui ferme le fichier.
- **2026-09-12** — le board se détache dans une fenêtre ordinaire (`window.open`), pas en
  Picture-in-Picture : le toujours-au-dessus du PiP gêne plus qu'il n'aide. Le nœud `#app` y est
  déplacé, donc une seule instance — ce qui interdit deux choses que l'app travel s'autorise : les
  `onclick` inline, qui ne se résolvent pas dans l'autre document (d'où la délégation d'événements
  sur `#app`), et `confirm` / `alert`, qui s'ouvrent sur la fenêtre d'origine et pas sous les yeux
  (d'où l'archivage armé en deux clics et les erreurs affichées en place). Le panneau met la session
  en premier : c'est le geste principal, il ne passe pas sous la ligne de flottaison.
- **2026-09-12** — `js/views/cards/actions/` créé : la paire Modifier / Suppr. des cartes,
  recopiée à l'identique dans Hébergements, Voitures et Charges fixes, devient `cardEditButton` /
  `cardDeleteButton`. Deux familles distinctes et non paramétrables l'une par l'autre — une ligne de
  tableau agit en icônes ([cells/actions/](js/views/cells/actions/)), une carte en boutons texte.
- **2026-09-12** — `js/views/attractions/` créé pour le domaine Attraction, sur le découpage de
  `cities/` et `accommodations/`. Trois briques en sont sorties parce qu'elles ont désormais deux
  consommateurs : le champ tags de modale devient [tags-field.js](js/views/tags-field.js) et prend
  son vocabulaire en argument, les libellés de lieu localisé
  ([locate-labels.js](js/views/locate/locate-labels.js)) quittent `cities.js`, et `accSortIndex`
  devient `dictSortIndex` dans [sort.js](js/sort.js). Symétriquement, le vocabulaire de tags des
  hébergements descend de `views/tags.js` dans
  [accommodations/tags.js](js/views/accommodations/tags.js) : `views/tags.js` ne garde que
  `tagChips`, la seule brique réellement partagée.
- **2026-09-12** — `js/views/travels/favicon.js` devient
  [tab.js](js/views/travels/tab.js) : l'onglet est la responsabilité, pas seulement l'icône — titre,
  emoji et pastille « local ». `isLocalEnv` y vit, elle n'a que ce consommateur.
- **2026-09-12** — `apps-script/Html.js` créé : `matchOne` / `decodeEntities` / `matchFirst`,
  partagés par les deux scrapers ([HomeExchange.js](apps-script/HomeExchange.js),
  [Booking.js](apps-script/Booking.js)).
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
