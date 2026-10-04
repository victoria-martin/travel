# Détail scénario — porter les blocs encore `ScenarioLegacyMarkup`

Le détail d'un scénario ([ScenarioDetailView.tsx](../src/domains/scenarios/detail/ScenarioDetailView.tsx))
est un arbre React, mais plusieurs sous-blocs restent peints en `dangerouslySetInnerHTML` via
`ScenarioLegacyMarkup` ([ScenarioLegacyMarkup.tsx](../src/domains/scenarios/detail/ScenarioDetailView/ScenarioLegacyMarkup.tsx)),
une chaîne HTML construite par une fonction legacy. Les porter en JSX, un cluster à la fois.

**Effort recommandé : medium pour les clusters A/B/D, high pour C/E/F/G.** Les premiers sont des
fragments d'affichage ; les derniers touchent du state (extras, météo async), Leaflet (panneau
carte) ou des calculs déjà partiellement portés en hooks qu'il faut retrouver avant de les
recalculer à côté.

## Règle d'arrêt

**Ne faire QUE le cluster A, puis s'arrêter et attendre un go explicite** avant de passer au
suivant — l'ordre ci-dessous n'est qu'une proposition, pas un enchaînement automatique.

## Règles dures (projet)

- **Jamais de Playwright/navigateur** sur ce projet, même pour diagnostiquer. Dire « à vérifier
  visuellement » et laisser l'utilisatrice regarder à l'écran.
- `pnpm react:typecheck` et `pnpm react:build` propres après chaque cluster.
- **Chercher le hook existant avant de recalculer.** `useScenarioMoney`/`useScenarioRoad`/
  `useScenarioRoute` ([detail/hooks/](../src/domains/scenarios/detail/hooks/)) portent déjà une
  partie des calculs argent/route — avant de traduire une fonction legacy en JSX, vérifier si le
  nombre qu'elle affiche est déjà calculé par un hook, plutôt que de dupliquer le calcul.
- Toute const/let legacy lue depuis React a besoin d'un `window.X = X;` explicite ; chaque nouveau
  membre `window.*` va dans [global.d.ts](../src/types/global.d.ts).
- Une fonction legacy devenue morte après un port se vérifie (call-sites) avant suppression ; si
  elle n'a plus aucun appelant, la supprimer (pas juste un commentaire) — et si le fichier devient
  vide, le supprimer lui-même avec son `<script src>` (précédent : `step-card.js`, cluster A/B).
  Vérifier casse par casse avant de supposer tout un fichier mort — un helper du même fichier peut
  encore servir ailleurs (précédent : `stepMoveButtons`/`groupMoveButtons` morts avec `stepCard`/
  `groupRow`, mais `moveStep`/`moveGroup`/`moveUnit` du même fichier `row-move.js` vivants).

## Backlog ordonné

**A. Badges de carte d'étape — ✅ fait.** `step-card.js` → 4 composants locaux dans
[StepCard.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepCard.tsx) (`StepOrderBadge`,
`StepPlaceSuffix`, `StepDetailLine`, `StepStatusBadge`, non exportés — un seul consommateur). Les 4
fonctions legacy portées, plus `stepCard`/`makeGroupButton`/`stepCardPaint`/`STEP_TITLE_LEVELS`
(devenues mortes par cascade : `stepCard()` ne pouvait plus tourner sans elles, et n'avait déjà plus
aucun appelant vivant — voir « Trouvé en route » plus bas) ont été supprimées. `global.d.ts` :
retrait de 5 déclarations mortes
(`stepOrderBadge`/`stepPlaceSuffix`/`stepDetailLine`/`stepStatusBadge`/`stepCardPaint`), ajout de 3
nouvelles (`coordsFor`, `stepLetter`, `stepOutReason`), et correction du type de `stepPlace` qui ne
déclarait pas `region` (utilisé par `stepPlaceSuffix` depuis toujours, juste jamais typé).
`pnpm react:typecheck`/`react:build` propres.

## Trouvé en route — nettoyé

