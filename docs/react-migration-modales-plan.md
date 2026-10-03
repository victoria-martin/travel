# Phase modales — plan d'exécution pour un agent

Porter les types de `MODAL_TYPES` ([js/modals/modal.js](../js/modals/modal.js)) restants en
composants React, un par un, en suivant exactement le patron déjà établi sur `actual-expense`,
`import-expenses`, `charge`, `phrase`, `valise-catalogue`, `attraction` (voir
[react-migration-plan.md](react-migration-plan.md) § 4 pour l'historique).

**Effort recommandé : medium.** Le travail est répétitif (même recette à chaque type), mais chaque
modale demande de vérifier précisément les ids de champs contre son `save.js` avant de brancher —
une erreur d'id silencieuse casse l'enregistrement sans erreur visible. Low risque de sauter cette
vérification.

## Règle d'arrêt — à respecter strictement

**Ne faire QUE le premier type de la liste ci-dessous, puis s'arrêter et attendre un go explicite**
avant de passer au suivant. Ne pas enchaîner plusieurs types dans la même session sans validation.

## Règles dures (projet)

- **Jamais de Playwright/navigateur** sur ce projet, même pour diagnostiquer. Si une vérif visuelle
  est nécessaire, le dire et laisser l'utilisatrice regarder à l'écran.
- `pnpm react:typecheck` et `pnpm react:build` doivent passer propres après chaque type porté.
- Ne jamais réimplémenter la logique de sauvegarde : le bouton `#f-save` délègue toujours à la
  fonction legacy existante (`window.save<Entité>(id)`), inchangée.
- `#f-save` est un id obligatoire sur le bouton d'enregistrement (`submitModal()`/Entrée le clique
  programmatiquement, `js/modals/modal.js`).
- Avant de supprimer la fonction string-builder legacy (`xxxForm()`) d'un formulaire porté, grepper
  ses call-sites : si elle n'a plus d'appelant que l'entrée `MODAL_TYPES`, la retirer et la
  remplacer par un commentaire d'une ligne pointant vers le nouveau fichier React (voir le patron
  dans [js/views/fixed-costs/modal/form.js](../js/views/fixed-costs/modal/form.js)).
- Toute const/let legacy lue depuis React a besoin d'un `window.X = X;` explicite (les déclarations
  de fonction sont déjà sur `window` automatiquement, pas les const/let).
- Chaque nouveau membre `window.*` lu ou exposé va dans
  [src/types/global.d.ts](../src/types/global.d.ts).

## La recette, étape par étape (pour CHAQUE type)

1. Lire le `body` actuel dans `MODAL_TYPES` (`js/modals/modal.js`) et le fichier `modal/form.js` du
   domaine pour lister tous les champs.
2. Lire le `save.js` du même domaine pour confirmer les ids exacts lus (`document.getElementById`)
   et les champs qui ne passent pas par un `<input>` (ex. `modal.payload.xxx` écrit directement).
3. Écrire `domains/<domaine>/modal/<Entité>Modal.tsx`, composé avec les briques partagées
   existantes (voir inventaire ci-dessous) — ne pas réécrire de balisage `.field` en clair.
4. Ajouter les déclarations manquantes à `global.d.ts`.
5. Brancher dans `src/modal-bodies.ts` (`MODAL_BODIES`).
6. Dans `js/modals/modal.js` : retirer `body:` de l'entrée `MODAL_TYPES[type]`, ajouter le
   commentaire `// body : React (src/domains/.../XxxModal.tsx, src/modal-bodies.ts).`
7. Supprimer la fonction `xxxForm()` devenue morte (après vérif call-sites), un commentaire à la
   place.
8. `pnpm react:typecheck` puis `pnpm react:build` — doivent être propres.
9. Rapporter avec un marqueur **[À tester]**, lien vers le fichier React créé, et la liste des
   champs/comportements à vérifier à l'écran (dirty-check, Annuler, Entrée).

## Briques partagées existantes (ne pas en recréer une variante)

Chemins actuels (post-réorg, alias `@/` = `src/`) :

- `@/shared/form-fields/TextField` — texte/date, prop `listOptions` pour un datalist.
- `@/shared/form-fields/TextareaField`
- `@/shared/form-fields/SelectField` — `<select>` natif, `options: {value,label}[]`, `placeholder`.
- `@/shared/form-fields/TagsField` — **contrôlé** (`tags`/`onChange`), pour une liste de tags
  éditable en ligne. Pattern : `useState` local + muter `payload.<champ>` en parallèle à chaque
  changement (la fonction de sauvegarde déléguée lit `modal.payload` directement).
