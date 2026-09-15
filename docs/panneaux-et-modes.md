# Panneaux et modes — la grammaire d'écran

Où se pose une chose qui s'ouvre, et où vit ce qui se souvient qu'elle est ouverte. Ce document
décrit l'état du code au **15 septembre 2026**, working tree compris — la refonte des filtres y est
en cours (§3.2).

Documents liés : [spec produit](spec-voyage-toscane.md) (écran par écran) ·
[map user flows](map-user-flows.md) (les parcours) · [CLAUDE.md](../CLAUDE.md) (où vit quoi)

---

## 1 — Anatomie d'un écran

```
┌──────────────┬───────────────────────────────────────────────────────────┐
│ 🧳 Toscane  ⌄│  Hébergements                              .view-header   │
│  ─────────── │  Hôtel · Airbnb · Camping — 24 enregistrés                │
│  🏠 Héberg.  │                        [⇅][⌕][▦][★][▤|▩][⎘][＋][⋮]        │
│  🚗 Locations├───────────────────────────────────────────────────────────┤
│  💶 Dépenses │                                                           │
│  🏛 Lieux    │                    le corps de la vue                     │
│  ✈ Transports│              (tableau · cartes · carte · détail)          │
│  🧭 Scénarios│                                                           │
│  🗺 Carte    │                                                           │
│  📝 Notes    │                                                           │
│  ☑ À faire   │                                                           │
│  ─────────── │                                                           │
│  ⟳ sync  ⚙  │                                                           │
└──────────────┴───────────────────────────────────────────────────────────┘
   .sidebar                          .main  (#main)
```

Neuf pages dans la barre ([router.js](../js/router.js)), plus le détail d'un scénario routé en
`#scenario/<id>`. Chaque geste rebâtit tout le DOM ([render.js](../js/render.js)) : c'est ce qui
oblige tout état d'ouverture à vivre **hors** de l'élément, dans une globale ou dans `prefs`.

---

## 2 — Les quatre surfaces

Rien d'autre ne s'ouvre dans l'app. Chaque fois qu'un écran a besoin de montrer quelque chose en
plus, il prend l'une de ces quatre.

### 2.1 Panneau de barre d'outils — [toolbar/panel.js](../js/views/toolbar/panel.js)

```
 [⇅ Trier ▾]  ← <summary class="toolbar-btn">, badge = nombre de niveaux actifs
  ┌────────────────────────────────────┐
  │ Trier par  [Statut ⌄][Croissant ⌄] │  .toolbar-panel-body
  │ puis par   [Ville  ⌄][Croissant ⌄] │
  │ ＋ Ajouter un niveau                │
  └────────────────────────────────────┘
```

Un `<details>` dont l'ouverture est mémorisée dans `openToolbarPanel` — une globale unique, donc
**un seul panneau ouvert dans toute l'app**. Le panneau possède la disclosure et le compteur ;
l'appelant possède le contenu.

### 2.2 Menu inline — [inline-dropdown.js](../js/views/inline-dropdown.js)

```
  │ Villa Rossa │ [🏨 hôtel ⌄] │ 120 € │     ligne de tableau
                  └─────────────┐
                  │ 🏨 hôtel  ✓ │  posé en coordonnées viewport :
                  │ 🏠 airbnb   │  .table-wrap et la colonne du détail
                  │ ⛺ camping  │  rognent ce qui dépasse d'elles
                  └─────────────┘
```

Ouverture dans `openInlineMenu`, position calculée par `placeInlineMenu` — sous le déclencheur, ou
au-dessus quand la place est de ce côté, jamais hors fenêtre. Un scroll qui déplace vraiment le
déclencheur ferme le menu ; celui que provoque un re-render ne le ferme pas.

### 2.3 Modale et panneau de droite — [modals/modal.js](../js/modals/modal.js)

