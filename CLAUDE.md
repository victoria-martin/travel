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

## Le board se recharge tout seul — je ne le relance pas

`pnpm plan` tourne en `node --watch`, et l'écran se rafraîchit par SSE. Après une modif de
`tools/plan-board/` :

- le process tourne → je dis que c'est rechargé, rien d'autre à faire ;
- il ne tourne pas → je demande si elle veut voir les changements, et j'ouvre.

## Journal

- **2026-09-13** — `js/views/transports/` créé pour le domaine Transport, sur le découpage
  d'`attractions/`. Le mode est ce qui décide des champs : les quatre modes à compagnie portent
  `carrier` / `reference`, la voiture porte un `carId` qui **référence**
  [get-car.js](js/views/cars/get-car.js) au lieu de recopier la location — d'où deux blocs exclusifs
  dans la modale, repeints au changement de mode, et une lecture du formulaire qui garde la valeur
  du bloc absent plutôt que de l'effacer. Un départ est une ville **plus** une précision libre :
  un aéroport n'est pas une ville, mais il est dans une ville. `price.js` est la première
  implémentation de la règle transverse « budget et prix » — la fourchette `amountMin` / `amountMax`
  gagne dès qu'un montant est saisi, le budget sinon, et la cellule dit lequel elle affiche ; il
  reste dans le domaine tant qu'il n'a qu'un consommateur. Il appelle `priceNumber` / `formatEuros`,
  qui vivent encore dans [money.js](js/views/scenarios/money.js) : deux domaines les lisent
  désormais, donc ce fichier devrait remonter à plat dans `js/views/`.

- **2026-09-13** — une session ouverte par le board porte son nom : `claude --name '◉ <titre>'`
  dans [iterm.js](tools/plan-board/iterm.js). Le nom est fixe, contrairement à l'`ai-title` que le
  CLI régénère à chaque tour, et le `◉` de tête distingue ces conversations des autres dans le
  picker et le titre de terminal.

- **2026-09-12** — le statut d'une tâche suit le geste, pas ma discipline : ouvrir sa session la
  passe à `🚧 en cours` côté serveur ([server.js](tools/plan-board/server.js)), après qu'iTerm a
  répondu, et jamais sur une tâche close — `DOING_STATUS` et `CLOSED_STATUSES` rejoignent
  `NEW_STATUS` dans [statuses.js](tools/plan-board/statuses.js), qui reste le seul endroit où un
  statut se nomme. La fin, elle, se décide : c'est le skill `commit-task`
  ([.claude/skills/commit-task/SKILL.md](.claude/skills/commit-task/SKILL.md)), qui retrouve la
  tâche par le lien session ↔ `plan-sessions.json`, la passe à `✅ fait` et délègue le commit.

- **2026-09-12** — la couleur d'une pastille devient un axe à elle, partagé par les deux
  vocabulaires : [pill-variants.js](tools/plan-board/pill-variants.js) tient les six variantes et la
  classe CSS de chacune, une pastille de type et une de statut de même variante se peignent pareil.
  Le `tone` disparaît — il ne servait qu'à nommer la classe, donc il faisait doublon avec la
  variante dès l'instant où les deux listes la partagent. Les classes de [board.css](tools/plan-board/board.css)
  passent du statut (`pill-doing`, `pill-dropped`) à la couleur (`pill-info`, `pill-error`), et
  `pill-focus` est la déclinaison pleine de `pill-success` pour « à faire », le seul statut qui
  appelle l'œil. Le panneau de vocabulaire propose donc les six variantes telles qu'elles peignent,
  et non plus les tons déjà employés par la liste qu'on complète.

- **2026-09-12** — un titre du board est un accordéon : il replie ce qu'il tient, une page comme un
  groupe, et affiche alors le nombre de tâches cachées. Le repli est une préférence de vue, pas un
  état du plan — il vit dans le navigateur ([fold.js](tools/plan-board/fold.js)) sur le modèle de
  [theme.js](tools/plan-board/theme.js), parce que le board se recharge à chaque enregistrement et
  qu'une section fermée exprès ne doit pas se rouvrir toute seule. Le titre devenant le geste de
  repli, l'édition passe à une poignée : l'emoji pour la page, comme dans la barre latérale, un ✎
  pour le groupe.

