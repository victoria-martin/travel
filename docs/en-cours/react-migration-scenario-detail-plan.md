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
- `stepLine` ([step-line.js](../js/views/scenarios/detail/step-line.js), 55 lignes) — **pas fait,
  sous-estimé au départ.** Ce n'est pas un simple affichage : elle délègue à
  [step-type-dropdown.js](../js/views/scenarios/detail/step-type-dropdown.js) (43 l.),
  [step-place-dropdown.js](../js/views/scenarios/detail/step-place-dropdown.js) (223 l., le plus
  gros — recherche + sélection d'hébergement/lieu),
  [step-nights-dropdown.js](../js/views/scenarios/detail/step-nights-dropdown.js) (24 l.),
  plus `attraction-picker.js`/`cost-picker.js` (27+30 l.) en dépendance — ~450 lignes de widgets
  interactifs au total, pas « medium ». À resegmenter en sous-clusters avant de porter (probablement
  un par dropdown), pas enchaîné d'un bloc.

**C. Extras** (lignes de coût éditables sous une étape/un groupe) —
[extras/](../js/views/scenarios/detail/extras/) (9 fichiers : `add`, `amount`, `count`,
`get-extras`, `label`, `line-menu`, `list`, `row`, `total`, `write`). Une vraie sous-fonctionnalité
CRUD (ajouter/éditer/retirer une ligne), pas un simple affichage — consommé par
[StepCard.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepCard.tsx) et
[StepGroupView.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepGroupView.tsx) (même
`extrasBlock`, deux porteurs différents — étape ou groupe). À traiter comme son propre chantier,
pas enchaîné après B sans repause.

**D. Chrome de l'en-tête** —
[weather.js](../js/views/scenarios/detail/weather.js) (`scenarioWeatherToggleButton`, le bouton),
[side-tabs.js](../js/views/scenarios/detail/side-tabs.js) (`scenarioSideTabsButtons`, les 3
boutons Carte/Argent/Valise), [menu.js](../js/views/toolbar/menu.js) (`toolbarMenu`, le ⋮ —
vérifier s'il existe déjà un équivalent React, `SettingsMenu`/`ToolbarPanel` dans
[shared/toolbar/](../src/shared/toolbar/), avant de le reporter). Les trois sont assemblés en une
seule chaîne concatenée dans
[ScenarioDetailHeader.tsx](../src/domains/scenarios/detail/ScenarioDetailView/ScenarioDetailHeader.tsx) —
à séparer en 3 composants assemblés en JSX plutôt qu'une concaténation de chaînes.

**E. Bannière météo** — [weather.js](../js/views/scenarios/detail/weather.js) (240 lignes, le plus
gros fichier de tout le détail scénario) : `scenarioWeatherBanner(scenario)`. Probablement un appel
API externe (prévisions météo) + cache — à lire en entier avant d'estimer, ne pas sous-évaluer sur
la seule taille du fichier.

**F. Itinéraire** — [route-trail.js](../js/views/scenarios/detail/route-trail.js) (48 lignes) et
[route-strip.js](../js/views/scenarios/detail/route-strip.js) (34 lignes), `scenarioRouteTrail`/
`scenarioRouteStrip`. Même famille que `scenarioRouteBar`/`scenarioCompareCard` déjà laissés
délégués ailleurs dans la migration (ScenariosView, liste) — vérifier si un composant partagé a du
sens entre les deux avant d'en écrire un par écran.

**G. Panneau latéral (carte/transports/argent/valise) + split handle** —
[side-panel.js](../js/views/scenarios/detail/side-panel.js) (14 lignes, dispatcher) +
[side-tabs.js](../js/views/scenarios/detail/side-tabs.js) (98 lignes, `SCENARIO_SIDE_TABS`,
4 onglets) + [split.js](../js/views/scenarios/detail/split.js) (53 lignes). Le plus gros chantier :
l'onglet Carte réutilise Leaflet (`initScenarioDetailMaps()`, rappelé par `ScenarioLegacyMarkup` via
sa prop `initializeMaps` — regarder comment [platform/web/LeafletMap.tsx](../src/platform/web/LeafletMap.tsx)
a déjà résolu ce problème pour la Carte générale avant d'improviser une seconde solution), l'onglet
Argent concatène 4 blocs de calcul (`scenarioOfferBlock`/`scenarioTransportsBlock`/
`scenarioExpensesBlock`/`scenarioTotalBlock`, encore des candidats à vérifier contre
`useScenarioMoney`), l'onglet Valise délègue à `scenarioPackingBlock()`. À découper en sous-plan à
part plutôt qu'un seul composant — probablement le dernier cluster de cette liste, pas avant que
A-F soient faits et validés.

## Hors scope ici

- La carte de comparaison (`scenarioCompareCard`) et la bande d'itinéraire de la liste
  (`scenarioRouteBar`) sont un écran différent (`ScenariosView`, pas `ScenarioDetailView`) — pas
  dans ce plan.
- `RouteBuilderPanel`/`NewCityButton` (Carte générale) restent délégués par décision déjà actée
  (react-migration-plan.md § 5) — ne pas les toucher ici.