```
        openModal(type, …)                    openSheet(type, id)
   ┌─────────────────────────┐        ┌──────────────────┬──────────┐
   │ ░░░░░░░░░░░░░░░░░░░░░░░ │        │                  │  fiche   │
   │ ░ ┌───────────────┐ ░░░ │        │   la liste reste │  même    │
   │ ░ │  formulaire   │ ░░░ │        │   lisible        │  form.   │
   │ ░ └───────────────┘ ░░░ │        │                  │          │
   └─────────────────────────┘        └──────────────────┴──────────┘
        création                            lecture / correction
```

Un seul `modal = {type, sheet, payload}`. Le même formulaire sert aux deux poses : c'est
**l'ouverture** qui tranche, pas le type. Deux fiches s'ouvrent ainsi au clic de ligne, via
`ROW_CLICKS` ([table.js](../js/views/table.js)) : [hébergement](../js/views/accommodations/sheet.js)
et [prestataire](../js/views/providers/sheet.js).

### 2.4 Question par-dessus — `overlay-ask`

```
   overlay (la modale ouverte, ses champs tapés vivent dans le DOM)
     └── overlay-ask   ← nœud injecté à la main, AUCUN render()
          « Enregistrer les modifications ? »   [Ne pas enregistrer][Annuler][Enregistrer]
```

Deux cas : la fermeture d'une saisie non enregistrée (`dismissAsk`) et le prestataire qui manque au
milieu d'un formulaire ([quick-create.js](../js/views/providers/quick-create.js)). Tous deux
interdisent le re-render — il remplacerait les champs par la donnée d'avant — et traitent `Entrée`
et `Échap` eux-mêmes, sinon la modale du dessous les prendrait pour les siennes.

### Fermeture au clic extérieur

```
FLOATING_PANELS = inline-dropdown[open] · toolbar-panel[open] · travel-selector[open]
```

Les trois familles flottantes sont nommées une par une dans
[close-on-outside-click.js](../js/close-on-outside-click.js). Un `<details>` qui déplie **en
place** — une famille du récap — appartient à la page et reste ouvert.

---

## 3 — Les panneaux de barre d'outils

Quatre, tous bâtis sur `toolbarPanel`.

### 3.1 Trier — [sort.js](../js/sort.js)

Une pile de niveaux ordonnée : le premier critère qui départage deux lignes gagne. Une colonne de
vocabulaire ne se renverse pas, elle se **range** : son second champ est le menu de ses mots,
glissables ([sort-order-menu.js](../js/sort-order-menu.js)).

### 3.2 Filtrer — [filters/](../js/views/filters/)  ⚠ refonte en cours

```
  [⌕ Filtrer ▾] (2)
   ┌────────────────────────────────────────┐
   │ Filtrer par [Type   ⌄][🏨 hôtel, 🏠… ⌄]│ ← les mots dans un menu inline,
   │ et          [Ville  ⌄][3 valeurs     ⌄]│   cochables, cherchables dès 8
   │ ＋ Ajouter un niveau                    │
   └────────────────────────────────────────┘

        OU dans un niveau  ·  ET entre niveaux
        l'ordre des niveaux ne change rien : rien à y ranger
```

Un filtre est une pile de niveaux, sur la forme du panneau Trier. L'état vit **par écran** (`scope`)
et non par collection : filtrer la carte ne filtrera pas la page. Ce qu'une colonne peut filtrer est
dérivé, jamais déclaré — elle filtre dès qu'elle porte des mots, et seules les valeurs qu'une ligne
porte vraiment sont proposées ([filterable.js](../js/views/filters/filterable.js)).

> **État du chantier** : seul l'écran Hébergements est branché
> ([accommodations.js](../js/views/accommodations.js)). La carte garde son `mapFilters` propre, et
> les autres pages n'ont pas encore de bouton Filtrer.

Le favori échappe au panneau : c'est un bouton de la barre
([fav-only.js](../js/views/accommodations/fav-only.js)) — un geste qu'on fait vingt fois, pas un axe
qu'on compose.