- `@/shared/form-fields/SwitchField`
- `@/shared/WordSelectField` — select type/statut avec "＋ Ajouter…" (vocabulaires gérés par
  `js/word-select.js` : `ACCOMMODATION_TYPES`, `ACCOMMODATION_STATUSES`, `ATTRACTION_TYPES`,
  `ATTRACTION_STATUSES`…). **Piège** : dans le composant, poser
  `window.wordSelectValues['<id>'] = payload.<champ> || '';` pour chaque select de ce type, sinon
  annuler un "＋ Ajouter" remet le champ à vide au lieu de l'ancienne valeur.
- `@/shared/layout/FieldRow` — deux champs côte à côte (`.field-row`).
- `@/shared/modal/ModalTitle` — `<h3>{Ajouter|Modifier} {subject}</h3>`.
- `@/shared/modal/ModalSaveButton` — bouton `#f-save`.
- `@/shared/modal/CloseModalButton` — bouton Annuler, appelle `dismissModal()` (jamais
  `closeModal()` — `closeModal()` fermerait en silence une saisie non enregistrée).
- `@/shared/LegacyMarkup` — échappatoire pour un sous-bloc complexe qu'on ne réimplémente pas tout
  de suite (`<div dangerouslySetInnerHTML>`), ex. `locateFields(payload)` (recherche d'adresse/
  géocodage) ou `attractionScenarioActions()` (ajout à un scénario). Légitime pour un sous-système
  stateful qui vit déjà très bien en legacy — ne pas forcer un port si la valeur ajoutée est faible.
- `@/shared/Icon` — icône Lucide (`svgIcon` en SVG), pas de `dangerouslySetInnerHTML` à la main.

