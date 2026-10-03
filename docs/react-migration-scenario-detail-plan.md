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
- Une fonction legacy devenue morte après un port se vérifie (call-sites) avant suppression, et se
  remplace par un commentaire d'une ligne pointant vers le nouveau composant.
- `step-card.js` mélange des fonctions à porter (`stepOrderBadge`, `stepStatusBadge`,
  `stepPlaceSuffix`, `stepDetailLine`, `stepMoney`) et d'autres qui servent peut-être encore ailleurs
  (`stepOutReason`, `stepCardPaint`, `makeGroupButton`, l'ancien `stepCard` lui-même) — vérifier
  casse par casse, ne pas supposer tout le fichier mort une fois les 5 premières portées.

## Backlog ordonné

**A. Badges de carte d'étape** — [step-card.js](../js/views/scenarios/detail/step-card.js) (163
lignes, 5 des 9 fonctions concernées). **Premier cluster, puis stop.**
- `stepOrderBadge(scenario, step, rank)` — la pastille de rang (lettre/numéro).
- `stepStatusBadge(scenario, step)` — pastille de statut.
- `stepPlaceSuffix(step)` — complément de nom de lieu.
- `stepDetailLine(step)` — ligne de détail sous le titre.
Fragments d'affichage, pas de state ni d'async repéré à la lecture — bon premier cluster, risque
faible. Tous les 4 consommés uniquement par
[StepCard.tsx](../src/domains/scenarios/detail/ScenarioDetailView/StepCard.tsx).

**B. Argent d'une étape** — `stepMoney(scenario, step)` dans le même fichier, plus `stepLine`
([step-line.js](../js/views/scenarios/detail/step-line.js), 55 lignes, ligne hébergement de
l'étape). Vérifier d'abord ce que `useScenarioMoney` expose déjà pour l'étape avant de retraduire
`stepAccommodationCost`/`hasStepBudget`/`formatAccommodationCost` en JSX.

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
  (docs/react-migration-plan.md § 5) — ne pas les toucher ici.