### 3.3 Colonnes — [columns.js](../js/columns.js)

Cases à cocher, une par colonne non verrouillée. Le badge compte les colonnes **masquées**. Une
colonne masquée du tableau reste filtrable : c'est la liste qui la porte, pas le tableau.

### 3.4 ⋮ Affichage — [toolbar/menu.js](../js/views/toolbar/menu.js)

```
   ⚙ de la barre latérale ──► modale ─┐
                                      ├──► settingsBlocks()
   ⋮ de n'importe quelle liste ───────┘      │
                                             ├─ Réglages généraux (textes des boutons)
                                             └─ Réglages de la page ouverte (PAGE_SETTINGS)
```

Les deux portes rendent exactement les mêmes blocs
([settings/blocks.js](../js/views/settings/blocks.js)). Aujourd'hui une seule page en déclare :
le détail d'un scénario, pour le fil du trajet.

---

## 4 — Ce que porte chaque en-tête

| Page                                                       | Trier   | Filtrer | Colonnes | Bascules           | Autres boutons                          | ⋮   |
| ---------------------------------------------------------- | ------- | ------- | -------- | ------------------ | --------------------------------------- | --- |
| [Hébergements](../js/views/accommodations/header.js)       | table   | ✅      | table    | Tableau / Cartes   | Favoris · Importer¹ · **Ajouter** (4 portes) | ✅  |
| [Locations](../js/views/rentals/header.js)                 | —       | —       | —        | —                  | Nouvelle recherche                      | ✅  |
| [Dépenses](../js/views/expenses/header.js)                 | table   | —       | table    | Tableau / Cartes   | Ajouter                                 | ✅  |
| [Lieux & activités](../js/views/attractions/header.js)     | ✅      | —       | ✅       | —                  | Ajouter                                 | ✅  |
| [Transports](../js/views/transports/header.js)             | onglet² | —       | onglet²  | **3 onglets**      | Ajouter (de l'onglet)                   | ✅  |
| [Scénarios](../js/views/scenarios/header.js)               | —       | —       | —        | —                  | Nouveau · Comparer · Archivés           | —   |
| [Détail scénario](../js/views/scenarios/detail/header.js)  | —       | —       | —        | **2 onglets côté** | identité + total                        | ✅  |
| Carte · Notes · [À faire](../js/views/todo/header.js)      | —       | —       | —        | —                  | —                                       | —   |

¹ disparaît dès qu'un Sheet est connecté — la synchro devient la voie d'entrée.
² chaque onglet déclare ses propres actions dans `TRANSPORT_TABS`
([tab.js](../js/views/transports/tab.js)).

---

## 5 — Les modes, et où vit chacun

```
Un état d'écran
  ├── « le geste en cours »  ─────────────► globale de module, perdue au rechargement
  │      comparer, l'onglet ouvert, ce qui est déplié, les filtres
  │
  └── « un choix qu'on veut retrouver » ──► prefs, écrit par persistPrefs()
         le tri, les colonnes, la largeur du panneau, les replis du récap
```

| Mode                                                        | Valeurs                            | Où       | Retrouvé |
| ----------------------------------------------------------- | ---------------------------------- | -------- | -------- |
| [listViewMode](../js/views/list-mode.js)                    | `table` / `card`, par liste        | globale  | non      |
| [transportsTab](../js/views/transports/tab.js)              | trajets / prestataires / voitures  | globale  | non      |
| [compareMode](../js/views/scenarios/compare/mode.js)        | bool + ids cochés                  | globale  | non      |
| [showArchivedScenarios](../js/views/scenarios/archive.js)   | bool                               | globale  | non      |
| [openRentalIds](../js/views/rentals/fold.js)                | locations dépliées                 | globale  | non      |
| [filters](../js/views/filters/levels.js)                    | niveaux, par écran                 | globale  | non      |
| [favOnly](../js/views/accommodations/fav-only.js)           | bool                               | globale  | non      |
| [mapFilters](../js/views/map/filters.js)                    | 2 listes de types, province, …     | globale  | non      |
| [todoDraft](../js/views/todo/draft.js)                      | ressource / colonne / mots         | globale  | non      |
| `prefs.scenarioSidePanel`                                   | `map` / `money` / `null`           | prefs    | **oui**  |
| `prefs.scenarioSideWidth`                                   | un % **par onglet**                | prefs    | **oui**  |
| `prefs.sort` · `hiddenColumns` · `recapFolds` · `showButtonLabels` | par liste                  | prefs    | **oui**  |

Les `prefs` vivent dans leur propre clé de `localStorage` ([prefs.js](../js/prefs.js)) : la synchro
reconstruit `state` depuis les seules collections de données, tout ce qui traîne ailleurs serait
perdu au prochain pull.

Les bascules elles-mêmes passent toutes par `toolbarToggleGroup` :

```
  [▤ Tableau│▩ Cartes]     [🗺 Carte│€ Argent]     [✈ Trajets│🏢 Loueurs│🚗 Voitures]
   listViewMode             onglets latéraux        onglets de Transports
```

---

## 6 — Les panneaux hors barre d'outils

### 6.1 Carte — une colonne, pas un flottant

```
┌──────────────┬────────────────────────────────┐
│ Hébergements │                                │
│  ☑ 🏨 hôtel  │                                │
│  ☑ 🏠 airbnb │          la carte              │
│ Lieux        │          Leaflet               │
│  ☑ 🏛 musée  │                                │
│ Province ▸   │                                │
│ Favoris  ▸   │                                │
│ Scénario ▸   │                                │
└──────────────┴────────────────────────────────┘
 .map-filters      #map
```

Cases à cocher et non pastilles, **deux listes de types** — un type d'hébergement et un type de
lieu ne se comparent pas — puis province, favoris et scénario, qui valent pour les deux collections
([map/filter-panel.js](../js/views/map/filter-panel.js)).

### 6.2 Détail d'un scénario — colonne de droite glissable

```
┌────────────────────────────────┬╫┬──────────────────┐
│  étape A  Florence   3 nuits   │║│                  │
│  étape B  Sienne     2 nuits   │║│   Carte  ou      │
│  ＋                             │║│   Argent         │
│                                │║│                  │
│                                │║├──────────────────┤
│                                │║│ 5 nuits   1 240 €│ ← pied, quel que soit l'onglet
└────────────────────────────────┴╫┴──────────────────┘
                        .scenario-split (glissable)
```

Les deux boutons de l'en-tête **sont** la bascule du panneau : recliquer celui qui est allumé le
referme, d'où un seul état retenu, `null` quand rien n'est ouvert
([side-tabs.js](../js/views/scenarios/detail/side-tabs.js)). Chaque onglet garde sa largeur — la
carte s'ouvre large, l'argent étroit ([split.js](../js/views/scenarios/detail/split.js)).

### 6.3 Récap — accordéon en place

```
 Total général
 ▾ Hébergements              840 €     ← <summary>, le montant se lit ouvert comme fermé
     Villa Rossa    3 n      360 €
     Total                   840 €
 ▸ Charges                   120 €
 ▸ Attractions               280 €
 ───────────────────────────────────
 Total          5 nuits    1 240 €
```

État dans `prefs.recapFolds` ([total.js](../js/views/scenarios/detail/total.js)) — c'est la seule
disclosure persistée, et la seule exclue de la fermeture au clic extérieur.

### 6.4 Locations — accordéon de recherche

Une location est un contexte (loueur, lieu, dates) qui se déplie sur ses véhicules
([fold.js](../js/views/rentals/fold.js)). Une location qu'on vient de créer s'ouvre : c'est là
qu'on va taper.

---

## 7 — La page À faire

Aucune barre d'outils. Deux surfaces, toutes deux en place.

```
 À faire
 3 listes — 12 lignes à traiter
┌─────────────────────────────────────────────────────────┐
│ [Hébergements ⌄] [Statut ⌄]            [＋ Ajouter]     │  le constructeur
│ (à voir) (à réserver) (réservé) (écarté)                │  ← pastilles cliquables
└─────────────────────────────────────────────────────────┘

 🏠 Hébergements · Statut                    4        [×]
 (à voir) (à réserver) (réservé) (écarté)                   ← les MÊMES pastilles :
 ┌───────────────────────────────────────────────┐            on modifie la liste
 │ le listTable de la page source, colonnes      │            là où on la lit
 │ et éditions en place comprises                │
 └───────────────────────────────────────────────┘
```

Une liste enregistrée est une **donnée** (`state.todoLists`, portée par le voyage), là où les
filtres d'une page sont un geste. Les deux lisent le même vocabulaire de colonnes
([filters/filterable.js](../js/views/filters/filterable.js)) et la même liste de ressources
([filters/resources.js](../js/views/filters/resources.js)) : la clé étant celle de la page source,
son tableau et ses colonnes valent ici sans rien réécrire.

---

## 8 — Les menus inline, par famille

| Famille                     | Forme                                        | Où                                                                                                     |
| --------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Pastille de vocabulaire     | `[🏨 hôtel ⌄]` → la liste des mots           | statut (hébergement, lieu, location, transport) · type (hébergement, lieu) · mode (transport)          |
| Menu **avec recherche**     | champ + liste repeinte à la frappe            | [lieu d'une étape](../js/views/scenarios/detail/step-place-dropdown.js) · [rattacher une ligne](../js/views/scenarios/detail/extras/add.js) · [valeurs d'un filtre](../js/views/filters/values-menu.js) |
| Menu d'action               | des boutons, pas des valeurs                  | [alternatives d'une ligne](../js/views/scenarios/detail/extras/line-menu.js) · [insérer une étape](../js/views/scenarios/detail/step-list.js) |
| Choix de valeur             | un nombre, une référence                      | nuits · nombre d'extras · voiture · dépenses du scénario                                                |
| Rangement d'un vocabulaire  | glissable                                     | [sort-order-menu.js](../js/sort-order-menu.js), dans le panneau Trier                                   |

