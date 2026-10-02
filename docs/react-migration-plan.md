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
  les composants. Le catalogue global démarre en pratique dès maintenant, à scope réduit : voir
  [catalogue-plan.md](catalogue-plan.md) et § 9 ci-dessous — plus « hors scope », une piste
  parallèle à celle-ci (§ 7).
- **Build/hébergement cible (2026-10-01)** : `file://`/« ouvrir `index.html` sans rien lancer » est
  abandonné à la fin de la migration — l'app se lancera avec un serveur front (comme les autres
  projets), ce qui permet un vrai build Vite (ESM, dev server, HMR) une fois `js/` legacy supprimé.
  Détail en § 1.

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
- **Build posé** (branche `react-migration`) : `vite.config.ts` compile `src/main.tsx` en **IIFE**
  (`build.lib`, format `iife`) et non en module — l'app tourne encore en scripts classiques/`file://`
  (`open index.html`, [technique.json](../atelier/technique.json)), où un `<script type="module">`
  casse sur les imports cross-origin. `react-app.js` s'inclut donc comme un `<script src>` de plus,
  juste avant `js/init.js`. Sortie dans `react-dist/`, gitignoré (c'est un build, pas une source) —
  **pas encore câblé au déploiement** : tant que `react-dist/` n'est pas construit en CI ou chez
  l'hébergeur, le script 404 silencieusement et l'app retombe sur la vue legacy, par construction
  (`REACT_VIEWS` reste `undefined`, `renderMain()` prend la branche `else`). Rejoint **Passer le
  repo en privé et héberger sur Netlify** <!--t:r6wc--> dans PLAN.md, qui donnera un vrai build.
  Pas encore exécuté dans cette session (`pnpm install` / `pnpm react:build` restent à lancer).
- **Fin de cible** : cet IIFE reste la solution de transition tant que legacy et React coexistent.
  À la Phase 4, `file://` n'a plus besoin d'être supporté (Décisions actées, en tête de ce
  document) — le build repasse en ESM standard, lancé par un serveur front plutôt qu'en ouvrant le
  fichier.

## 2. Le pont d'état

Réalisé en Phase 0b, plus restreint que prévu ici au départ — le mécanisme vérifié d'abord, le
reste au fur et à mesure (voir § 7) :

- **Types** : [store/types.ts](../src/store/types.ts). Dérivés des `emptyX()` / fonctions de
  sauvegarde réelles (`js/views/**/modal/form.js`, `save.js`), pas d'une modélisation abstraite —
  `atelier/modele.json` datait du 16/09 et plusieurs champs avaient bougé depuis (`Offer` ne porte
  plus `rentalId`/`priceTotal`, `Transport` plus `carrier`). `Scenario`/`Step`/`StepGroup` restent
  volontairement moins détaillés, cette zone étant en flux (PLAN.md, « Deux dates par étape ») —
  affinés en Phase 2.
- **Store** : [store/useTravelStore.ts](../src/store/useTravelStore.ts) est un miroir Zustand
  **en lecture seule** de la globale `state` legacy, recopié à chaque re-rendu (le mécanisme de
  notification posé en Phase 0a). Les mutations restent legacy (`upsertX`, `saveNow()`) : le store
  ne devient la seule source que domaine par domaine, quand ses actions sont portées en Phase 1+ —
  pas listées en Phase 0b, pour ne rien écrire qui ne sert personne encore.
- **Interop runtime — passé inaperçu longtemps.** Une déclaration legacy `const` / `let` n'est pas
  une propriété de `window` ; seuls `var` et les déclarations de fonction s'y attachent. Si React
  lit une valeur via `window`, le script legacy l'expose explicitement (`window.X = X` juste après
  la déclaration, ou `let X` → `var X` si elle est réassignée ailleurs — `window.X = X` une seule
  fois deviendrait sinon obsolète) et [types/global.d.ts](../src/types/global.d.ts) décrit son
  type. **2026-10-02** — masqué tout ce temps par une erreur de build antérieure
  (`process is not defined`, § 1/§ 4 : React/Radix référencent `process.env.NODE_ENV`, jamais
  défini dans un navigateur nu) qui empêchait `react-app.js` de s'exécuter jusqu'au bout — aucun
  écran React n'avait donc jamais vraiment tourné sous les yeux de l'utilisatrice, malgré des
  confirmations verbales : elles testaient la page legacy de secours sans le savoir. Une fois le
  script débloqué, cette classe de bug est apparue d'un coup sur plusieurs écrans (`ATTRACTION_TYPES`,
  `ATTRACTION_STATUSES`, `ROUTE_HELP`, `prefs`, `mapFilters`, `routeBuilder` manquaient tous) —
  audité et corrigé en un passage sur tout ce que `global.d.ts` déclare. Un deuxième bug
  d'ordonnancement est sorti en même temps : `useTravelStore` capture `window.state` une seule fois
  au chargement du script (avant que `loadData()` l'ait peuplé), et la notification qui le
  rafraîchit arrivait après le premier montage React plutôt qu'avant — `js/render.js` notifie
  maintenant `__reactStateSubscribers` en tout premier dans `render()`. Retirer l'exposition quand
  le dernier consommateur React/legacy est migré ou supprimé en Phase 4.
- **Synchro** : [store/sync.ts](../src/store/sync.ts) ne contient qu'un type `SyncAdapter`
  (contrat visé, documenté), **pas d'implémentation**. `js/sync.js` ne s'y prête pas tel quel : le
  push y est debouncé (`schedulePush`) et fait une fusion 3-voies entrée par entrée
  (`mergeStates`), pas un simple POST — l'écrire en parallèle aurait fait deux chemins écrivant sur
  le même Google Sheet, un vrai risque sur les données réelles. Reste une tâche à part, quand
  `js/sync.js` lui-même est porté (Phase 4 ou plus tôt si la bascule DB de
  [atelier/notes.json](../atelier/notes.json) démarre avant).

Risque identifié : un accès `state.x` oublié dans du legacy, pendant la période où les deux
coexistent, lirait une donnée périmée. Pas de garde automatique prévue pour l'instant — à vérifier
à la main à chaque écran migré, et avant de supprimer `js/state.js` en Phase 4.

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

- `DataTable` ([shared/DataTable/](../src/shared/DataTable/), remplace [table.js](../js/views/table.js))
  ne porte que le chrome : tri (un niveau, cycle asc/desc/aucun — pas encore persisté dans prefs ni
  multi-niveaux), rendu des lignes. `columns` reste une table de données comme aujourd'hui
  (`{key, label, sortValue?, render}[]`), chaque cellule est un composant du domaine passé en
  donnée — c'est déjà de la composition, rien à changer là-dessus. Premier consommateur :
  [domains/cities/CitiesView.tsx](../src/domains/cities/CitiesView.tsx)
  ([cells.tsx](../src/domains/cities/cells.tsx)), avec recherche, colonnes masquables, type/statut
  éditables, tags éditables, actions de ligne (ouvrir/dupliquer/supprimer). Restent : menu ⋮.
  Code/route en anglais (`cities`), libellé visible resté « Villes » — premier pas de **Nommer les
  vues en anglais** (PLAN.md), fait pour cette vue seule, pas pour les autres.
- Les interactions complexes utilisent les primitives headless Radix UI avec les classes
  existantes de `styles.css`; les composants métier et le système de style restent écrits dans le
  projet. Ne pas ajouter shadcn/ui, Tailwind ou StyleX pendant la migration. `VocabularyDropdown`
  utilise `DropdownMenu`; Transports utilise `Tabs` pour ses trois panneaux. Remplacer les autres
  interactions complexes au fil de leur migration, pas en réécrivant en bloc les composants déjà
  portés.
- **`ModalHost` n'a pas été nécessaire pour les actions de ligne.** `window.openModal(type, id)` /
  `openSheet(type, id)` / `deleteItem(collection, id)` ouvrent l'overlay legacy par-dessus toute la
  page, hors de l'arbre React monté dans `#main` — aucun conflit avec React, pas de shell à écrire.
  Cities, Charges fixes et Transports (Providers/Cars) délèguent déjà dessus. Un vrai `ModalHost`
  (remplaçant [modal.js](../js/modals/modal.js), shell : ouverture, dirty-check au snapshot,
  fermeture) ne devient utile que le jour où une modale s'écrit en **formulaire React contrôlé** à
  la place d'une legacy — pas avant, et pas pour rouvrir l'édition existante.
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

**Fait et câblée dans `REACT_VIEWS.carte`** : [platform/web/LeafletMap.tsx](../src/platform/web/LeafletMap.tsx)
est le seul fichier React à toucher `L` (Leaflet global, CDN) — composant pur, son cycle de vie
(créer/peupler/détruire la carte) est un hook à part
([LeafletMap/useLeafletMap.ts](../src/platform/web/LeafletMap/useLeafletMap.ts)), ses fonctions
impératives (icônes, interaction marqueur) dans
[LeafletMap/utils.ts](../src/platform/web/LeafletMap/utils.ts) — rien de tout ça dans le composant
lui-même. Il reçoit `markers: MapMarkerData[]`, un `onMarkerClick` optionnel (mode itinéraire) et
un `afterMarkers(map)` optionnel (tracé de scénario/itinéraire — la seule fuite assumée de
l'instance Leaflet brute, pour un dessin que LeafletMap n'a pas à connaître).
[domains/carte/](../src/domains/carte/) assemble : marqueurs hébergements/lieux/villes, filtre
(show/hide + favoris), panneau scénario (liste + bascule tous/scénario), bouton itinéraire,
légende, split-pane, menu ⋮. **Délégués au legacy en HTML injecté** (pas réimplémentés) :
`RouteBuilderPanel`/`NewCityButton` — état + async dans des globales de module, glisser HTML5,
fetch OSRM ; réécrire ça maintenant dupliquerait une logique entière pour un gain nul tant que ce
mode n'est pas une priorité à part. Pas encore porté : les actions de popup « ajouter à un
scénario » (dépendent des étapes, à ne pas re-dériver avant le détail d'un Scénario) ; le
split-pane n'appelle pas encore `invalidateSize()` pendant le glisser (LeafletMap n'expose pas
l'instance à l'extérieur), la carte se réajuste au prochain changement de marqueurs plutôt qu'en
temps réel.

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

| Phase              | Écrans                                                                                                     | Livrable technique                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0a — Mécanisme     | Villes (spike, lecture seule)                                                                              | Vite + TS en place, `REACT_VIEWS`/mount-unmount dans `renderMain()` — **fait et vérifié à l'écran**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 0b — Store         | aucun de plus                                                                                              | types par domaine (`store/types.ts`), store Zustand en lecture seule (`useTravelStore`), contrat `SyncAdapter` documenté mais pas implémenté (§ 2) — **fait, typecheck propre**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 1 — Tables simples | Cities ✅, Charges fixes ✅, Transports ✅ (3 onglets : Trajets, Loueurs & compagnies, Voitures) | **Essentiellement fait.** Partagé : `DataTable`/`SearchField`/`ToolbarPanel`/`SettingsMenu`/`ColumnPicker`/`VocabularyDropdown`(Radix `DropdownMenu`)/`EditableTagsCell`/`TagLabel`/`SwitchField`/cellules (`TextCell`/`TagsCell`/`FavoriteCell`/`LinkCell`). Tri, recherche, colonnes masquables, édition en place, tags éditables, actions de ligne (ouvrir/dupliquer/supprimer, délégué à `openModal`/`openSheet`/`deleteItem` legacy — `ModalHost` pas nécessaire, l'overlay legacy vit hors de `#main`), menu ⋮ (texte des boutons) : faits sur les 3 écrans. Restent, pas bloquants : formulaires React si une modale legacy est un jour réécrite ; `SettingsMenu` n'a que la préférence transverse (pas `outOfRangeStyleOption`/réglages par page, hors sujet ici). |
| 2 — Logique propre | Carte ✅, Scénarios (détail) pas commencé                                              | Carte : faite et câblée (§ 5) — filtre, panneau scénario, itinéraire (délégué), villes, légende, split-pane, menu ⋮. Reste : popups d'ajout à un scénario, `invalidateSize()` pendant le split. Scénarios détail : hooks de dérivation (money/road), drag & drop des étapes, groupes/options — pas commencé, design à discuter avant |
| 3 — Reste          | Accueil, Journal, Valise, À faire, Notes, Phrases, Infos utiles, Hébergements, Lieux & activités, Dépenses | application mécanique des patterns posés en 1 et 2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 4 — Le shell       | Sidebar, router, modale globale, toasts                                                                    | `index.html` devient 100 % React, `js/` legacy supprimé                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 5 — Nettoyage RN   | —                                                                                                          | vérifier qu'aucun import `domains/*`/`store/` ne touche `platform/web`, lister ce que `platform/native/` devra fournir                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

