# Phase panneaux — plan d'exécution pour un agent

Porter les 5 derniers types de `MODAL_TYPES` ([js/modals/modal.js](../js/modals/modal.js)) laissés
hors scope par [react-migration-modales-plan.md](../archivé/react-migration-modales-plan.md) : `settings`,
`valise-composer`, `sync`, `journal-panel`, `scenario-panel`. Même recette, même patron de briques
partagées — voir ce fichier pour l'historique complet (`attraction`, `voiture`, `transport`,
`accommodation`+4 variantes, `step`, `paste-import`, `voyage`…).

Ce ne sont pas des formulaires d'entité : aucun n'a `edits: true` dans `MODAL_TYPES` (pas de
dirty-check), et `sync`/`settings` n'ont même pas de `payload`. Deux d'entre eux
(`scenario-panel`, `journal-panel`) sont le repli mobile d'un panneau déjà affiché sur desktop
(`.scenario-detail-side`, `prefs.journalSidePanel`) plutôt qu'un vrai formulaire — leur contenu
(carte, argent, transports) reste lourdement legacy (Leaflet, blocs calculés en chaîne de
fonctions) et n'est pas dans le scope de ce plan : seul le **wrapper modal** (titre + bouton Fermer
+ dispatch vers l'onglet) se porte, pas `scenarioMapBlock`/`scenarioOfferBlock`/etc.

## Règle d'arrêt — à respecter strictement

**Ne faire QUE le premier type de la liste ci-dessous, puis s'arrêter et attendre un go explicite**
avant de passer au suivant. Ne pas enchaîner plusieurs types dans la même session sans validation —
sauf si l'utilisatrice dit explicitement d'en faire plusieurs d'un coup.

## Règles dures (projet)

- **Jamais de Playwright/navigateur** sur ce projet, même pour diagnostiquer. Si une vérif visuelle
  est nécessaire, le dire et laisser l'utilisatrice regarder à l'écran.
- `pnpm react:typecheck` et `pnpm react:build` doivent passer propres après chaque type porté.
- Ne jamais réimplémenter une logique legacy : un bouton délègue toujours à la fonction/globale
  existante, inchangée.
- Toute const/let legacy lue depuis React a besoin d'un `window.X = X;` explicite (les déclarations
  de fonction sont déjà sur `window` automatiquement, pas les const/let) — **vérifier avant de
  porter**, plusieurs bugs de ce type ont déjà été trouvés et corrigés pendant la phase modales
  (`UNSET_CAR_STATUS`, `UNSET_TRANSPORT_STATUS`, `UNSET_ACCOMMODATION_TYPE/STATUS`).
- Chaque nouveau membre `window.*` lu ou exposé va dans
  [src/types/global.d.ts](../src/types/global.d.ts).
- `#f-save` n'est obligatoire que sur un vrai formulaire ; aucun de ces 5 types n'en a besoin
  (pas de bouton Enregistrer dans leur markup actuel) — garder le bouton de fermeture/validation
  existant tel quel (`Fermer`, `Terminé`, `Connecter`…).

## La recette, étape par étape (pour CHAQUE type)

1. Lire le `body` actuel dans `MODAL_TYPES` et le(s) fichier(s) legacy qui le construisent, lister
   tous les éléments interactifs et leurs ids.
2. Repérer ce qui mute un état global en dehors de `modal.payload`/du store React (ex. `sync`,
   `prefs`, `state` directement) : ça reste candidat `LegacyMarkup`, pas à recâbler.
3. Écrire `domains/<domaine>/modal/<Nom>Modal.tsx` (ou `shell/<Nom>Modal.tsx` pour `sync`/
   `settings`, qui ne sont pas des entités de domaine), composé avec les briques partagées
   existantes — ne pas réécrire de balisage `.field`/`.modal-actions` en clair.
4. Ajouter les déclarations manquantes à `global.d.ts`.
5. Brancher dans `src/modal-bodies.ts` (`MODAL_BODIES`).
6. Dans `js/modals/modal.js` : retirer `body:` de l'entrée `MODAL_TYPES[type]`, ajouter le
   commentaire `// body : React (src/.../XxxModal.tsx, src/modal-bodies.ts).`
7. Supprimer la fonction legacy devenue morte (après vérif call-sites — grep, pas une impression),
   un commentaire à la place ; si un fichier entier devient mort, le supprimer avec son
   `<script src>` plutôt que le vider (précédent : `type-select.js`/`status-select.js`/
   `tags-field.js` pendant la phase modales).
8. `pnpm react:typecheck` puis `pnpm react:build` — doivent être propres.
9. Rapporter avec un marqueur **[À tester]**, lien vers le fichier React créé, et la liste des
   comportements à vérifier à l'écran.

## Briques partagées existantes (ne pas en recréer une variante)

Même inventaire que [react-migration-modales-plan.md § Briques partagées](../archivé/react-migration-modales-plan.md#briques-partagées-existantes-ne-pas-en-recréer-une-variante) —
`TextField`, `TextareaField`, `SelectField`, `TagsField`, `SwitchField`, `WordSelectField`,
`FieldRow`, `ModalTitle`, `ModalSaveButton`, `CloseModalButton`, `LegacyMarkup`, `Icon`. Pour ces 5
types, deux absents de l'inventaire vont probablement servir :

- Un simple **bouton "Fermer"** (`<button class="btn" onClick={() => window.closeModal()}>`) —
  aucune brique dédiée aujourd'hui (`CloseModalButton` appelle `dismissModal()`, pas `closeModal()`,
  et porte toujours le texte "Annuler" : pas le même bouton). Si deux de ces 5 types l'utilisent à
  l'identique, en faire une brique `@/shared/modal/ModalCloseButton` plutôt que le dupliquer — sinon
  l'écrire en clair.
