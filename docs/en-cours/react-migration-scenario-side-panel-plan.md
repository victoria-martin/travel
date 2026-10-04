# Détail scénario — porter le panneau latéral (cluster G)

Sous-plan du cluster G de [react-migration-scenario-detail-plan.md](react-migration-scenario-detail-plan.md).
Le panneau de droite du détail scénario est encore entièrement legacy, monté par
[ScenarioDetailView.tsx](../../src/domains/scenarios/detail/ScenarioDetailView.tsx) via trois
`ScenarioLegacyMarkup` : `scenarioSplitHandle()`, `scenarioSidePanel(scenario)` (avec
`initializeMaps`) et `scenarioSideTabsRail(scenario.id)`.

## Règle d'arrêt

**Un lot à la fois, puis stop et attendre un go explicite.** Commit à la fin de chaque lot.

## Règles dures

Celles du plan parent (pas de Playwright, typecheck propre, chercher le hook existant avant de
recalculer, `window.X` + `global.d.ts`, legacy mort supprimé après vérif des call-sites).

## État des lieux

| Morceau | Legacy | Consommateurs |
| --- | --- | --- |
| Coque (`<aside>` + pied nuits/total) | [side-panel.js](../../js/views/scenarios/detail/side-panel.js) | panneau desktop |
| Table des onglets | `SCENARIO_SIDE_TABS`, [side-tabs.js](../../js/views/scenarios/detail/side-tabs.js) | panneau desktop, rail, sheet mobile (`scenarioPanelSheet`) — **et** une recopie React dans [ScenarioSideTabsButtons.tsx](../../src/domains/scenarios/detail/ScenarioDetailView/ScenarioDetailHeader/ScenarioSideTabsButtons.tsx) |
| Rail vertical | `scenarioSideTabsRail`, side-tabs.js | détail |
| Split | [split.js](../../js/views/scenarios/detail/split.js) (`scenarioSplitStyle`, `startScenarioSplit`) | détail ; appelle `scenarioDetailMaps.invalidateSize()` |
| Onglet Carte | `scenarioMapBlock` + `initScenarioDetailMaps`, [detail-map.js](../../js/views/scenarios/detail/detail-map.js) | panneau seul |
| Onglet Transports | `scenarioTransportsRecap`, [transports-recap.js](../../js/views/scenarios/detail/transports-recap.js) = `scenarioOfferBlock` + `roadTollCostRow`/`roadFuelCostRow` ([road-rows.js](../../js/views/scenarios/detail/road-rows.js)) | panneau seul |
| Onglet Argent | `scenarioOfferBlock` + `scenarioTransportsBlock` + `scenarioExpensesBlock` + `scenarioTotalBlock` (offer-block 41, transports-block 68, expenses-block 58, total 75 lignes) | panneau **et** [ScenarioSummary.tsx](../../src/domains/scenarios/detail/ScenarioDetailView/ScenarioSummary.tsx) (même concaténation, sous la liste d'étapes) |
| Onglet Valise | `scenarioPackingBlock`, [packing-block.js](../../js/views/scenarios/detail/packing-block.js) (132 lignes, formulaire d'ajout + cases à cocher) | panneau seul |

Constats :
- Les 4 blocs Argent ont deux lecteurs : les porter sert aussi `ScenarioSummary`, qui perd son
  `LegacyMarkup`.
- [LeafletMap.tsx](../../src/platform/web/LeafletMap.tsx) code en dur `id="map"` et
  `createLeafletMap('map')` ; son commentaire prévoit déjà une prop `id` « le jour où la carte du
  détail scénario coexiste ». C'est ce jour-là. `afterMarkers` est le point d'entrée prévu pour le
  tracé (`drawScenarioOnMap`, déjà utilisé ainsi par
  [MapView.tsx](../../src/domains/carte/MapView.tsx)).
- `PackingView` est déjà en React (`PackingView/PackingGroup`) : à vérifier s'il couvre la liste de
  l'onglet Valise avant de porter `scenarioPackingGroup`/`scenarioPackingRow`. Hypothèse, pas
  encore vérifiée.
- Le sheet mobile (`scenario-panel`) est le § 5 de
  [react-migration-panels-plan.md](react-migration-panels-plan.md), qui prévoit de garder les corps
  d'onglet en `LegacyMarkup`. Une fois les corps portés ici, ce § 5 doit monter les mêmes
  composants React.

## Lots

**G1. Coque + table d'onglets + rail + split — ✅ fait.**
[ScenarioSidePanel.tsx](../../src/domains/scenarios/detail/ScenarioDetailView/ScenarioSidePanel.tsx)
(`<aside>` + pied, total = `money.total` déjà calculé par `useScenarioMoney`), un composant par
onglet dans `ScenarioSidePanel/` (`MapTab`, `TransportsTab`, `MoneyTab`, `PackingTab`, corps encore
en `LegacyMarkup`), une seule table
[scenarioSideTabs.tsx](../../src/domains/scenarios/detail/ScenarioDetailView/scenarioSideTabs.tsx)
lue par les boutons du header, le panneau et le
[rail](../../src/domains/scenarios/detail/ScenarioDetailView/ScenarioSideTabsRail.tsx) (la recopie
`SIDE_TABS` de `ScenarioSideTabsButtons` disparaît). Split :
[ScenarioSplitHandle.tsx](../../src/domains/scenarios/detail/ScenarioDetailView/ScenarioSplitHandle.tsx)
+ `scenarioSplitColumns`/`scenarioSplitSizes`/`scenarioRailHidden` ; le glisser invalide la carte via
`invalidateScenarioDetailMaps` (ajoutée dans `detail-map.js`, à retirer en G4).
- `MapTab` redessine la carte à chaque changement du scénario (`useEffect` sur `scenario`). Avant,
  le redessin suivait le HTML du panneau entier : isolé, le HTML de la carte ne change presque
  jamais.
- `ScenarioLegacyMarkup` perd sa prop `initializeMaps` (seul `MapTab` s'en servait) et devient un
  simple alias de `LegacyMarkup` : supprimé, ses 8 appelants lisent `LegacyMarkup`.
- `Button` accepte `ariaLabel` (passthrough additif, pour le rail).
- Legacy supprimé : `side-panel.js`, `split.js` (fichiers + `<script src>`), `scenarioSideTabsRail`
  et `activeSideTab` de `side-tabs.js`. `SCENARIO_SIDE_TABS` legacy reste pour le sheet mobile (G6).
`pnpm react:typecheck` propre.

**G2. Blocs Argent — ✅ fait** (un commit par bloc). `OfferBlock`, `TransportsBlock`,
`ExpensesBlock`, `TotalBlock` (+ dossiers du même nom) à plat dans `ScenarioDetailView/`, montés
par `MoneyTab` **et** `ScenarioSummary`, qui n'ont plus de `LegacyMarkup`. `OfferBlock` sert aussi
`TransportsTab`. Les trois menus déroulants vont dans [src/shared/select/](../../src/shared/select/)
(règle « un menu déroulant vit dans `shared/select/` ») : `ScenarioOfferDropdown`,
`ScenarioTransportDropdown`, `ScenarioExpenseDropdown`. `TotalBlock` lit `useScenarioMoney` pour
tous ses montants.
- **Restent legacy :** les lignes de détail du total (`accommodationDetailRows`,
  `chargeDetailRows`, `transportDetailRows`, `attractionDetailRows`), injectées dans `RecapGroup` —
  elles tirent `roadDetailRows` (G3) et `accommodationDetailRows` est aussi lue par la carte de
  comparaison (`compare/card.js`, hors scope).
- **Pas supprimé, encore lu par le sheet mobile** (`SCENARIO_SIDE_TABS` legacy) :
  `scenarioOfferBlock` et ses satellites (`offer-dropdown.js`, `scenarioOfferOptionsBlock`),
  `scenarioTransportsRecap`, `scenarioTransportsBlock`, `scenarioExpensesBlock`,
  `scenarioTotalBlock`/`recapGroup`. Tout tombe en G6.
- **À vérifier à l'écran — déduit du code, pas observé :** les lignes « 🚗 » entre deux lieux du
  détail Hébergements (`recapLegRow` → `stepLegRecapSlot`) ne sont remplies que par
  `fillStepLegs`, que le détail n'appelle pas (seul `ScenariosView` le fait). Même cause que la
  bande d'itinéraire corrigée au cluster F. À porter avec les lignes de détail.

**G3. Lignes de route + détail du total — ✅ fait.** Lignes de route à plat dans
`ScenarioDetailView/` (`RoadCostRow`, `RoadFuelCostRow`, `RoadTollCostRow` — lues par
`TransportsTab` et le détail du total) ; budget saisi via `EditableTextCell` →
`setScenarioRoadBudget`. Détail du total dans `TotalBlock/` : `AccommodationDetailRows` (+ dossier :
`StayRow`, `PassageRow`, `LegRow`, `RecapIconLabel`, `recapStops`), `ChargeDetailRows`,
`TransportDetailRows`, `AttractionDetailRows`, `RoadDetailRows`, `RoadRow`, `ExtraRecapRow`.
`RecapGroup` prend ses lignes en `children` au lieu d'une chaîne HTML.
- `TotalBlock` lit la route via `useScenarioRoad` + `useScenarioRoute` (le cache de `fetchRoute`
  évite une seconde requête) : les lignes « 🚗 » du détail Hébergements affichent enfin durée,
  essence et péage du tronçon, que rien ne remplissait dans le détail.
- `Scenario` (types.ts) gagne `fuelBudget?`/`tollBudget?`, champs déjà persistés et lus par
  `road.js`.
- Legacy supprimé : `charge-rows.js`, `transport-rows.js`, `attraction-rows.js` (fichiers +
  `<script src>`), les lignes de `road-rows.js` (ne reste que `setScenarioRoadBudget`),
  `recapSubRow`/`extraRecapRow`/`extraDateLabel` de `recap-row.js`. **Restent** pour la carte de
  comparaison (`compare/card.js`, hors scope) : `accommodationDetailRows` et sa chaîne
  (`recapRow`, `scenarioRecapRow`, `recapPlaceLabel`, `recapIconLabel`, `recapLegRow`).
`pnpm react:typecheck` propre.

**G4. Onglet Carte — effort high.** `LeafletMap` gagne une prop `id` ; l'onglet monte un
`LeafletMap` avec les attractions en marqueurs et le tracé via `afterMarkers`. Retire
`initializeMaps` de `ScenarioLegacyMarkup` et `detail-map.js`. Le split invalide la taille via une
ref à la carte au lieu de `window.scenarioDetailMaps`.

**G5. Onglet Valise — effort medium.** Vérifier d'abord la réutilisation de `PackingView/` ; sinon
porter `scenarioPackingBlock` et son formulaire.

**G6. Sheet mobile — ✅ fait.**
[ScenarioPanelModal.tsx](../../src/domains/scenarios/detail/panel-modal/ScenarioPanelModal.tsx),
branché dans `MODAL_BODIES` : titre + corps React de l'onglet (même `SCENARIO_SIDE_TABS` que le
panneau) + Fermer. `MODAL_TYPES['scenario-panel']` passe le `scenarioId` dans le `payload`.
- `MapTab` donne un id unique à son canevas (`useId`) : panneau et sheet peuvent tous deux en
  porter un, et `createLeafletMap` les cherche par id. `initScenarioDetailMaps` (re)crée encore
  toutes les cartes à la fois et `destroyScenarioDetailMaps` les détruit toutes : fermer le sheet
  détruit aussi celle du panneau — masqué sous 640px, donc sans effet visible. G4 remplace ce
  mécanisme.
- Legacy supprimé : `SCENARIO_SIDE_TABS`/`scenarioPanelSheet` (`side-tabs.js` ne garde que
  `onScenarioPanelToggle`/`toggleScenarioSidePanel`), `transports-recap.js`, `offer-dropdown.js`,
  `transports-dropdown.js`, `expenses-dropdown.js` (fichiers + `<script src>`), les blocs et lignes
  legacy d'`offer-block.js`/`offer-options.js`/`transports-block.js`/`expenses-block.js`/`total.js`
  (ne restent que les actions : `setScenarioOffer`, `toggleScenarioOfferOption`,
  `attach`/`detachScenario*`, `transportLegLabel`, `setRecapFold`), et `offerSheetButton`
  (`rentals/sheet.js`), sans plus aucun appelant.
`pnpm react:typecheck` propre.

## Tranché

- **Rail vertical** : on le garde, porté tel quel en G1.
- **Sheet mobile** : G6 absorbe le § 5 de react-migration-panels-plan.md.
