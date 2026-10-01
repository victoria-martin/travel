# Migration React

Passer `js/` (372 fichiers, 18630 lignes, état global mutable + re-rendu `innerHTML` complet) sur
React + TypeScript, en gardant l'app utilisable à chaque étape. Deuxième objectif, qui pèse sur
plusieurs choix ci-dessous : préparer un futur portage React Native — la logique de domaine (store,
hooks, calculs) ne doit jamais importer quelque chose de spécifique au navigateur.

Décisions actées (validées en session) :

- **Stratégie** : incrémental, écran par écran (strangler fig) — pas de big bang.
- **Langage** : TypeScript.
- **État global** : Zustand.
- **CSS** : `styles.css` reste tel quel, réutilisé par les composants React — pas de CSS modules ni
  CSS-in-JS pendant la migration, pour ne pas cumuler un changement visuel avec le changement de
  moteur de rendu.
- **Synchro** : la couche sync du store est un adaptateur remplaçable (`read()` / `push(data,
  baseRev)`), branché sur Google Sheets comme aujourd'hui. Le jour où un catalogue partagé
  multi-client demande une vraie base relationnelle, seul l'adaptateur change — pas les hooks ni
  les composants. Ce besoin (catalogue global, plusieurs fronts clients sur la même DB) est noté à
  part, hors scope de cette migration : [atelier/notes.json](../atelier/notes.json), § 9 ci-dessous.

Référence du protocole de synchro, inchangé par cette migration : [protocole-sync-sheet.md](protocole-sync-sheet.md).

## 1. Le mécanisme de cohabitation

Le point de bascule est `#main`. [render.js](../js/render.js) sépare déjà le shell (sidebar, rendu
une fois dans `render()`) du contenu de la vue (`renderMain()`, qui réécrit `#main` à chaque
route) — c'est exactement la frontière dont un strangler fig a besoin.

- `REACT_VIEWS` (table de données, comme `MODAL_TYPES` aujourd'hui) associe une clé de route à son
  composant React. `renderMain()` teste `view in REACT_VIEWS` : si oui, monte/mets à jour un root
  React dans `#main` ; sinon, `innerHTML = renderXView()` comme aujourd'hui.
- Le shell (sidebar, router, modale globale, toasts) reste legacy jusqu'à la toute fin (Phase 4) :
  il sert les deux mondes sans rien savoir d'eux.
- **À valider en spike avant d'ouvrir le premier écran** (pas encore vérifié à l'exécution) :
  comment Vite sert `src/` en mode dev à côté des scripts classiques déjà en place, et comment le
  build de prod s'intègre à `index.html` sans casser les balises `<script src>` existantes. Deux
  pistes à comparer sur le vrai repo plutôt qu'à trancher sur papier : Vite avec les assets legacy
  dans `public/`, ou un build séparé chargé en `<script type="module">` additionnel.

## 2. Le pont d'état

Le store Zustand ([store/useTravelStore.ts](../js/state.js)) devient la **seule** source — pas une
synchro à double sens avec le `state` global. Le code legacy qui n'a pas encore été migré lit
`useTravelStore.getState()` au lieu de la globale `state` : c'est une migration mécanique,
accès par accès, pas une réécriture de sa logique. Les 16 collections et les actions de mutation
(`upsertAccommodation`, etc.) gardent leur forme actuelle — seul le conteneur change.

`store/sync.ts` expose une interface étroite et non le détail du protocole Sheet :
`read(): Promise<{rev, data}>` / `push(data, baseRev): Promise<{rev, data} | {conflict: true, ...}>`
(reprend tel quel le contrat documenté dans [protocole-sync-sheet.md](protocole-sync-sheet.md)).
Le store n'appelle que ces deux fonctions ; rien dans `domains/*/hooks` ni dans les composants ne
sait que le backend est un Google Sheet. C'est ce qui laisse la porte ouverte à une bascule DB plus
tard (catalogue partagé, multi-client — voir [atelier/notes.json](../atelier/notes.json)) sans
toucher au reste de l'app. Pas de sur-ingénierie au-delà de cette interface : tant que la DB cible
n'est pas tranchée, les types restent ceux d'aujourd'hui (une entité porte un `travelId`) — les
faire porter un lien vers un catalogue global sans backend pour le servir serait une hypothèse, pas
un besoin vérifié.

Risque identifié : un accès `state.x` oublié dans du legacy, pendant la période où les deux
coexistent, lirait une donnée périmée. Pas de garde automatique prévue pour l'instant — à vérifier
à la main à chaque écran migré, et avant de supprimer `js/state.js` en Phase 4.

Types TS par domaine, dérivés des `emptyX()` / `migrateData` existants ([storage.js](../js/storage.js))
plutôt que réinventés : `Accommodation`, `Scenario`, `Step`, `Attraction`, `Ville`, `Transport`,
`Provider`, `CarModel`, `Offer`, `FixedCost`, `TripNote`, `TodoList`, `FreeTodo`,
`PackingListItem`, `CountryInfo`, `JournalEntry`, `Travel`.

## 3. Hooks — donnée dérivée vs état d'action

Même distinction que partout ailleurs dans l'app (CLAUDE.md global, « Composer par
responsabilité ») :