Deux traits communs aux menus qui cherchent : la frappe **ne repeint que la liste** — un render
arracherait la saisie — et un nom sans correspondance **se crée sur place**, l'entrée neuve ne
portant alors que son nom.

---

## 9 — Choisir une surface

```
Ce que je veux montrer…
  ├─ un réglage de la liste entière ............. toolbarPanel, dans l'en-tête
  ├─ le choix d'une valeur sur UNE ligne ........ inlineDropdown
  ├─ un formulaire complet
  │    ├─ on crée ............................... openModal
  │    └─ on lit / corrige sans quitter l'écran .. openSheet
  ├─ une question par-dessus une saisie ......... overlay-ask, sans render()
  └─ un détail qui appartient à la page ......... <details> en place, hors FLOATING_PANELS
```

Et, pour l'état qui va avec : `prefs` si on veut le retrouver demain, une globale de module si
c'est le geste en cours. Un état qui décrit le **plan** (un scénario archivé, une liste À faire) est
une donnée et va dans `state`, pas ici.

---

## 10 — Ce qui dépasse

- [fixed-costs/fixed-costs.js](../js/views/fixed-costs/fixed-costs.js) et
  [fixed-costs/header.js](../js/views/fixed-costs/header.js) ne sont ni appelés ni chargés dans
  [index.html](../index.html) : orphelins depuis que Dépenses a remplacé Charges fixes. Le reste du
  dossier sert toujours.
- `confirm()` subsiste dans
  [group-actions.js](../js/views/scenarios/detail/group-actions.js) (« Ne garder que cette
  option ? »), alors que le board a dû s'en passer pour sa fenêtre détachée.
- Le bouton Filtrer n'existe que sur Hébergements : les autres listes attendent leur branchement.