En traçant les call-sites de `stepCard()` avant suppression : toute la chaîne de rendu legacy du
détail scénario était morte, pas seulement les 4 fonctions du cluster A — `renderScenarioDetailView()`
([detail.js](../js/views/scenarios/detail/detail.js)) n'avait plus aucun appelant nulle part, l'arbre
React (`ScenarioDetailView.tsx`) l'ayant remplacée sans qu'elle soit retirée. Supprimés en cascade,
tous confirmés sans appelant vivant ailleurs avant suppression :
[step-list.js](../js/views/scenarios/detail/step-list.js),
[group-row.js](../js/views/scenarios/detail/group-row.js) et
[option-column.js](../js/views/scenarios/detail/option-column.js) (fichiers entiers + leur `<script
src>`), `renderScenarioDetailView` seule dans `detail.js` (le reste du fichier — `renameStep`,
`insertStep`, `deleteStep`… — reste vivant, appelé depuis React), et dans
[row-move.js](../js/views/scenarios/detail/row-move.js) les trois bâtisseurs de boutons HTML
`stepMoveButtons`/`groupMoveButtons`/`moveButtons`, orphelins depuis la suppression de
`stepCard`/`groupRow` (leurs seuls appelants) — `moveStep`/`moveGroup`/`moveUnit` restent, utilisés
par `StepCard.tsx`/`StepGroupView.tsx`. `pnpm react:typecheck`/`react:build` propres après coup.