- **Hooks de donnée** (`useAccommodations()`, `useScenarioMoney(id)`, `useScenarioRoad(id)`) —
  lisent le store, enveloppent les fonctions pures existantes (`money.js`, `road.js`...) dans un
  `useMemo`, ne possèdent aucun état transitoire. Idempotents : les rappeler ne fait rien à
  personne.
- **État d'action** (modale ouverte, `isRefreshing`, drag en cours) — reste un `useState` **dans le
  composant qui déclenche le geste**. Un hook de lecture n'embarque jamais ça, même si le même
  composant utilise les deux.

## 4. Composition — le chrome vs le contenu

- `DataTable` (remplace [table.js](../js/views/table.js)) ne porte que le chrome : tri, rendu des
  lignes, panneau de colonnes. `columns` reste une table de données comme aujourd'hui
  (`COLUMN_SETS` → `{key, label, Cell, sortValue, filterValues}[]`), chaque `Cell` est un composant
  du domaine passé en donnée — c'est déjà de la composition, rien à changer là-dessus.
- `ModalHost` (remplace [modal.js](../js/modals/modal.js)) ne porte que le shell : ouverture,
  dirty-check au snapshot, fermeture. Chaque type de modale rend le composant du domaine
  (`<AccommodationForm/>`), jamais une prop par champ.
- Un écran s'écrit toujours en clair (`AccommodationsView.tsx` assemble ses briques) — pas de
  moteur générique piloté par config qui fabriquerait l'écran à la place du fichier.

## 5. Frontière plateforme (préparation RN)

Tout ce qui est spécifique au navigateur part dans `platform/web/`, derrière une interface fine :
Leaflet ([leaflet-base.js](../js/views/leaflet-base.js), `map/`, `detail-map.js`), le drag & drop
souris ([drag.js](../js/views/drag.js), `step-drag.js`, `mobile-nav/drag.js`), `window.open`,
`document.startViewTransition`. Rien dans `domains/*/hooks` ni dans `store/` n'importe
`platform/web` directement — ces hooks reçoivent au besoin une fonction/un composant en argument
(ex. le composant de carte), jamais l'implémentation Leaflet elle-même. Le jour où RN arrive, seul
`platform/` se réécrit (`platform/native/`) ; store et hooks ne bougent pas.

## 6. Dossiers

```
src/
  store/            useTravelStore.ts, persistence.ts, sync.ts, migrations.ts, types/
  domains/
    accommodations/
      hooks/        useAccommodations.ts, useAccommodation.ts
      AccommodationsView.tsx
      AccommodationsTable/
      AccommodationModal/   Form.tsx, BookingForm.tsx, AirbnbForm.tsx, ...
    scenarios/
      hooks/        useScenarioMoney.ts, useScenarioRoad.ts
      detail/       ScenarioDetailView.tsx, StepList/, ...
    ... (un dossier par domaine, même règle qu'aujourd'hui : un domaine = un dossier)
  shared/           DataTable/, Modal/, Toolbar/, TagsField/   (multi-domaines, comme js/views/*.js à plat)
  platform/web/     LeafletMap.tsx, dragAndDrop.ts
```

## 7. Phases

| Phase | Écrans | Livrable technique |
| --- | --- | --- |
| 0 — Fondations | aucun | Vite + TS + Zustand en place, store porté, pont d'état, mécanisme `REACT_VIEWS`, spike validé sur un écran trivial (Villes) |
| 1 — Tables simples | Villes, Transports, Charges fixes, Prestataires/Modèles | `DataTable`, `Toolbar`, `Modal`/`Sheet` partagés, posés une fois pour 4 écrans |
| 2 — Logique propre | Scénarios (détail), Carte | Hooks de dérivation (money/road), premher découpage `platform/web` (Leaflet), drag & drop des étapes |
| 3 — Reste | Accueil, Journal, Valise, À faire, Notes, Phrases, Infos utiles, Hébergements, Lieux & activités, Dépenses | application mécanique des patterns posés en 1 et 2 |
| 4 — Le shell | Sidebar, router, modale globale, toasts | `index.html` devient 100 % React, `js/` legacy supprimé |
| 5 — Nettoyage RN | — | vérifier qu'aucun import `domains/*`/`store/` ne touche `platform/web`, lister ce que `platform/native/` devra fournir |

## 8. Ce qui ne bouge pas

- Le protocole de synchro Google Sheet ([protocole-sync-sheet.md](protocole-sync-sheet.md)) est
  inchangé — seul son appelant (`sync.ts` au lieu de `sync.js`) change de forme.
- `styles.css` reste la seule source de style pendant toute la migration.
- Leaflet reste la lib carte web ; son remplacement RN (`react-native-maps` ou équivalent) est hors
  scope de ce plan, géré en Phase 5 au moment où RN démarre réellement.

## 9. Hors scope, pour mémoire

Notes brutes dans [atelier/notes.json](../atelier/notes.json) : plusieurs déclinaisons produit
(agence de voyage, niches parents/chiens, outil vendu à des travel agents, guide type Fooding) sur
une même DB partagée — catalogue global d'hébergements/activités/villes, indépendant d'un
`travelId`, avec import (Booking/Google/Airbnb) et scraping prix/dispo en continu. Tout ça demande
une vraie base relationnelle et un vrai backend multi-tenant, pas juste une réécriture React. Ce
n'est pas une étape de ce plan : l'adaptateur sync (§ 2) garde seulement la porte ouverte pour ne
pas avoir à redéfaire le store le jour où cette initiative démarre pour de vrai.
