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

**G2. Blocs Argent — effort high.** Offre, transports, dépenses, total en composants React, montés
par l'onglet Argent **et** par `ScenarioSummary`. Chaque montant se compare d'abord à
`useScenarioMoney`/`useScenarioRoad` avant d'être recalculé. Découpable en 4 sous-lots (un par
bloc) si un bloc s'avère lourd.

**G3. Onglet Transports — effort medium.** Bloc offre (issu de G2) + lignes péage/essence
(`road-rows.js`, vérifier `useScenarioRoad`).

**G4. Onglet Carte — effort high.** `LeafletMap` gagne une prop `id` ; l'onglet monte un
`LeafletMap` avec les attractions en marqueurs et le tracé via `afterMarkers`. Retire
`initializeMaps` de `ScenarioLegacyMarkup` et `detail-map.js`. Le split invalide la taille via une
ref à la carte au lieu de `window.scenarioDetailMaps`.

**G5. Onglet Valise — effort medium.** Vérifier d'abord la réutilisation de `PackingView/` ; sinon
porter `scenarioPackingBlock` et son formulaire.

**G6. Sheet mobile — effort medium.** Absorbe le § 5 de react-migration-panels-plan.md : le sheet
monte les corps React des onglets. `SCENARIO_SIDE_TABS`, `scenarioPanelSheet`, `side-panel.js`,
`side-tabs.js` deviennent morts.

## Tranché

- **Rail vertical** : on le garde, porté tel quel en G1.
- **Sheet mobile** : G6 absorbe le § 5 de react-migration-panels-plan.md.