- **2026-09-12** — une sous-section se crée, se renomme et se glisse comme une section. Un `###` est
  un groupe **dans** une page : deux pages peuvent porter le même nom, donc il ne se cherche jamais
  que dans la sienne — `subsectionIndex` part de `sectionRange`, et `insertionLine` cesse de
  balayer tout le fichier. Il n'a pas d'emoji, contrairement au `##` : l'icône appartient à la page,
  le groupe n'a qu'un nom, d'où un quatrième mode de tiroir
  ([subsection-drawer.js](tools/plan-board/subsection-drawer.js)) plutôt qu'un drapeau dans celui de
  la section. Le formulaire d'ajout ([new-subsection.js](tools/plan-board/new-subsection.js)) est le
  même aux trois endroits où le geste a du sens — pied de section, barre latérale, tiroir de la page
  — et son état retient lequel des trois est ouvert, puisqu'il n'y en a qu'un à la fois. Le glisser
  de la barre latérale porte désormais deux familles, il sort donc dans
  [section-drag.js](tools/plan-board/section-drag.js) sur le modèle de `task-drag.js` ;
  [sections-nav.js](tools/plan-board/sections-nav.js) ne garde que le rendu. Déposer un groupe sous
  une autre page l'y déplace, tâches comprises — l'ordre du fichier EST l'ordre affiché.

- **2026-09-12** — une tâche se tape aussi en fin de liste, dans la portée où elle atterrit :
  [new-task.js](tools/plan-board/new-task.js) ne demande que le titre — le reste (types, corps,
  statut) est le travail du tiroir — et le statut de départ, commun aux deux chemins, devient
  `NEW_STATUS` dans [statuses.js](tools/plan-board/statuses.js). Le board se rend désormais sur le
  squelette de PLAN.md et non sur le regroupement des seules tâches visibles : une portée sans
  aucune tâche reste affichée, puisqu'elle n'a rien à filtrer et que c'est là qu'on pose la
  première — sans quoi une section fraîchement créée serait inatteignable. Les archivées, elles,
  ne sont plus dans le fichier : `groupBySection` leur reste, sous la portée qu'elles gardent en
  mémoire, et le bouton ne s'y affiche pas.

- **2026-09-12** — le board se recharge à l'enregistrement. `node --watch` couvre les modules du
  serveur, un `fs.watch` du dossier plus un flux SSE (`/api/reload`) couvre les fichiers servis en
  assets, que `--watch` ne voit pas puisqu'ils ne sont jamais `require`és. Les deux moitiés passent
  par un seul canal : un restart de node coupe le flux, le navigateur se rebranche seul, et
  [live-reload.js](tools/plan-board/live-reload.js) lit cette reconnexion comme un message. Le
  tiroir ouvert diffère le rechargement jusqu'à sa fermeture — c'est le seul état qui coûte de
  perdre. La fenêtre détachée, elle, survit : le `pagehide` de l'onglet ne la ferme plus quand le
  rechargement vient de nous, et le document neuf la retrouve par son nom
  (`window.open('', 'plan-board')`) pour y reposer le `#app`, ce qui lui garde sa taille et sa
  place. D'où l'`adoptWindow` de [detach.js](tools/plan-board/detach.js), par où passent les deux
  entrées — le clic Détacher et la reprise après rechargement.

- **2026-09-12** — l'emoji est une propriété de la section, pas un caractère du nom : `splitHeading`
  coupe le `##` en deux dans [plan.js](tools/plan-board/plan.js), une section se désigne partout par
  son nom nu (tâches, portée, ancre, déplacement) et `headingLine` la réécrit. D'où le retrait du
  picker du titre de tâche — un titre n'a pas d'emoji à lui — et
  [section-drawer.js](tools/plan-board/section-drawer.js), troisième mode du tiroir, qui édite les
  deux moitiés de la ligne ; renommer une section y déplace ses tâches sans rien toucher d'autre,
  puisque le titre est le seul endroit où elle vit. Les trois modes deviennent une table lue à
  l'appel (`drawerModes`) : chacun vit dans son fichier, chargé après `drawer.js`.

- **2026-09-12** — une section se crée depuis la barre latérale, sans passer par une tâche :
  [new-section.js](tools/plan-board/new-section.js) tient le bouton et son champ, sur le modèle de
  [new-vocabulary.js](tools/plan-board/new-vocabulary.js), et `POST /api/sections` écrit le `##`
  juste avant « Données à saisir » comme le fait déjà la première tâche d'une portée neuve. La liste
  se rend désormais depuis `board.sections`, l'ordre du fichier, et non plus depuis les seules
  sections qui portent une tâche visible : sans ça une section vide n'apparaîtrait nulle part. Une
  section filtrée reste donc affichée, avec un compteur à zéro.

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