- Pas de `ModalSaveButton`/`#f-save` : aucun de ces 5 types n'en a besoin (cf. règles dures).

## Backlog ordonné

**1. `settings`** — [js/views/settings/modal.js](../js/views/settings/modal.js) (11 lignes) +
   [blocks.js](../js/views/settings/blocks.js) (12 lignes) +
   [page-settings.js](../js/views/settings/page-settings.js) (17 lignes). **Prochain type à faire,
   puis stop.** Le plus simple des 5 : `settingsForm()` est juste `<h3>` + `${settingsBlocks()}` +
   un bouton Fermer. `settingsBlocks()` est aussi appelée par le menu ⋮ d'une liste (pas seulement
   cette modale) — garder tout son contenu en `LegacyMarkup`, aucune valeur à le recomposer en JSX
   pour un deuxième appelant qui ne change rien. `pageSettingsBlock()` lit la globale `view` (pas
   `window.view`) — vérifier si `getCurrentView()` (déjà dans `global.d.ts`) donne la même valeur
   avant de supposer qu'on peut s'en passer. Fichier cible : `src/shell/SettingsModal.tsx` (pas un
   domaine d'entité).

2. **`valise-composer`** — [js/views/packing/compose.js](../js/views/packing/compose.js)
   (102 lignes). Recherche + checklist par catégories dépliables (`<details>`), même patron que les
   listes à cocher déjà rencontrées (`offerOptionsField`, `carModelProvidersField`) : garder la
   liste (`packingComposeList`/recherche) en `LegacyMarkup`, sous-système stateful qui repeint sa
   propre zone (`#packing-compose-list`) à chaque frappe/coche. Le header (titre + nom du voyage) et
   le pied (compteur ajoutés/total + bouton Terminé) sont de simples lectures dérivables
   (`currentTravel()`, `travelPackingItems()`, `state.packingItems.length` — ce dernier pas encore
   sur `window`, à exposer) : les écrire en JSX plutôt que les inclure dans le `LegacyMarkup`.
   Fichier cible : `src/domains/packing/modal/PackingComposerModal.tsx` (le domaine `packing/`
   existe déjà, `PackingItemModal.tsx` y est).

3. **`sync`** — [js/sync.js](../js/sync.js) (426 lignes au total, mais `syncForm`/`saveSyncUrl`/
   `resolveSyncChoice` seulement concernés, ~40 lignes). `sync` est une globale mutable **hors**
   store React (pas dans Zustand, pas dans `state`) : à vérifier avant de coder, mais a priori sans
   risque de réactivité nouveau — `setSyncStatus` ne repeint déjà pas le corps de cette modale en
   légacy tant qu'elle est ouverte (`render()` est explicitement sauté `if (!modal)`, précisément
   pour ne pas écraser une saisie en cours), donc lire `window.sync.status`/`.message` une fois au
   montage reproduit le même comportement, pas une régression. Le champ URL
   (`TextField`), le message d'état (lecture simple), le bloc conditionnel "Prendre le Sheet /
   Envoyer mes données locales" (affiché seulement si `sync.status === 'choice' &&
   sync.pendingRemote` — un simple `{condition && (...)}` JSX) et les 3 boutons d'action
   (Déconnecter conditionnel, Fermer, Connecter) se portent directement, sans `LegacyMarkup`.
   Fichier cible : `src/shell/SyncModal.tsx`.

4. **`journal-panel`** — [js/views/journal/side-tabs.js](../js/views/journal/side-tabs.js)
   (41 lignes, dont `journalPanelSheet` ~7 lignes). Un seul onglet (`Carte`,
   `journalMapBlock(date)`) : le wrapper (`<h3>{label}</h3>` + bouton Fermer) se porte en JSX,
   `journalMapBlock(date)` reste en `LegacyMarkup` (init Leaflet, hors scope — cf. note RN § 5 de
   [react-migration-plan.md](react-migration-plan.md), Leaflet est déjà derrière sa propre
   frontière `platform/`). Fichier cible :
   `src/domains/journal/modal/JournalPanelModal.tsx`.

5. **`scenario-panel`** — **déplacé** dans le lot G6 de
   [react-migration-scenario-side-panel-plan.md](react-migration-scenario-side-panel-plan.md) : les
   corps d'onglet y passent en React, le sheet monte ces composants. Description d'origine : [js/views/scenarios/detail/side-tabs.js](../js/views/scenarios/detail/side-tabs.js)
   (98 lignes, dont `scenarioPanelSheet` ~8 lignes). Même wrapper que `journal-panel`, mais 4 onglets
   (Carte, Transports, Argent, Valise) et `tab.body` concatène parfois plusieurs blocs de calcul
   (`scenarioOfferBlock(s) + scenarioTransportsBlock(s) + scenarioExpensesBlock(s) + …`) — tout ça
   reste en `LegacyMarkup`, seul le dispatch (`SCENARIO_SIDE_TABS.find(...)`) et le wrapper
   changent de main. Dernier de la liste : les 4 autres sont plus simples et serviront de repère si
   le dispatch par `key` pose une question de design (garder un `switch`/`find` en JS plutôt qu'une
   table d'objets React, puisque `SCENARIO_SIDE_TABS`/`JOURNAL_SIDE_TABS` existent déjà et sont
   partagées avec les boutons d'onglet du panneau desktop — ne pas les dupliquer en React).
   Fichier cible : `src/domains/scenarios/detail/panel-modal/ScenarioPanelModal.tsx`.

## Non résolu, ne pas investiguer dans cette phase

Le bug de dismiss sur `attraction` signalé dans la phase modales a été corrigé entre-temps
(`OverlayHost`/`Confirm.tsx`, commit `fe085d6`) — plus un sujet pour cette phase.