**Si un champ ne correspond à aucune brique existante** (ex. un nouveau type de picker), en créer
une dans `@/shared/form-fields/` (ou `@/shared/layout/` si c'est un agencement) plutôt que d'écrire
du balisage en clair dans le formulaire — même règle que pour les premières modales : un champ
généralisé dès qu'un deuxième type va forcément le redemander, pas après.

## Backlog ordonné

Fait, ne pas retoucher : `actual-expense`, `import-expenses`, `charge`, `phrase`
(`AddTranslationModal`), `valise-catalogue`, `attraction`, `voiture`
([OfferModal.tsx](../src/domains/rentals/modal/OfferModal.tsx)) — select loueur, select modèle et
options du loueur restés en `LegacyMarkup` (repeints depuis l'extérieur de React au changement de
loueur, mécanisme stateful déjà en place), statut en `SelectField` ordinaire (`CAR_STATUSES` n'a
pas de "＋ Ajouter", pas un `WordSelectField`), `prestataire`
([ProviderModal.tsx](../src/domains/transports/modal/ProviderModal.tsx)) — même mécanisme
`LegacyMarkup` pour options/modèles proposés, `SelectField` gagne un `onChange` optionnel pour
`repaintProviderModels()`, `modele`
([CarModelModal.tsx](../src/domains/car-models/modal/CarModelModal.tsx)) — fuel/boîte en
`SelectField` ordinaire (dicts simples, pas de `WordSelectField`), « Proposé par » en `LegacyMarkup`
comme les autres listes repeintes depuis l'extérieur de React, `TextField` gagne un `onInput`
optionnel pour rebrancher `suggestCarConsumption()` sans la réimplémenter. `ville`
([VilleModal.tsx](../src/domains/villes/modal/VilleModal.tsx)) — pas de `LegacyMarkup` : sa
recherche d'adresse (`locateVille`/`applyVilleMatch`) est assez courte pour rester en JSX direct,
contrairement à `locateFields` (attraction/hébergement), plus massif. `transport`
([TransportModal.tsx](../src/domains/transports/modal/TransportModal.tsx)) — mode/statut en
`SelectField` ordinaire ; départ/arrivée et le bloc prestataire restent en `LegacyMarkup`. La note
« le mode décide des champs affichés (voiture vs compagnie) » était obsolète : le mode `car` a
disparu de `TRANSPORT_MODES` le 2026-09-19, il ne reste qu'un select de prestataire filtré par mode
à repeindre, pas de bloc exclusif à basculer — pas de `useState` nécessaire. `accommodation` + 4
variantes ([AccommodationModal.tsx](../src/domains/accommodations/modal/AccommodationModal.tsx),
[BookingAccommodationModal.tsx](../src/domains/accommodations/modal/BookingAccommodationModal.tsx),
[HomeExchangeAccommodationModal.tsx](../src/domains/accommodations/modal/HomeExchangeAccommodationModal.tsx),
[AirbnbAccommodationModal.tsx](../src/domains/accommodations/modal/AirbnbAccommodationModal.tsx),
[GoogleMapsAccommodationModal.tsx](../src/domains/accommodations/modal/GoogleMapsAccommodationModal.tsx))
— 5 composants séparés, pas un seul paramétré : champs présents/absents, titre et ordre diffèrent
trop d'une porte à l'autre pour une config commune (règle projet « pas de moteur piloté par
config »). Type/statut en `WordSelectField` (mécanisme déjà existant, comme `AttractionModal`).
`locateFields` et la bannière hors-disponibilité en `LegacyMarkup`. `TextField` gagne
`placeholder`/`title`/`hint`/`onBlur`/`onPaste`/`onChange` optionnels (import de lien Booking/
HomeExchange/Airbnb/Google Maps, calcul de prix `=625/4`). Les 4 formulaires de porte et
`type-select.js`/`status-select.js`/`views/tags-field.js` (devenus entièrement morts) sont
supprimés avec leur `<script src>`, pas juste vidés.

Trois autres `const` legacy jamais exposées sur `window` corrigées au passage, même bug que
`UNSET_CAR_STATUS`/`UNSET_TRANSPORT_STATUS` : `UNSET_ACCOMMODATION_TYPE`,
`UNSET_ACCOMMODATION_STATUS`.

`step` ([StepModal.tsx](../src/domains/scenarios/detail/step-modal/StepModal.tsx)) — en fait
simple : la modale elle-même n'a que 4 champs plats, `radio-card-field` ne la concerne pas (il sert
trail-options/weather, note du plan obsolète). Seul `stepAttractionsField`
(attractions-field.js, 164 lignes — recherche + navigation clavier + création à la volée, état
module `activeAttractionResult`) reste en `LegacyMarkup`, sous-système stateful qui vit bien en
legacy. `paste-import`
([PasteImportModal.tsx](../src/domains/accommodations/modal/PasteImportModal.tsx)) — pas de
payload réel (`open` renvoie `{ text: '' }`, jamais lu) ; `pasteImportForm` éclaté en
`pasteImportInstructions()` (extrait, instructions/textarea/aperçu, resté en `LegacyMarkup` — texte
dérivé de constantes legacy, aucune valeur à le recomposer en JSX) + h3/modal-actions en JSX.
`runPasteImport` fait tout elle-même (pas un simple save délégué) mais `#f-save` garde son rôle.
`voyage` ([TravelModal.tsx](../src/domains/travels/modal/TravelModal.tsx)) — `cfg.after` (
`paintTravelModal`) reste tel quel dans `MODAL_TYPES.voyage` : ModalHost rappelle déjà `cfg.after`
après toute peinture, React comprise, pas de `useEffect` nécessaire. Emoji picker, sous-titre
dérivé et nuancier d'accent restent en `LegacyMarkup` (sous-systèmes stateful qui ne touchent jamais
`modal.payload`, lus par `saveTravel` par id) ; `travelCountriesField` pareil mais mute
`modal.payload.countries` comme `tagsField`.

**Bug trouvé et corrigé en route** : `readTravelForm` (save.js) lisait `#travel-fuel-price`/
`#travel-toll-rate` sans condition, mais le formulaire ne les rendait plus depuis `2c02b9d`
(19/09) — Enregistrer plantait sur ces deux champs absents, aucun voyage ne s'enregistrait depuis
cette modale. Restaurés dans `TravelModal.tsx` (prix du litre / péage au km, préremplis par
`payload.fuelPrice`/`tollRate`, placeholder = défaut).

## Backlog épuisé

Tous les types de `MODAL_TYPES` listés ci-dessus sont portés. Restent volontairement hors scope
(pas des formulaires d'entité) : `valise-composer`, `scenario-panel`, `journal-panel`
(panneaux/sheets), `sync`, `settings` (modales utilitaires) — à traiter à part si besoin.

## Non résolu, ne pas investiguer dans cette phase

Un bug de dismiss a été signalé sur la modale `attraction` (clic sur Annuler/fond qui ne répond
pas) — pas encore diagnostiqué, pas dans le scope de cet agent. Ne pas y toucher ni le re-tester
sauf si la même famille de bug apparaît sur un nouveau type porté, auquel cas le signaler tel quel
sans tenter de le corriger seul.