**B. Argent d'une étape.**
- `stepMoney(scenario, step)` — **✅ fait.** Vérifié : `useScenarioMoney` n'expose que des totaux
  de scénario (nuits/charges/transport/attractions/total), rien au niveau étape — pas de doublon.
  Porté en `StepMoney` dans [StepCard.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepCard.tsx),
  `stepMoney` supprimée ; `step-card.js` étant alors entièrement vide, le fichier et son `<script
  src>` sont supprimés (plus seulement vidé). `global.d.ts` : ajout de `getAccommodation`/
  `hasStepBudget`/`formatAccommodationCost` (`stepAccommodationCost`/`setStepBudget` l'étaient déjà).
  `pnpm react:typecheck`/`react:build` propres.
- `stepLine` — **✅ fait, en mixte justifié.** `attraction-picker.js`/`cost-picker.js` ne sont en
  fait PAS dans sa chaîne (dépendance d'Extras/du modal étape, erreur de ma première lecture,
  basée sur l'ordre des `<script>` et pas sur les call-sites réels). La vraie chaîne :
  - **Portés en JSX réel**, nouveau dossier
    [ScenarioDetailView/StepLine/](../src/domains/scenarios/detail/ScenarioDetailView/StepLine/) +
    [StepLine.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepLine.tsx) : `stepTypeDropdown`
    → `StepTypeDropdown` (43 l., même forme que `TagDropdown` déjà utilisé ailleurs — étendu avec
    `placeholder`/`beforeItems`, deux slots génériques, pas des flags métier), `stepNightsDropdown`
    → `StepNightsDropdown` (24 l., liste de nombres donc pas `TagDropdown` — son propre petit
    Radix), `stepPlaceDateField` → un simple `<input type="date">` inline dans `StepLine.tsx`.
    Nouveau [OpenResourceMenuItem](../src/shared/select/OpenResourceMenuItem.tsx), partagé par les
    deux dropdowns. `step-type-dropdown.js`/`step-nights-dropdown.js` supprimés en entier (fichiers
    + `<script src>`), `stepLine`/`stepPlaceDateField` retirés de `step-line.js`.
  - **`stepPlaceDropdown` — ✅ fait aussi, corrigé après coup.** D'abord classé « reste en
    LegacyMarkup, même famille que `valise-composer` » — jugement trop rapide, sur la seule taille
    du fichier (223 l.) sans comparer à ce que `extraAddDropdown` (cluster C) venait de montrer
    portable. Porté dans
    [StepLine/StepPlaceDropdown.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepLine/StepPlaceDropdown.tsx) :
    recherche (`useState`), repli de groupe par type (`useState<Set>` local — pas le `Set` global
    legacy, qui n'a plus de raison d'être partagé entre étapes une fois que React porte son propre
    état), tri favoris-d'abord, création de ville à la volée (`emptyAttraction`/`uid`/
    `upsertAttraction`, primitives pures réutilisées telles quelles). `step-place-dropdown.js`
    supprimé en entier (fichier + `<script src>`) — tout ce qu'il contenait n'avait plus d'autre
    appelant.
  - **Restent en `ScenarioLegacyMarkup`**, délibérément : `stepStatusTag`/`stepAvailabilityTag`/
    `stepCheckInTimeTag`/`stepSheetButton` (délèguent à `accommodationStatusTag`/
    `outOfRangeIndicator`/`accommodationSheetButton`, eux-mêmes pas encore portés — hors scope de
    ce cluster, aucun n'est un combobox).
  `global.d.ts` : ajout de `setStepAccommodationType`/`setStepPlace`/`setStepPlaceDate`/
  `NIGHTS_OPTIONS`/`placeMatches`/`placeLevelsLabel`/`attractionTypeKey`/`openAccommodationSheet`/
  `emptyAttraction`/`upsertAttraction`/`stepSheetButton`/`stepStatusTag`/`stepAvailabilityTag`/
  `stepCheckInTimeTag`, retrait de `stepLine`/`stepPlaceDropdown` (mortes). `pnpm react:typecheck`/
  `react:build` propres.
  **Bug trouvé pendant C, corrigé ici :** `NIGHTS_OPTIONS` est un `const`, jamais exposé sur
  `window` ([nights.js](../js/views/scenarios/nights.js)) — `StepNightsDropdown` aurait planté au
  premier rendu (`window.NIGHTS_OPTIONS.map` sur `undefined`). Le typecheck ne l'a pas vu (il ne
  vérifie que le type déclaré, pas l'existence runtime) ; seul le même bug reproduit sur
  `EXTRA_COUNTS` pendant C a fait remonter le pattern.

**C. Extras — ✅ fait.** Nouveau
[ExtrasBlock.tsx](../src/domains/scenarios/detail/ScenarioDetailView/ExtrasBlock.tsx) +
[ExtrasBlock/](../src/domains/scenarios/detail/ScenarioDetailView/ExtrasBlock/) (`ExtraRow`,
`ExtraMenu`, `ExtraCountDropdown`), branché dans
[StepCard.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepCard.tsx) et
[StepGroupView.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepGroupView.tsx) (même
composant, deux porteurs — étape ou groupe).
- **Portés en JSX réel :** le conteneur (`extrasBlock`/`list.js`, fichier supprimé — entièrement
  mort une fois le mapping en React), la ligne (`extraRow`/`extraDateField`/`extraAutoPrice`
  retirés de `row.js`), la pastille d'alternatives (`extraMenu` et ses satellites retirés de
  `line-menu.js`, ne garde que `extraSiblingIds` encore lu par `ExtraMenu`), le compteur
  (`extraCountDropdown`/`pickExtraCount` retirés de `count.js`). `extraMenu`'s trigger réutilise
  `extraLabel` (legacy, inchangée — un second appelant existant dans `recap-row.js` l'empêchait
  d'être reconstruite en JSX) via `ScenarioLegacyMarkup`, pas une réécriture.
- **Corrigé en cours de route :** `extraAddRow`/`extraAddDropdown` (`add.js`) avaient d'abord été
  classés « même famille que `stepPlaceDropdown`, reste en LegacyMarkup » — faux par
  pattern-matching trop rapide. Contrairement à `stepPlaceDropdown`, pas de repli de groupes ni de
  tri par favoris : juste une recherche sur deux listes plates (`attractionMatches`/`costMatches`,
  déjà pures et réutilisables). Portés en JSX réel —
  [ExtrasBlock/ExtraAddRow.tsx](../src/domains/scenarios/detail/ScenarioDetailView/ExtrasBlock/ExtraAddRow.tsx) +
  [ExtraAddDropdown.tsx](../src/domains/scenarios/detail/ScenarioDetailView/ExtrasBlock/ExtraAddDropdown.tsx) —
  état de recherche en `useState` local, le menu reste ouvert après un rattachement
  (`event.preventDefault()` dans `onSelect`, comme le faisait le commentaire legacy « on rattache
  souvent plusieurs lignes d'affilée »). `add.js` entièrement mort, supprimé avec son
  `<script src>` ; `write.js` perd l'appel à `focusExtraSearch` dans `pushExtra`, devenu un
  no-op (plus aucun input ne porte cet id) — le nouveau composant gère son propre focus.
- **Reste en `ScenarioLegacyMarkup`, délibérément :** `extraStatusTag` (`row.js`) — délègue à
  `attractionStatusTag`, pas encore porté.
`global.d.ts` : ajout de `holderExtras`/`extraStatusTag`/`extraLabel`/`extraCount`/
`extraCountLabel`/`extraAmount`/`EXTRA_COUNTS`/`extraSiblingIds`/`hasPriceValue`/`getAttraction`/
`getFixedCost`/`costLabel`/`costMatches`/`attractionMatches`/`extrasTotal`/
`attachExtraAttraction`/`attachExtraCost`/`createAttractionNamed`/`createFixedCostNamed`/les
setters d'extra, retrait d'`extrasBlock`/`extraAddRow` (mortes). `pnpm react:typecheck`/
`react:build` propres.

**D. Chrome de l'en-tête — ✅ fait** (patron `shared/buttons/` : `Button` + `ToolbarFace`, pas de
StyleX). [ScenarioDetailHeader.tsx](../src/domains/scenarios/detail/ScenarioDetailView/ScenarioDetailHeader.tsx)
assemble en JSX : bouton météo, séparateur, 4 boutons d'onglet (`ScenarioDetailHeader/ScenarioWeatherToggle.tsx`,
`ScenarioSideTabsButtons.tsx`), séparateur, ⋮ (`SettingsMenu` + `ScenarioDetailSettings.tsx`).
- `SettingsMenu` était un port partiel (manquaient l'indicateur hors dispo et les réglages de page) :
  complété — indicateur hors dispo via un nouveau [RadioCardField](../src/shared/form-fields/RadioCardField.tsx)
  partagé, et un slot `children` pour les réglages propres à la page, comme le legacy `pageSettingsBlock`.
  Effet de bord voulu : les autres pages qui utilisent `SettingsMenu` retrouvent le même réglage que leur ⋮ legacy.
- `Button` accepte un `title` (passthrough additif).
- Legacy retiré : `scenarioWeatherToggleButton`, `scenarioSideTabsButtons`, `scenarioDetailHeader` et
  ses deux helpers (`header.js` ne garde que `setScenarioStartDate`).
- Constantes exposées sur `window` : `WEATHER_BANNER_STYLES`, `STEP_AREA_SHAPES`, `OUT_OF_RANGE_STYLES`.
- **Restent legacy, hors D :** `scenarioSideTabsRail` (rail droit, cluster G), `toolbarMenu`/`toolbarSeparator`
  (encore utilisés par les autres headers legacy), `trailOptions` (encore lu par la modale Réglages legacy).
  Les 4 onglets sont listés deux fois (legacy `SCENARIO_SIDE_TABS` pour les corps, React pour les boutons) —
  à fusionner quand G portera le panneau.
- `pnpm react:typecheck` / `react:build` propres.

**E. Bannière météo — ✅ fait.** Nouveau
[ScenarioWeatherBanner.tsx](../src/domains/scenarios/detail/ScenarioDetailView/ScenarioWeatherBanner.tsx) +
[ScenarioWeatherBanner/](../src/domains/scenarios/detail/ScenarioDetailView/ScenarioWeatherBanner/)
(`WeatherDay`, `weatherSummary`, `weatherDays`, `useWeatherForecasts`, `fetchWeatherForecast`),
monté par `ScenarioDetailView` sous `weatherBannerShown()`.
- Le remplissage asynchrone par `querySelectorAll` (`loadScenarioWeather`/`updateWeatherLocation`)
  devient un état React : `useWeatherForecasts` garde une prévision par lieu, absente = en chargement,
  échec = prévision vide. Le cache Open-Meteo (une requête par lieu et par jour) reste un `Map` de
  module dans `fetchWeatherForecast`. `weatherCodeInfo` devient une table de codes.
- `weatherDateString` doublonnait `dateToIso` ([dates.js](../js/dates.js)) : supprimée, React lit
  `dateToIso`.
- Écart assumé : un jour sans date ne lance plus de requête et reste sur « Date à renseigner » (le
  legacy fetchait quand même, puis réécrivait « Prévision indisponible à cette date »).
- **Restent legacy :** `weatherBannerShown`/`weatherBannerStyle`/`toggleWeatherBanner`/
  `setWeatherBannerStyle`/`WEATHER_BANNER_STYLES` (prefs, lus par l'en-tête React) et
  `weatherBannerStyleOption` (lu par `trailOptions` → `pageSettingsBlock`, modale Réglages legacy —
  cf. [react-migration-panels-plan.md](react-migration-panels-plan.md) § 1).
`global.d.ts` : retrait de `scenarioWeatherBanner`, ajout de `dateToIso`/`scenarioStart`/`totalDays`.
`pnpm react:typecheck` propre.

**F. Itinéraire — ✅ fait.** [RouteTrail.tsx](../src/domains/scenarios/detail/ScenarioDetailView/RouteTrail.tsx)
+ `RouteTrail/RouteTrailLink.tsx`, [RouteStrip.tsx](../src/domains/scenarios/detail/ScenarioDetailView/RouteStrip.tsx)
+ `RouteStrip/` (`RouteStripLink`, `stayRangeLabel`, `roadLegLabel`). Les briques communes aux deux
(`routeLinkColor`, `routeLinkName`, `scrollToStepCard`) et à `StepLeg` (`durationLabel`,
`distanceLabel`, sorties de `StepLeg.tsx`) vivent à plat dans `ScenarioDetailView/`.
- **Pas de composant partagé avec `scenarioRouteBar`** (liste) : la bande de la liste groupe par lieu
  (`nightsByPlace`), se met à l'échelle de la liste entière et n'est pas cliquable ; le fil et la
  bande du détail vont par étape et mènent à sa carte. Même teinte, pas la même lecture.
- **Bug corrigé au passage :** le tronçon de route de la bande (`stepLegRoadSlot`) n'était jamais
  rempli dans le détail — seul `ScenariosView` appelle `fillStepLegs`. `RouteStripLink` lit
  désormais la route de `useScenarioRoute`, comme `StepLeg`.
- Legacy supprimé : `route-trail.js` et `route-strip.js` (fichiers + `<script src>`),
  `stepLegRoadSlot` et `LEG_LABELS.road` (`step-legs.js`), `stayRangeLabel` (`step-dates.js`).
`global.d.ts` : retrait de `scenarioRouteTrail`/`scenarioRouteStrip`, ajout de
`stepStatusBackground`. `pnpm react:typecheck` propre.

**G. Panneau latéral (carte/transports/argent/valise) + split handle — ✅ fait.** Découpé en 6 lots dans
[react-migration-scenario-side-panel-plan.md](react-migration-scenario-side-panel-plan.md).

**Finitions — ✅ fait.** Les derniers fragments `LegacyMarkup` de la ligne d'étape et des extras :
- [StepLine.tsx](../../src/domains/scenarios/detail/ScenarioDetailView/StepLine.tsx) : ↗ de la fiche
  d'hébergement, `StepStatusDropdown` (`TagDropdown` + « Ouvrir la ressource », pastille pleine
  quand réservé via `.status-dropdown-booked`), `StepAvailabilityBadge`, `StepCheckInTime`
  (seulement une fois réservé). `step-line.js` supprimé, `accommodationSheetButton` aussi.
- [ExtraLabel.tsx](../../src/domains/scenarios/detail/ScenarioDetailView/ExtraLabel.tsx), lu par
  `ExtraMenu` et `ExtraRecapRow` ; `ExtrasBlock/ExtraStatusDropdown.tsx` pour le statut d'une
  activité. `extras/label.js` et `extras/row.js` supprimés.
- Comme les cellules de statut des tables déjà portées, le menu de statut n'a pas « ＋ Ajouter un
  statut » (`TagDropdown` ne le porte pas encore).

**Backlog épuisé** — plus aucun `LegacyMarkup` dans `ScenarioDetailView/`. Reste en dehors : le
champ Activités de la modale d'étape (`stepAttractionsField`, décision de
[react-migration-modales-plan.md](react-migration-modales-plan.md)), et les réglages de page lus
par la modale Réglages legacy (`trailOptions`, chantier `settings`).

## Hors scope ici

- La carte de comparaison (`scenarioCompareCard`) et la bande d'itinéraire de la liste
  (`scenarioRouteBar`) sont un écran différent (`ScenariosView`, pas `ScenarioDetailView`) — pas
  dans ce plan.
- `RouteBuilderPanel`/`NewCityButton` (Carte générale) restent délégués par décision déjà actée
  (react-migration-plan.md § 5) — ne pas les toucher ici.