**Découvrir / catalogue ([catalogue-plan.md](catalogue-plan.md)) n'est pas une étape de cette
séquence — une piste parallèle.** Son seul prérequis est la Phase 0a (le mécanisme `REACT_VIEWS` /
mount-unmount), déjà fait : c'est un écran neuf, câblé sur Hasura/Postgres en GraphQL, qui ne lit
ni n'écrit jamais la globale `state` legacy ni le store Zustand — rien à attendre des Phases 1-5,
qui portent des écrans EXISTANTS depuis le Sheet. Elle peut donc avancer en même temps, sans ordre
imposé entre les deux. Ce que les deux partagent reste optionnel, pas un blocage : `DataTable`
(§ 4) rendrait la liste Découvrir cohérente avec le reste une fois réutilisé, mais le plan catalogue
prévoit sa propre liste en lecture seule d'abord — un alignement à faire plus tard, pas une
dépendance dure.

Point pratique : les deux pistes tournent actuellement dans le même répertoire de travail, sur la
même branche `react-migration`, avec des fichiers non commités entremêlés (Villes/DataTable d'un
côté, catalogue-plan.md de l'autre). Comme ce sont deux changements sans rapport de contenu,
séparer sur une branche à part (`decouvrir-catalogue` ou similaire, créée depuis `react-migration`
une fois ce commit-ci posé) garderait chaque effort revue-able et revert-able indépendamment,
plutôt que des commits qui mélangent les deux. À elle de trancher si une seule branche partagée est
préférée malgré tout.

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

**2026-10-01** — le catalogue global d'hébergements démarre pour de vrai, avant le multi-tenant :
voir [catalogue-plan.md](catalogue-plan.md). Scope volontairement réduit (pas d'auth, ajout au
voyage = copie) — le reste (villes/activités au catalogue, import, scraping, multi-tenant réel)
reste hors scope ici.
