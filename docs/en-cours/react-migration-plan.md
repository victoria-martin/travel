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

Référence du protocole de synchro, inchangé par cette migration : [protocole-sync-sheet.md](../protocole-sync-sheet.md).

## 1. Le mécanisme de cohabitation

**2026-10-02 — Phase 4 : React possède `#app` en entier.** Ce qui suit, jusqu'à la ligne « Fin de
cible » ci-dessous, décrit le mécanisme des Phases 0-3 (React monté dans `#main` seulement,
sidebar/router/modale encore legacy) — gardé pour l'historique, plus l'état actuel.

- **Un seul root React**, monté une fois dans [src/main.tsx](../src/main.tsx)
  (`createRoot(document.getElementById('app')).render(<AppShell />)`), pas par `render()` legacy.
  [src/shell/AppShell.tsx](../src/shell/AppShell.tsx) assemble Sidebar, MobileNav, MainContent,
  Toast, ModalHost, AskOverlayHost — s'abonne à `useTravelStore()` sans sélecteur pour se re-rendre
  sur **toute** mutation, pas une tranche typée de `state`.
- **`render()` ([js/render.js](../js/render.js)) ne construit plus rien** : il notifie
  `__reactStateSubscribers`, la même liste que `useTravelStore`, et laisse React se re-rendre
  lui-même. `REACT_VIEWS`/`mountReactView`/`unmountReactView`/`renderMain()`/`mainNode()` ont
  disparu — plus besoin d'un root imbriqué dans `#main` une fois que `#app` entier est React.
  Le point de bascule par vue vit maintenant dans
  [src/shell/MainContent.tsx](../src/shell/MainContent.tsx) : une table `VIEWS` (même esprit que
  l'ancien `REACT_VIEWS`) associe une clé de route à son composant. **2026-10-02** — `scenarios`
  (la liste), dernière vue de `js/router.js` sans entrée, portée sur React
  ([domains/scenarios/ScenariosView.tsx](../src/domains/scenarios/ScenariosView.tsx)) : toutes les
  clés de `VIEWS` ont désormais un composant, le repli `LegacyMarkup` générique dans
  `MainContent.tsx` a disparu avec. Recherche/favoris/scénario choisi/comparer/archivés/actions en
  vrai React ; la bande d'itinéraire (`scenarioRouteBar`, calcul + couleurs de statut, aucune
  interaction propre) et la carte de comparaison (`scenarioCompareCard`, même famille que les
  lignes de récap du détail d'un scénario) restent déléguées.
- **Conséquence qui compte** : `react-dist/react-app.js` devient une **dépendance dure**, plus un
  filet de secours. Avant cette phase, un build React absent/périmé faisait silencieusement
  retomber CHAQUE vue sur son rendu legacy (`REACT_VIEWS` `undefined` → branche `else` de
  `renderMain()`). Maintenant, si ce script ne charge pas, `#app` reste **vide** — rien ne se
  rend du tout, nulle part. Rejoint le chantier **Passer le repo en privé et héberger sur
  Netlify** <!--t:r6wc--> (PLAN.md) : un vrai build en CI devient nécessaire, pas juste utile.
- **Ordre de script inversé dans `index.html`** : `js/init.js` (qui appelle `loadData()`) charge
  maintenant **avant** `react-dist/react-app.js`, pas après. `useTravelStore` lit `window.state`
  à l'évaluation du module (au chargement du script React) — avant ce changement, React montait
  avant que `loadData()` ait peuplé `state`, lisant un store vide dès le tout premier rendu.
- **Le pont React ↔ DOM manuel legacy, généralisé.** Quatre mécanismes — `dismissAsk` (modal.js),
  `askNewWord`, `askNewProvider`, `openRouteAccommodationChoice` — posaient une question
  par-dessus l'écran en faisant eux-mêmes `document.getElementById('app').appendChild(...)`,
  jamais revisités par un `render()`. Sûr tant que `#app` était du HTML legacy brut ; plus du tout
  une fois que React possède `#app` et réconcilie ses propres enfants sans connaître ce noeud
  étranger (risque réel de collision lors d'un futur `insertBefore`, pas juste théorique). Unifiés
  derrière un seul mécanisme, [js/ask-overlay.js](../js/ask-overlay.js)
  (`showAskOverlay`/`closeAskOverlay`/`activeAsk`) peint par
  [src/shell/AskOverlayHost.tsx](../src/shell/AskOverlayHost.tsx) — une seule ask active à la fois,
  comme avant. Au passage : l'indicateur « legacy/react » posé en haut à droite de l'écran plus tôt
  dans la session (`body[data-render-mode]`) n'avait plus de sens une fois ce binaire disparu —
  retiré, avec `.nav-legacy-indicator` (CSS mort depuis qu'un essai antérieur de flag par page a
  été abandonné).
- **`ModalHost` ([src/shell/ModalHost.tsx](../src/shell/ModalHost.tsx)) peint le corps de la
  modale via `dangerouslySetInnerHTML`**, pas via l'ancien `appendChild` manuel. Gain inattendu :
  tant que `modal.payload` ne change pas (la saisie est non contrôlée, lue seulement à
  l'enregistrement), `modalBodyHtml()` rend la **même chaîne** à chaque appel → React ne retouche
  jamais ce DOM. `dismissModal()` peut donc rappeler `render()` sans perdre la saisie en cours —
  avant, `render()` était justement évité pendant l'édition pour cette raison précise (commentaire
  d'origine : « un render les remplacerait par la donnée d'avant »). Ce garde-fou n'est donc plus
  nécessaire ; gardé quand même par cohérence avec le reste de l'app.
- **Le défilement se préserve sans code dédié.** `keptScroll`/`renderedRoute`/`viewScroller()`
  (js/render.js) existaient pour garder la position de scroll d'un rendu à l'autre de la même vue,
  et la remettre à zéro en changeant de vue. La réconciliation React fait ça gratuitement : même
  composant → mêmes noeuds DOM gardés en place (scroll intact) ; composant différent → l'ancien
  arbre est démonté, le nouveau commence sans scroll. Supprimés sans remplacement.
- **Ce qui reste délégué, inchangé par cette phase** : le menu mobile (glisser-déposer),
  `travelSelector`/`syncStatusHtml`/`settingsButton` (widgets autonomes), et tout ce que les
  écrans déjà portés délèguent déjà (RouteBuilderPanel, NewCityButton, le builder À faire, le
  panneau du jour du Journal, la bande d'itinéraire et les cartes de comparaison de Scénarios).
  Rien de tout ça n'est retiré de `js/` — Phase 4 change
  _qui possède le DOM_, pas _combien d'écrans sont encore legacy_.

---

Ce qui suit décrit le mécanisme des Phases 0-3, remplacé ci-dessus — gardé pour l'historique.

Le point de bascule était `#main`. [render.js](../js/render.js) séparait le shell (sidebar, rendu
une fois dans `render()`) du contenu de la vue (`renderMain()`, qui réécrivait `#main` à chaque
route) — c'était la frontière dont un strangler fig avait besoin à ce stade.

- `REACT_VIEWS` (table de données, comme `MODAL_TYPES` aujourd'hui) associe une clé de route à son
  composant React. `renderMain()` teste `view in REACT_VIEWS` : si oui, monte/mets à jour un root
  React dans `#main` ; sinon, `innerHTML = renderXView()` comme aujourd'hui.
- **2026-10-02 — bug structurel trouvé en vrai, pas en théorie, et fixé à la racine.** `render()`
  (js/render.js) reconstruit **tout** `#app` — donc un `<div id="main">` flambant neuf — à
  **chaque** appel, sans condition, pas seulement au changement de vue. `mountReactView` ne
  recréait un root React que si la vue changeait (`mountedView !== viewKey`) : dès le deuxième
  `render()` sur la même vue (la moindre interaction), React continuait de peindre dans l'ancien
  `#main`, détaché du DOM, pendant que le `#main` visible restait vide pour toujours — rien de
  React n'était donc réellement visible après le tout premier rendu. Un premier correctif
  (démonter/recréer le root à chaque appel) marchait mais perdait l'état local React à chaque
  mutation et repartait du symptôme plutôt que de la cause : `#app` n'avait aucune raison de
  recréer `#main`, lui, à chaque fois — seul le shell (sidebar, barre mobile, toast) change de
  contenu. `render()` garde désormais `#main` comme un **noeud stable** (`mainNode()`, créé une
  fois, jamais recréé par `innerHTML`, juste réinséré via `replaceWith` dans le shell reconstruit).
  `mountReactView` peut alors suivre l'idiome React normal : ne démonter/recréer le root que si le
  conteneur ou la clé de vue changent, sinon un simple `root.render()` — l'état local React
  (dropdown ouvert, etc.) survit maintenant à un `render()` legacy déclenché ailleurs, ce qui
  n'était vrai nulle part avant, legacy compris.
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
  audité et corrigé en un passage sur tout ce que `global.d.ts` déclare.
- **2026-10-02 — boucle infinie (React error #185) sur tous les écrans qui lisent le store.**
  `window.ofCurrentTravel(items)` ([current-travel.js](../js/current-travel.js)) fait un `.filter`,
  donc renvoie un **nouveau tableau** à chaque appel, même quand son contenu n'a pas changé. Tous
  les sélecteurs Zustand de la forme `useTravelStore((store) => window.ofCurrentTravel(store.data.X))`
  violaient donc le contrat de `useSyncExternalStore` (le `getSnapshot` doit être stable entre deux
  lectures identiques) — chaque rendu invalidait le suivant, boucle sans fin détectée par React au
  bout de son nombre maximal de re-rendus imbriqués. Visible d'abord sur Cities et Carte (les deux
  écrans testés), mais le même motif existait sur Transports (3 onglets) et Fixed Costs. Fix
  uniforme : chaque sélecteur passe par `useShallow` (`zustand/react/shallow`), qui compare le
  tableau produit élément par élément au lieu de sa référence — la boucle de recalcul de
  `ofCurrentTravel` reste, mais ne déclenche plus de re-rendu tant que son résultat est le même
  jeu d'objets. Au passage : [src/domains/cities/CitiesTable.tsx](../src/domains/cities/CitiesTable.tsx)
  supprimé — brouillon `// TODO: draft` du même écran, jamais importé nulle part, laissé par la
  session parallèle avant que `CitiesHeader`/`CitiesHeaderActions` n'en sortent.
- Un deuxième bug
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
  [domains/cities/CitiesView.tsx](../src/domains/cities/CitiesView.tsx), dont les cellules ont
  migré dans [domains/attractions/cells.tsx](../src/domains/attractions/cells.tsx) — Attractions et
  Cities portent la même entité (§ 7, Phase 1). Recherche, colonnes masquables, type/statut
  éditables, tags éditables, actions de ligne (ouvrir/dupliquer/supprimer) faits. Reste : menu ⋮.
  Code/route en anglais (`cities`), libellé visible resté « Villes » — premier pas de **Nommer les
  vues en anglais** (PLAN.md), fait pour cette vue seule, pas pour les autres.
- Les interactions complexes utilisent les primitives headless Radix UI avec les classes
  existantes de `styles.css`; les composants métier et le système de style restent écrits dans le
  projet. Ne pas ajouter shadcn/ui, Tailwind ou StyleX pendant la migration. `TagDropdown`
  ([shared/select/](../src/shared/select/)) utilise `DropdownMenu`; Transports utilise `Tabs` pour
  ses trois panneaux. Remplacer les autres interactions complexes au fil de leur migration, pas en
  réécrivant en bloc les composants déjà portés.
- **2026-10-02 — dossier `shared/select/`** : tout composant de menu déroulant (Radix
  `DropdownMenu`) vit dans `src/shared/select/`, pour repérer les doublons d'un coup d'œil plutôt
  que de les laisser se recréer sous des noms différents à chaque écran. A tout de suite servi :
  `VocabularyDropdown.tsx`, recréé par erreur à l'identique de `TagDropdown.tsx` (déjà renommé plus
  tôt) par la session parallèle qui ignorait le renommage — supprimé, zéro consommateur.
  `EditableTagsCell` ([shared/cells/](../src/shared/cells/)) utilise aussi `DropdownMenu` en
  interne mais reste dans `cells/` : son identité première est une cellule de tableau éditable, le
  menu n'est qu'un détail d'implémentation — à rouvrir si ce découpage s'avère faux à l'usage.
- **`ModalHost` n'a pas été nécessaire pour les actions de ligne**, tant que la Phase 4 n'avait pas
  donné `#app` à React : `window.openModal(type, id)` / `openSheet(type, id)` /
  `deleteItem(collection, id)` ouvraient l'overlay legacy par-dessus toute la page, hors de l'arbre
  React monté dans `#main` seulement — aucun conflit. **2026-10-02, Phase 4** —
  [src/shell/ModalHost.tsx](../src/shell/ModalHost.tsx) existe maintenant (§ 1), shell générique
  (ouverture, dirty-check, fermeture) qui peint `cfg.body(modal)` en `dangerouslySetInnerHTML`
  pour tous les types encore legacy. **Premier formulaire porté en vrai composant React** :
  `actual-expense` (dépense réelle), pilote avant les autres —
  [domains/expenses/modal/ActualExpenseModal.tsx](../src/domains/expenses/modal/ActualExpenseModal.tsx),
  branché dans [src/modal-bodies.ts](../src/modal-bodies.ts) (table type → composant,
  consultée par `ModalHost` à côté du `dangerouslySetInnerHTML` par défaut — un deuxième type,
  `import-expenses`, l'a rejoint depuis). Délibérément proche du legacy, pas une réécriture
  complète : champs **non contrôlés** (`defaultValue`), le bouton `#f-save` délègue toujours à
  `window.saveActualExpense(id)` (js/views/expenses/actual.js) inchangée — elle lit déjà ces
  mêmes ids via `document.getElementById`, les dupliquer en TypeScript n'aurait rien apporté tout
  de suite. Seul ce qui change : le gabarit (JSX typé plutôt qu'une chaîne HTML échappée à la
  main) et, pour ce type, `MODAL_TYPES['actual-expense'].body` devenu mort (plus jamais appelé,
  `modalBodyHtml()` n'est plus invoqué pour un type présent dans `MODAL_BODIES`) — retiré avec
  `actualExpenseForm()`. Le dirty-check (`modalIsDirty`/`modalSnapshot`) continue de fonctionner
  sans y toucher : `modalFieldsState()` lit génériquement tout `input`/`textarea`/`select` sous
  `.modal`, peu importe qui les a peints.
- **2026-10-03 — `ModalHost` sur Radix `Dialog`** (`@radix-ui/react-dialog` +
  `@radix-ui/react-visually-hidden`, nouvelles dépendances). Gratuit pour **tous** les types, pas
  seulement ceux déjà portés en React : Radix ne regarde pas le contenu (`dangerouslySetInnerHTML`
  ou composant), juste l'overlay/le focus/le clavier — focus trap, restauration du focus à la
  fermeture, `aria-modal`, en remplacement de l'implémentation main (backdrop à la main, listener
  clavier global). `.overlay`/`.modal` gardent leur CSS inchangée (centrage par flex du parent sur
  l'enfant) en nichant `Dialog.Content` **dans** `Dialog.Overlay` plutôt qu'en frères comme le fait
  l'exemple Radix par défaut — rien n'impose cette forme, `Overlay` n'est qu'un div stylé. Échap et
  clic dehors appellent `dismissModal()` (qui vérifie la saisie non enregistrée) via
  `preventDefault()` sur les callbacks Radix plutôt que son close automatique ; le listener Échap
  global de `modal.js` se tait alors tout seul (`event.defaultPrevented`, déjà écrit pour ce genre
  de coordination), pas de double dismiss. `Dialog.Title` (exigé par Radix pour l'accessibilité)
  reste pour l'instant le `type` technique de la modale, masqué visuellement
  (`VisuallyHidden`) — les formulaires encore en HTML injecté portent déjà leur propre `<h3>`
  visible, pas encore relié en `Dialog.Title` ; à améliorer si un libellé plus lisible devient
  utile (lecteur d'écran).
- **2026-10-03 — composants partagés entre formulaires, et deuxième/troisième type portés.**
  [src/shared/CloseModalButton.tsx](../src/shared/CloseModalButton.tsx) : le bouton « Annuler »,
  identique dans tous les formulaires legacy (`onclick="dismissModal()"`), sort en commun plutôt
  que répété à chaque port — **appelle `dismissModal()`, pas `closeModal()`** : la distinction
  compte dès qu'un type a `edits: true` (`closeModal()` fermerait en silence une saisie non
  enregistrée, sans redemander). Trouvé une fois en trop sur un composant déjà extrait
  (`import-expenses`, sans incidence pour lui puisqu'il n'a pas `edits: true`) — corrigé avant de
  le réutiliser ailleurs.
  [src/shared/TagsField.tsx](../src/shared/TagsField.tsx) : port de `tagsField` (js/views/tags-field.js),
  **à ne pas confondre avec `EditableTagsCell`** (shared/cells/) — chrome différent, une cellule de
  tableau ouvre un menu déroulant, un champ de modale affiche tous les tags cochés en ligne avec
  leur croix de retrait, plus un champ libre. Seul composant de formulaire **contrôlé** pour
  l'instant (`tags`/`onChange`) : une liste qui se modifie a besoin d'un re-rendu à chaque geste,
  contrairement aux champs texte/select en `defaultValue` partout ailleurs — `payload.categories`
  reste muté en parallèle du state local pour que la fonction de sauvegarde déléguée (qui la lit
  directement sur `modal.payload`) voie la bonne valeur.
  `charge` (Charge budgétaire) rejoint `actual-expense` —
  [domains/fixed-costs/modal/FixedCostModal.tsx](../src/domains/fixed-costs/modal/FixedCostModal.tsx),
  premier à utiliser `TagsField`.
- **2026-10-03** — repéré sur `FixedCostModal.tsx` : le balisage `.field`/`<select>`/bouton
  d'enregistrement se réécrivait en clair à chaque formulaire plutôt que de se généraliser dès le
  deuxième consommateur. Six briques génériques dans `src/shared/` couvrent maintenant tous les
  champs d'un formulaire de modale — `TextField`, `TextareaField`, `SelectField`, `FieldRow`,
  `ModalSaveButton`, `ModalTitle` — et les deux formulaires déjà portés les consomment (voir
  CLAUDE.md « Un champ de formulaire de modale vit dans `shared/` »). Troisième type porté avec ces
  briques : `phrase` —
  [domains/phrases/modal/AddTranslationModal.tsx](../src/domains/phrases/modal/AddTranslationModal.tsx), délégué à
  `window.saveCustomPhrase(id)` inchangée. **Prochain lot** : continuer sur les types restants
  (`attraction`/`accommodation*` utilisent aussi `TagsField`, bon test de réutilisation — attendre
  que la session parallèle finisse d'y ajouter `createdAt` avant d'y toucher ; `voyage`/`step` sont
  plus complexes).
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
mode n'est pas une priorité à part. **2026-10-02 — les deux derniers restes de la Phase 2 Carte
faits** : les actions de popup « ajouter à un scénario » (`attractionPopup.ts` délègue à
`window.mapAttractionScenarioActions`, une chaîne HTML de plus — Leaflet rend les popups hors de
l'arbre React, pas de composant à écrire) ; `SplitHandle` reçoit maintenant la ref posée par
`afterMarkers` sur l'instance Leaflet (la même porte de sortie assumée que pour le tracé de
scénario) et appelle `invalidateSize()` à chaque pixel du glisser, au lieu d'attendre le prochain
changement de marqueurs.

**2026-10-03 — Phase 5, premier passage.** Vérification demandée par le tableau des phases (§ 7) :
grep de `platform/web` et de Leaflet/`window.L` dans `domains/*/hooks` et `store/` — zéro résultat,
les seuls imports de `platform/web` sont dans `domains/carte/MapView.tsx` (le composant d'écran, le
point de composition légitime) et un import de **type seul** (`MapMarkerData`, le contrat de props
entre l'écran et `LeafletMap`) dans `markers.ts`. La règle « rien dans les hooks/store n'importe
`platform/web` » tient, Carte étant le seul écran ayant un vrai composant plateforme à swapper.

**Trois fuites identifiées, pas encore derrière une frontière `platform/`** (Leaflet est le seul
sous-système qui en a une aujourd'hui) :
- `@dnd-kit/core`, drag & drop souris des étapes de scénario
  ([StepList.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepList.tsx),
  [StepCard.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepCard.tsx)) — pointeur/DOM,
  RN demande un mécanisme tactile différent (gesture-handler + reanimated, ou une lib dnd RN).
- `FileReader`, lecture du CSV importé
  ([ImportExpensesModal.tsx](../src/domains/expenses/modal/ImportExpensesModal.tsx)) — API fichier
  du navigateur, RN n'a pas cette classe.
- `@radix-ui/*` : `Dialog` ([ModalHost.tsx](../src/shell/ModalHost.tsx)), `DropdownMenu`
  ([TagDropdown.tsx](../src/shared/select/TagDropdown.tsx), consommé par `EditableTagsCell.tsx`),
  `Tabs` ([TransportsView.tsx](../src/domains/transports/TransportsView.tsx)) — ces primitives
  n'ont pas d'équivalent RN direct (pas de portage 1:1 d'une lib web).

**Ce que `platform/native/` devra fournir**, au minimum : une carte (ex. `react-native-maps`, même
contrat `MapMarkerData[]`/`onMarkerClick`/`afterMarkers` que `LeafletMap`) ; un drag & drop tactile
pour les étapes de scénario ; un sélecteur de fichier + lecture de contenu pour l'import CSV ; des
primitives Dialog/DropdownMenu/Tabs (soit des libs RN dédiées, soit des composants maison avec la
même interface que leurs équivalents Radix). Rien d'urgent — pas de RN à l'horizon proche — mais la
liste est maintenant posée plutôt qu'à découvrir plus tard.

**Mitigations mobile (web) posées dans le même tour, distinctes du sujet RN ci-dessus** — pour
l'app mobile actuelle, pas en préparation d'un futur port natif :
- Drag des étapes de scénario : déjà non affiché sous 640px (`.step-drag-handle{display:none}`,
  [styles.css:3911](../styles.css#L3911)), les boutons `.step-reorder-buttons` restent. Rien à
  faire, déjà en place avant ce tour.
- Import CSV (`FileReader`) : bouton masqué sous 640px (`.import-expenses-btn`, TEMP — commentaire
  dans [ImportExpensesButton.tsx](../src/domains/expenses/ExpensesView/ImportExpensesButton.tsx)),
  pas encore adapté au tactile.
- Dialog Radix centrée : passe plein écran sous 640px comme `.modal-sheet` le fait déjà sous
  440px (`.overlay`/`.modal`, [styles.css:1348](../styles.css#L1348)) — exclu de `.modal-ask`/
  `.overlay-ask` (la question de confirmation reste une petite boîte centrée, pas une sheet).

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
  shared/           DataTable/, Toolbar/, TagsField/, LegacyMarkup.tsx   (multi-domaines, comme js/views/*.js à plat)
  shell/            AppShell.tsx, Sidebar.tsx, MainContent.tsx, ModalHost.tsx, Toast.tsx,
                     AskOverlayHost.tsx, MobileNav.tsx — la racine React (Phase 4, § 1)
  platform/web/     LeafletMap.tsx, dragAndDrop.ts
```

## 7. Phases

| Phase              | Écrans                                                                      | Livrable technique                                                                                                                                                                                                                                                                                                                 |
| ------------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0a — Mécanisme     | Villes (spike, lecture seule)                                               | Vite + TS en place, `REACT_VIEWS`/mount-unmount dans `renderMain()` — **fait et vérifié à l'écran**                                                                                                                                                                                                                                |
| 0b — Store         | aucun de plus                                                               | types par domaine (`store/types.ts`), store Zustand en lecture seule (`useTravelStore`), contrat `SyncAdapter` documenté mais pas implémenté (§ 2) — **fait, typecheck propre**                                                                                                                                                    |
| 1 — Tables simples | Cities ✅, Charges fixes ✅, Transports ✅, Attractions ✅, Hébergements ✅ | **Fait**, détail ci-dessous.                                                                                                                                                                                                                                                                                                       |
| 2 — Logique propre | Carte ✅, Scénarios (détail) ✅                                            | **Fait** — le DnD (dernier point ouvert) est résolu et confirmé à l'écran le 2026-10-03, détail ci-dessous.                                                                                                                                                                                                                        |
| 3 — Terminée ✅    | Journal, Accueil, Notes, Infos utiles, Phrases, Valise, À faire, Dépenses   | détail ci-dessous.                                                                                                                                                                                                                                                                                                                 |
| 4 — Le shell       | Sidebar ✅, router ✅, modale globale ✅, toasts ✅                         | `#app` est un seul root React (§ 1, détail complet) — `js/` reste en place : cette phase change qui possède le DOM, pas combien d'écrans sont encore legacy (`scenarios` liste, menu mobile, formulaires, panneaux complexes délégués restent à part). « `js/` legacy supprimé » reste l'horizon final, pas le livrable de ce lot. |
| 5 — Nettoyage RN   | —                                                                           | **Premier passage fait (2026-10-03, détail § 5)** : vérif clean, 3 fuites listées (`@dnd-kit/core`, `FileReader`, `@radix-ui/*`) — rien d'urgent, pas de RN à l'horizon proche.                                                                                                                                                   |

**Phase 1, détail.** Partagé : `DataTable`/`SearchInput`/`ToolbarMenu` (ex-`ToolbarPanel`)/`SettingsMenu`/`ColumnPicker`/
`TagDropdown`(Radix `DropdownMenu`, `shared/select/`)/`EditableTagsCell`/`EditableTextCell`/`TagLabel`/
`SwitchField`/cellules (`TextCell`/`TagsCell`/`FavoriteCell`/`LinkCell`). Tri, recherche, colonnes
masquables, édition en place, tags éditables, actions de ligne (ouvrir/dupliquer/supprimer, délégué
à `openModal`/`openSheet`/`deleteItem` legacy — `ModalHost` pas nécessaire, l'overlay legacy vit hors
de `#main`), menu ⋮ (texte des boutons) : faits sur les 5 écrans. Restent, pas bloquants : formulaires
React si une modale legacy est un jour réécrite ; `SettingsMenu` n'a que la préférence transverse (pas
`outOfRangeStyleOption`/réglages par page, hors sujet ici).
Attractions (`domains/attractions/`) étant la même entité que Cities (`domains/cities/`), leurs
cellules et leur texte de recherche sont partagés (`attractions/cells.tsx`,
`attractions/searchAttraction.ts`) — Cities les consomme plutôt que de les dupliquer. Colonnes
Attractions portées : favori/nom/type/statut/tags/description/ville/province/lien/actions ; restent
(comme Cities) chosenStep, prix, region/country/address/coords/accommodation/hours/phone, Google
Maps, tri sur vocabulaire, bouton Ajouter.
Hébergements (`domains/accommodations/`) : `EditableTextCell` nouveau (notes + prix en édition
inline, contentEditable + `onBlur`, sans `window.render()` — exactement la raison du `syncEditable`
legacy, qui évite d'arracher le focus) ; colonnes portées favori/nom(+notes)/type/statut/ville/
province/tags/prix/dates/disponible du·au/lien/booking/actions, ligne → fiche (`openSheet`) ; restent
chosenStep, region/country/address, colonne notes à part, Google Maps, favoris seuls, mode cartes,
panneau de filtres, bouton Importer, menu d'ajout à 5 portes (un seul bouton « Ajouter », saisie
manuelle). `ACCOMMODATION_TYPES`/`ACCOMMODATION_STATUSES` n'étaient jamais exposées sur `window`
(même classe de bug que § 2) — corrigé au passage.

**Phase 2, détail.** Carte : **faite, § 5 pour le détail** — filtre, panneau scénario, itinéraire
(délégué), villes, légende, split-pane (`invalidateSize()` pendant le glisser), popups d'ajout à un
scénario, menu ⋮. Rien de connu en reste sur cet écran.
Scénarios détail : parent React, hooks money/road/route, cartes, groupes/options et drag
multi-colonnes dnd-kit branchés dans `REACT_VIEWS`, vérifié à l'écran par l'utilisatrice
(2026-10-02). Le DnD a eu trois pistes avant la bonne : toute étape déplacée atterrissait en fin de
liste quel que soit l'endroit du drop, dans les deux premières — (1) `onPointerMove` posé en bulle
sur `.step-list`, remplacé par `event.operation.position.current.y` (position interne de dnd-kit,
toujours cassé après ce fix) ; (2) retour à un pointeur traqué nous-mêmes en phase de capture sur
`window` avec `clientY`, toujours cassé. Les deux recalculaient before/after depuis
`getBoundingClientRect()` — géométrie déjà en décalage, puisque `OptimisticSortingPlugin` de
dnd-kit réordonne le DOM en live pendant le glisser et tient à jour `sortable.index`/`.group` sur
l'entité déplacée. (3) `finishDrag` lit désormais cette position déjà résolue par la lib
(`draggedStep.sortable.index`/`.group`) au lieu de la recalculer — confirmé à l'écran par
l'utilisatrice (2026-10-03).

**Phase 3, détail.** Notes et Infos utiles : deux écrans sans table, plus proches d'un formulaire
que d'une liste — pas d'infra `DataTable`, juste `useTravelStore()` (sans sélecteur, le composant se
contente de ce que `mountReactView` rappelle à chaque `render()` legacy) + délégation complète aux
getters/setters legacy. `<textarea>`/`<input>` en **non contrôlé** (`defaultValue`, pas `value`)
partout où le setter legacy ne fait pas de `render()` (`setTripNote`, `setCountryInfoField`) — un
champ contrôlé y afficherait un texte périmé dès la première frappe, exactement la raison documentée
dans le commentaire legacy (« re-rendre arracherait le champ »). Reste pour Infos utiles : rien
d'identifié, c'est un port complet du legacy (seed + champs désactivés + note éditable).
Accueil : même composition que les trois cartes legacy — `HomeCard` (`domains/home/HomeView/`) ne
porte que le chrome (icône, titre, lien), le corps de chaque carte est passé en `children` par
`ScenarioCard`/`PackingCard`/`TodoCard`, qui délèguent chacune à un getter legacy (`chosenScenario`,
`travelPackingItems`, `todoListsOfTravel`/`todoListItems`/`freeTodosOfTravel`) — port complet, rien
de différé.
Phrases (`domains/phrases/`) : recherche en `useState` React classique (contrôlé), contrairement à
Notes/Infos utiles — ici le champ qui tape n'est pas celui qui se re-rend, un re-render React de la
liste en dessous ne lui fait perdre ni focus ni curseur, le souci qui forçait le non-contrôlé
ailleurs ne s'applique pas. Catégories en dur + phrases custom (localStorage, hors `state`/sync —
`types.ts` du domaine, pas `store/types.ts`), traduction + correction (déléguée à `window.prompt`
via `editPhraseTranslation`), sélecteur de langue. Restent : style de carte (classique/duo/minimal),
mode liste/cartes, formulaire d'ajout/édition React.
Valise (`domains/packing/`) : le **catalogue** (page `valise`) est porté ; l'onglet Valise d'un
scénario aussi depuis (2026-10-04, [react-migration-scenario-side-panel-plan.md](../archivé/react-migration-scenario-side-panel-plan.md)
§ G5). Composer la valise du voyage (`openSheet('valise-composer')`) reste un overlay legacy (§ 10). `<details>` non contrôlé pour le repli des
groupes (`open` littéral, jamais recalculé — React ne retouche l'attribut que si la prop change
entre deux rendus, donc un clic utilisateur n'est jamais écrasé) plutôt que de réimplémenter
`packingClosedGroups` : le repli est un geste de session, jamais persisté, même en legacy.
À faire (`domains/todo/`) : seule la carte **Tâches libres** (texte libre, pas de ressource à
filtrer) est un vrai composant React. Le builder et chaque liste dynamique (ressource + colonne +
valeurs cochées → table de N'IMPORTE quel `kind` via `listTable`) restent délégués via
`shared/LegacyMarkup` — réimplémenter un registre colonnes-par-kind en React est un chantier à
part, pas celui-ci. Même mécanisme que RouteBuilderPanel/NewCityButton (§ 5) : complexité stateful
existante, déléguée plutôt que réécrite avant d'en avoir besoin.
Journal (`domains/journal/`) : scénario source + rang de jours cliquables (`DayCards.tsx`) sont de
vrais composants React. Le panneau du jour — éditeur markdown, dropdown `{}` d'insertion de lieu,
photos, pastilles planifiées, refs non résolues, panneau carte — reste **entièrement délégué** via
`LegacyMarkup` (`window.journalDayPanel(scenario, date)`, un seul appel) : tout tourne autour d'un
unique `<textarea>` et de la position de son caret (`document.getElementById('journal-text')`,
sélection, insertion au point d'insertion), un bloc profondément impératif sans découpage naturel en
sous-composants React — même famille que RouteBuilderPanel/NewCityButton/le builder À faire, pas une
liste ou un formulaire ordinaire. `initJournalMap()` (Leaflet, panneau carte) rappelé dans un
`useEffect` plutôt qu'un `setTimeout` comme en legacy — le montage React garantit déjà le DOM peint
avant l'effet.
Dépenses (`domains/expenses/`) : budget prévu, dépenses réelles et calculé-depuis-les-réservations,
les trois sections portées en React. Budget prévu/Dépenses réelles restent des `<table>` écrites en
clair plutôt que `DataTable` — des lignes de total et de non-budgétisé s'intercalent entre les
lignes d'entité, que l'abstraction `DataTable` (une ligne = un item) ne sait pas représenter.
`LabelCell` (`domains/fixed-costs/cells.tsx`) réutilisé tel quel pour le libellé budgétaire — même
entité (`FixedCost`) que la page Charges fixes. Nouveau type `ActualExpense`
([store/types.ts](../src/store/types.ts)) : collection absente du typage, ajoutée par le lot
« budget vs actual » pendant que la migration portait d'autres écrans. Restent, pas bloquants :
panneau de tri (`sortPanel`), menu ⋮ complet (seule la préférence transverse `SettingsMenu` est
reprise, comme partout ailleurs).

**Phase 3 terminée.** Les 8 écrans legacy identifiés sont portés. Le DnD de `StepList.tsx` et la
Phase 4 (le shell), restés ouverts à ce moment-là, sont faits depuis (voir leurs lignes du tableau).
Le détail d'un scénario n'a plus aucun `LegacyMarkup` depuis le 2026-10-04 :
[react-migration-scenario-detail-plan.md](../archivé/react-migration-scenario-detail-plan.md) et
[react-migration-scenario-side-panel-plan.md](../archivé/react-migration-scenario-side-panel-plan.md).

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

- Le protocole de synchro Google Sheet ([protocole-sync-sheet.md](../protocole-sync-sheet.md)) est
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

## 10. Ce qui reste legacy — où et pourquoi

Relevé du 2026-10-04, après les lots A–E de la même journée (`git grep "LegacyMarkup
html=\|dangerouslySetInnerHTML" -- src`, plus les `body:` restants de `MODAL_TYPES`). C'est le
backlog vers « `js/` legacy supprimé ».

**Encore legacy, et pourquoi :**
- Modale `settings` et bouton Réglages de la barre latérale (`settingsButton`) — chantier en cours
  côté utilisatrice ([react-migration-panels-plan.md](react-migration-panels-plan.md) § 1), pas
  touché pour ne pas croiser son travail.
- Journal — `journalDayPanel` : bloc impératif autour d'un seul `<textarea>` et de son caret (§ 7,
  Phase 3). Le sheet mobile du panneau (`journal-panel`) est porté, pas le panneau desktop, resté
  dans ce bloc.
- À faire — `todoBuilder` : registre colonnes-par-kind à réécrire en entier (§ 7, Phase 3).
- Carte — `RouteBuilderPanel`, `NewCityButton` : état + async dans des globales de module (§ 5).
- Questions posées par-dessus une modale (`askNewWord`, `askNewProvider`) : HTML legacy peint par
  `OverlayHost`. Les menus React les appellent avec un rappel (`onCreate`).
- Page **Locations** endormie (journal CLAUDE.md 2026-09-16) : ses fichiers restent sur le disque,
  volontairement — son formulaire garde le `providerSelectField` legacy (adapté à la nouvelle
  signature d'`askNewProvider`). Déjà cassée avant cette passe : `offerPriceLabels` et
  `rentalDatesLabel`, qu'elle appelle, ont disparu en `0dfb035`. Avec React propriétaire de `#app`
  (Phase 4), la rallumer demande de toute façon un port, plus un simple retour de balises.

**Fait le 2026-10-04 (lots A–E)** : liste Scénarios (carte de comparaison, bande d'itinéraire —
avec suppression de toute la chaîne legacy liste/récap), modales `sync`/`valise-composer`/
`journal-panel`, « ＋ Ajouter un type/statut » dans `TagDropdown` (`afterItems` +
`AddWordMenuItem`), barre latérale (sélecteur de voyage, état de synchro) et barre mobile, tous les
fragments legacy des modales React (`LocateFields`, `ProviderSelectField`, `MultiSelectField`,
`AddByNameRow`, champs de l'offre/du loueur/du modèle/du trajet/du voyage, actions « Ajouter à un
scénario » d'un lieu, instructions d'import collé, champ Activités d'une étape).

**Manques et points connus :**
- La modale d'import collé (`paste-import`) n'est ouverte que par l'en-tête legacy des
  Hébergements, dont le bouton « Importer » n'est pas porté (§ 7, Phase 1) : son corps React existe,
  rien ne l'ouvre aujourd'hui.
- Modale d'étape, champ Activités : cliquer Enregistrer pendant que la recherche a le focus ne fait
  rien au premier clic — au mousedown le champ perd le focus, la liste de résultats (dans le flux)
  se vide, le bouton remonte et le mouseup tombe à côté. Même comportement en legacy ; constaté en
  test automatisé (2026-10-05), pas corrigé.
- Non vérifié, déduit du CSS : sous 1100px, le fil du trajet et la bannière météo du détail
  scénario collent tous deux à `--view-header-h` ; affichés ensemble, la bannière (z-index 18)
  recouvrirait le fil (15).
