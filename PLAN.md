# À faire

Le backlog, rangé par page. Un item terminé **sort d'ici** et va décrire l'app dans
[docs/spec-voyage-toscane.md](docs/spec-voyage-toscane.md) : ce fichier n'archive pas ce qui est
fait, git s'en charge. Les arbitrages de fond sont dans « Décisions actées » de la spec.

Chaque tâche s'écrit `- **Titre** <!--t:id--> — 🚧 en cours : …`. Le marqueur est l'identifiant
stable que le board (`pnpm plan`) relie à sa session Claude : le titre peut changer sans casser le
lien. Ne pas le retirer ni le recopier d'une tâche à l'autre. Les puces de « Données à saisir » n'en
portent pas — c'est du contenu à saisir, pas du travail à lancer.

Les statuts sont une liste figée, par ordre de priorité — ⏳ à faire, 💡 idée, 🚧 en cours,
⏸️ en attente, 🌙 plus tard, ✅ fait, 🚫 abandonné, 📓 à planifier, 🔍 à étudier. Elle vit dans
[statuses.js](tools/plan-board/statuses.js) : en ajouter un se fait là, pas à la main ici. Chacun
porte une couleur de pastille ([pill-variants.js](tools/plan-board/pill-variants.js)), partagée avec
les types.

## 🗓️ Scénarios

- **Deux dates par étape** <!--t:h4x6--> — 🗃️ modèle · 🐛 fix · 🔍 à étudier : les dates se
  calculent depuis le départ du scénario ([step-dates.js](js/views/scenarios/step-dates.js)), mais
  le champ libre « arrivée le » (`arrivalDate`) reste dans la modale et s'affiche à côté
  ([step-card.js:73](js/views/scenarios/detail/step-card.js#L73)). Le retirer ou lui donner un rôle.
- **Bouton « + Ajouter une voiture »** <!--t:tzp2--> — 🧩 ui · 🔍 à étudier : ouvre la modale
  Voitures et rattache la nouvelle voiture au scénario.

  existe déjà avec le picker attendons deja le rework

- **Ouvrir le scénario TEST après le premier pull** <!--t:k3vq--> — 🐛 fix · ⏳ à faire :
  `selectTestScenario()` ([scenarios.js](js/views/scenarios/scenarios.js)) est appelé au chargement
  du cache local ([storage.js](js/storage.js#L36)) ; sur un navigateur vierge, les scénarios
  n'arrivent qu'au premier pull du Sheet et on reste sur la liste. En faire un one-shot consommé à
  la première arrivée de données, sans déranger la vue courante lors des pulls suivants.
- **Variables du scénario ou générales ?** <!--t:p11j--> — 🗃️ modèle · 💡 idée : on commence a
  répondre à ca dans la trasfo de charges fixes en depense normameent

### Plus tard

- **Distance entre deux étapes** <!--t:mc15--> — 🧮 calcul · 🔌 intégration · 🌙 plus tard
- **Estimation de l'essence** <!--t:q7aw--> — 🧮 calcul · 🌙 plus tard
- **Estimation des péages** <!--t:dlde--> — 🧮 calcul · 🌙 plus tard

### Step

- **stepForm** <!--t:zfop--> — 🧩 ui · 💾 données · 🪟 modal · ⏳ à faire :
  ajout d un champ pour le prix (si on change ca change le prix de l accomodation),
  j ai une date d arrivée et de depart sur la vue du scenario mais pas ds le form
- **Retirer les colonnes d'avant les options** <!--t:v4m2--> — 🔄 synchro · ⏳ à faire : `nights`,
  `cityId`, `accommodationId` et `budget` restent déclarées dans `COLLECTIONS.steps`
  ([Code.js](apps-script/Code.js)) comme seule source de la reprise, et repartent vides au premier
  enregistrement. Une fois la conversion passée dans le Sheet, les retirer de la collection avec
  `adoptLegacyStep`, des deux côtés — l'Apps Script et [storage.js](js/storage.js).
- **Un select d'attraction plus moderne** <!--t:z3pb--> — 🧩 ui · ⏳ à faire : le champ de la
  modale d'étape ([attractions-field.js](js/views/scenarios/detail/step-modal/attractions-field.js))
  est un input nu qui n'ouvre sa liste qu'à la frappe. Le rendre interactif : les suggestions
  visibles au focus, la navigation au clavier, le résultat survolé mis en avant.

## 💻 plan-tool

- **drag and drop** <!--t:yr9v--> — ⏳ à faire
  - ok pour move au meme niveau
  - pouvoir deplacer ds une sous session
- **gerer scroll** <!--t:xwg8--> — 📐 layout · ⏳ à faire : gerer scroll pr laisser le header qd on
  scroll
- **nouveau bouton dupliquer sur ligne :** <!--t:9870--> — ✨ feature · ⏳ à faire : ouvre le sheet
  et met mon focus dans l input pour le name
- **le style des boutons nouvelle section et nouvelle tache est pas fou joue plutot avec le hover stp, en mode edit de tache c est bien et au lieu d'un bouton aouter et annuler en dessous mets un check et une X en fin de ligne stp** <!--t:nfpb--> — ✅ fait
- **sessions actives dans la barre latérale** <!--t:ij8e--> — 🧩 ui · ✅ fait : un panneau
  qui liste les tâches ayant une session, la plus récente en tête. Deux boutons par ligne, sur
  la carte comme dans le panneau : ▶ ouvre la session sur `/plan-tool-start-task`, ✓ sur `/plan-tool-commit-task`.
- **liste de taches sans section + bouton** <!--t:9fd9--> — ⏳ à faire : au dessus de la liste des
  tâches, afficher une liste de tache pas liée à une section + bouton pour ajouter
- **le sortir du projet travel ?** <!--t:u4fp--> — 🌙 plus tard · 🔵 basse
- **tags dans task form (type et statut)** <!--t:ydld--> — ✅ fait : pas les mêmes tags entre style
  et status prends le style de status

  on comprend pas bien quels tags sont selectionnés peut etr qu'il faut les faire passer au debut de
  la liste qd selectionn" ?

- **update plan task statuses** <!--t:f54a--> — 💾 données · ✅ fait : dans
  tools/plan-board/statuses.js voici ce que je veux utiliser a la place du code actuel

  const PLAN_STATUSES = [
  // mettre à jour avec les nouveaux emoji et cet ordre de priorité
  { label: 'à faire', emoji: '⏳', tone: 'todo', variant: 'focus' },
  { label: 'idée', emoji: '💡', tone: 'idea', variant: 'default' },
  { label: 'en cours', emoji: '🚧', tone: 'doing', variant: 'info' },
  { label: 'en attente', emoji: '⏸️', tone: 'paused', variant: 'warning' },
  { label: 'plus tard', emoji: '🌙', tone: 'later', variant: 'default' },
  { label: 'fait', emoji: '✅', tone: 'done', variant: 'success' },
  { label: 'abandonné', emoji: '🚫', tone: 'dropped', variant: 'error' },
  // virer ceux là
  { label: 'à trancher', emoji: '🤔', tone: 'open' },
  { label: 'acté', emoji: '📌', tone: 'settled' },
  // rajouter ceux la, j ai choisi l emoji choisis le tone
  { label: 'à planifier', emoji: '📓', variant: 'default' },
  { label: 'à étudier', emoji: '🔍', variant: 'default' },
  ];

  a mettre au bon endroit et à réutiliser par les autres Pills de Type
  const PILL_VARIANTS = {
  success: 'pill-success',
  focus: 'pill-success', // declinaison de success pour le focus
  info: 'pill-info',
  warning: 'pill-warning',
  error: 'pill-error',
  default: 'pill-default',
  };

  tu peux mettre à jour le nom de classes css + creer la classe focus stp

- **donner une priorité aux taches !** <!--t:49ng--> — ✅ fait
  - priority : low, medium, high, null or to_determine
  - - status pas obligatoire pour une tâche,
  - les nouvelles tâches sont crées sans statut ou alors avec status. "a trier" c est mieux et
    prority null aussi
- **navigation entre les listes** <!--t:is4k--> — 🖼️ écran · 📐 layout · 🧩 ui · ✅ fait : un
  clic sur la liste des sessions en cours ouvre cette liste ds le main panel

  un clic sur une section fait la même action, ouvre celle liste ds le main panel. on ajoute une
  fleche gauche a gauche du nom de la section pr revenir plus facilement à la liste

  voir comment filtrer les sections (fix par barre de filtre global pour l instant, cf - **créer une meilleur toolbar pour filtrer** <!--t:1ab9--> — 🧩 ui · ✅ fait : elle sera en
  )

  tri ok (drag and drop)

- **indicateur visuel pour une tâche en cours** <!--t:oqg6--> — 🧩 ui · ✅ fait : la carte prend la
  teinte du statut et un point pulse dans la gouttière, à gauche des pastilles
- **Simplifier les hooks Claude Code** <!--t:zg3m--> — ⚙️ infra · 🔍 à étudier : les hooks de
  `~/.claude/settings.json` ont été écrits vite, plusieurs pistes de simplification à trancher.

  `cc-status` est déclaré dix fois, une entrée par événement, alors qu'un même binaire les couvre
  tous : une seule entrée sans filtre de matcher ferait pareil.

  `postmortem-on-error-signal.py` porte des motifs morts — `\btu te tromp` couvre déjà
  `\btu te trompes de\b`, `\bwrong\b` couvre déjà `\byou (got it |were )?wrong\b` — et un
  `\bbordel\b` qui déclenche le rituel post-mortem sur un simple juron (« c'est un peu le
  bordel »).

  `pr-radar-session-start` recopie cinq fois la même phrase d'invocation, alors que seuls le nom du
  skill et le préfixe changent : une table marqueur → skill le dirait en une ligne par cas.

- **ajouter toasters** <!--t:o8vd--> — 🧩 ui · ⏳ à faire · 🔴 haute

### layout

- **créer une meilleur toolbar pour filtrer** <!--t:1ab9--> — 🧩 ui · ✅ fait : elle sera en
  header de l app a la palce de tous les pills

  fais un truc intelligent qui prend en compte le fait que j ai potentielement bcp d options pr les
  tris

  et qd on est ds une view genre une section ou la liste des sessions en cours ou sur la liste de
  toutes les tasts quasiment partout en fait

- **ajouter un bouton pour filtrer. plusioeurs niveaux. s inspirer de celui dans /travel** <!--t:8bxq--> — 🧩 ui · ⏳ à faire · 🔴 haute
- **task row** <!--t:cdjr--> — ✅ fait · 🔴 haute : quand creation de task inline : afficher le
  pill avec le + pour ajouter un status un type ou une priorité

  mets les elements dans l ordre : type priorité status ds la task aussi

  touche "enter" submit qd le row est focus

- **orga entre sous groupes et sections** <!--t:d6k4--> — 📥 à trier : actuellement, on a

  titre de la section | bouton pour ajouter un groupe

  liste des taches de la section
  ajouter une tâche à la section

  sous groupe
  liste des items du sous groupe
  ajouter une nouvelle tache au sous groupe

  moi je veux

  titre de la section

  sous groupe
  liste des items du sous groupe
  ajouter une nouvelle tache au sous groupe

  ajouter un sous groupe

  liste des taches de la section
  ajouter une tâche à la section

### Exportation

- **pouvoir ajouter des PR** <!--t:z7t5--> — 📥 à trier

## 🧳 Valise

La liste de ce qu'on emporte et de ce qu'on prépare, cochable. Remplace l'idée « Todo list de
voyage ». Tout est à trancher, rien n'est commencé.

- **Créer la page** <!--t:ejih--> — 🖼️ écran · ⏳ à faire : `navBtn('valise', '🧳', 'Valise')` dans
  la barre latérale, après Notes ([render.js:11](js/render.js#L11)), et `js/views/packing/` pour le
  domaine — un dossier par domaine, comme `cars/` ou `cities/`.
- **Entité `packingItems`** <!--t:1zre--> — 🗃️ modèle · 💡 idée : une collection de plus dans
  `COLLECTIONS` ([Code.js:8](apps-script/Code.js#L8)) et dans `emptyData()`
  ([storage.js:17](js/storage.js#L17)), avec son `travelId` en première colonne comme les autres.
  Modèle proposé : libellé, catégorie, quantité, coché, `travelerId` plus tard, notes.
- **Catégories** <!--t:fjcp--> — 🗃️ modèle · 🔍 à étudier : une liste figée sur le modèle d'
  [accommodation-types.js](js/accommodation-types.js) (vêtements, papiers, santé, électronique,
  bagage cabine, voiture, à faire avant de partir) ou des tags libres comme
  [tags.js:5](js/views/tags.js#L5). Les deux existent déjà dans l'app, il faut choisir lequel.
- **Modèle par défaut** <!--t:l13t--> — 🧩 ui · 🔍 à étudier : un bouton « Partir d'une liste
  type » qui crée les items d'un coup, versus une liste vide. Si modèle il y a, il vit à côté de la
  vue, comme [default-car.js](js/views/cars/default-car.js).
- **Cocher** <!--t:30rq--> — 🧩 ui · 💡 idée : une case par ligne, écrite directement en base comme
  les inline-edits existants, et un compteur « 12 / 30 » dans l'en-tête.

### Intégration aux scénarios

- **Quantités déduites des nuits** <!--t:19lc--> — 🧮 calcul · 🔍 à étudier : le scénario connaît
  déjà ses nuits ([nights.js](js/views/scenarios/nights.js)). Une quantité peut valoir « 1 par
  nuit » plutôt qu'un nombre fixe, et se recalculer quand le scénario retenu change. Suppose un
  scénario « retenu » sur le voyage — même prérequis que les chiffres des cartes Voyages.
- **Items rattachés à une étape** <!--t:q8pc--> — 🗃️ modèle · 🔍 à étudier : un `stepId` optionnel
  sur l'item (maillot pour l'étape mer, chaussures de rando pour l'étape Chianti), sur le modèle
  d'une étape qui référence un hébergement. La page Valise les grouperait alors par étape, dans
  l'ordre du scénario.
- **Bloc « Valise » dans le détail d'un scénario** <!--t:t5g5--> — 🧩 ui · 💡 idée : sous les
  étapes, à côté du bloc Charges fixes, une ligne par catégorie avec son compteur et un lien vers la
  page. Lecture seule : on coche depuis la page Valise, pas depuis le scénario.
- **Ce qui dépend de la voiture** <!--t:u7x0--> — 🗃️ modèle · 💡 idée : le scénario porte déjà une
  voiture ([car-block.js](js/views/scenarios/detail/car-block.js)). Des items « coffre de toit »,
  « siège enfant » n'ont de sens que s'il y a une voiture — à voir si la valise s'en sert ou si
  c'est une complication inutile.

## 🗺️ Voyages

Le socle est en place : l'entité Voyage, le voyage ouvert dans les préférences locales, le
sélecteur et sa modale dans la barre latérale, et le `travelId` sur toutes les collections, Sheet
compris. Décrit dans [la spec](docs/spec-voyage-toscane.md). Ce qui reste :

- **Page Voyages** <!--t:zjbi--> — 🖼️ écran · 🧩 ui · 🌙 plus tard : la liste des voyages en cartes
  (image, emoji, nom, destination, dates, statut), avec créer / modifier / dupliquer / supprimer.
  Sert d'écran d'accueil quand aucun voyage n'est ouvert. Tant qu'elle n'existe pas, le sélecteur de
  la barre latérale est le seul point d'entrée.
- **Place dans le site** <!--t:cjzz--> — 🖼️ écran · ⏳ à faire : `navBtn('voyages', '✈️', 'Voyages')`
  en tête de la barre latérale, avant Hébergements ([render.js:9](js/render.js#L9)), et
  `view = 'voyages'` comme vue initiale quand `currentTravelId` est vide. Le dossier
  [js/views/travels/](js/views/travels/) existe déjà : la page y ajoute `travels.js`, `header.js` et
  `cards.js`, et réutilise `modal/` et `get-travel.js` du sélecteur.
- **Ouvrir un voyage depuis une carte** <!--t:qfai--> — 🧩 ui · 🌙 plus tard : un clic sur la carte
  appelle le même `setCurrentTravel()` que le menu du sélecteur
  ([current-travel.js](js/current-travel.js)) et bascule sur Hébergements. Le sélecteur reste, les
  deux points d'entrée partagent le même chemin.
- **Chiffres de la carte** <!--t:aqpf--> — 🗃️ modèle · 🧮 calcul · 🔍 à étudier : ce qu'une carte
  de voyage résume — nombre d'hébergements et de scénarios, budget du scénario retenu — et donc s'il
  faut un scénario « retenu » sur le voyage, ce qui n'existe pas aujourd'hui.
- **Supprimer un voyage** <!--t:kgci--> — 🧩 ui · 🗃️ modèle · 🌙 plus tard : avec la page Voyages,
  puisque c'est de là qu'on supprime. Confirmation obligatoire, et les données rattachées partent
  avec.
- **Voyageurs → coût par personne** <!--t:th4r--> — 🧮 calcul · ⏳ à faire : le total général d'un
  scénario affiche le montant divisé par le nombre de voyageurs, à côté du total.

## 🏠 Hébergements

- **Sort de l'import depuis un tableau** <!--t:sga5--> — 🧩 ui · 🔌 intégration · 🔍 à étudier : le
  bouton « Importer » n'est affiché que tant qu'aucun Sheet n'est connecté
  ([header.js:41](js/views/accommodations/header.js#L41)), et `openPasteImport()` reste commentée
  dans [paste-import.js](js/views/accommodations/modal/paste-import.js#L50) avec les questions
  ouvertes sur le flux d'import de fichier. Garder, généraliser ou supprimer.
- **Dropdown custom pour les selects inline** <!--t:kig5--> — 🧩 ui · ✅ fait : `accommodationTypeSelect`
  et `accommodationStatusSelect` ([inline-selects.js](js/views/accommodations/inline-selects.js))
  sont des `<select>` natifs, dont les `<option>` n'affichent que du texte — impossible d'espacer
  l'emoji et le libellé. Les remplacer par un bouton + une liste en `div`, ce qui remplace aussi
  leurs `onchange`.

## 💶 Dépenses

La page existe : les deux blocs Calculé / Saisi, les sources dérivées et le récap sont décrits dans
[la spec](docs/spec-voyage-toscane.md). Les charges fixes sont le bloc Saisi ; elles gardent leur
table et leur modale.

- **Sources dérivées à montant ouvert** <!--t:3kq7--> — 🧮 calcul · ⏳ à faire : un hébergement à
  prix par nuit et une voiture à prix par jour s'affichent avec leur unité et restent hors du total
  ([derived.js](js/views/expenses/derived.js)). Décider sur combien de nuits / de jours les
  multiplier — le nombre ne vit nulle part hors d'un scénario.
- **Budget et prix** <!--t:w4qe--> — 🗃️ modèle · ⏳ à faire : applique la règle transverse « Budget
  et prix » — un `budget` optionnel, et le prix en `amountMin` / `amountMax`. Le champ `type`
  `budget total` / `cost` envisagé ici n'a plus lieu d'être : une charge sans prix saisi **est** une
  enveloppe, le dire deux fois ouvre la porte à la contradiction.
- **Fourchette incomplète** <!--t:hl47--> — 🧮 calcul · 🔍 à étudier : ce que vaut la charge dans
  un total quand un seul des deux montants est saisi. `firmPrice`
  ([derived.js](js/views/expenses/derived.js)) tient la réponse provisoire : une seule borne compte
  pour elle-même, deux bornes différentes restent hors du total. À confirmer ou à changer.
- **Afficher ou non le bloc Calculé** <!--t:v2ne--> — 🧩 ui · ⏳ à faire : un toggle sur la section
  des dépenses dérivées, et une condition par source qui dit ce qui y entre —
  `accommodation.status === 'booked'`, `scenario.isChosen`, et la troisième reste à nommer.
- **Une dépense saisie appartient-elle au scénario ?** <!--t:x8dr--> — 🗃️ modèle · 🔍 à étudier :
  aujourd'hui elle appartient au voyage. Reste à décider si certaines n'existent que dans un
  scénario — et si oui, par un `scenarioId` optionnel sur la dépense, ou par la liste `costIds` que
  le scénario porte déjà.

## ✈️ Transports

Les trajets d'un voyage — avion, train, bus, ferry, voiture. La page existe : modèle, modes,
statuts, départ / arrivée, prix et tableau sont décrits dans
[la spec](docs/spec-voyage-toscane.md). La voiture garde sa propre entrée de barre latérale :
`cars` reste la table de location, et un transport de mode voiture la **référence** plutôt que de
la recopier.

- **Prix dans le total d'un scénario** <!--t:8suc--> — 🧮 calcul · ⏳ à faire : les transports
  rattachés à un scénario s'ajoutent au total général
  ([total.js](js/views/scenarios/detail/total.js)), à côté des hébergements, de la voiture et des
  charges fixes, selon la règle transverse — prix s'il existe, budget sinon.

### Intégration aux scénarios

- **Rattacher un transport à un scénario** <!--t:u2p3--> — 🧩 ui · ⏳ à faire : `transportIds` est
  au modèle et au Sheet, avec `getScenarioTransports`. Reste l'écran : où on rattache, et ce que le
  détail en montre.
- **Affichage dans le détail** <!--t:2icu--> — 🧩 ui · 💡 idée : entre deux `step-card`
  ([step-list.js](js/views/scenarios/detail/step-list.js)), une ligne fine avec le mode, l'horaire
  et le prix. C'est le même emplacement que la distance et l'essence de « Plus tard ».
- **Aller-retour du voyage** <!--t:oujb--> — 🗃️ modèle · 🔍 à étudier : le vol aller et le vol
  retour encadrent le voyage entier, pas une étape. Soit deux transports sans étape rattachée, soit
  des étapes fictives de départ et de retour dans le scénario.

## 🎡 Attractions

La page existe : modèle, types, statuts, tags et tableau sont décrits dans
[la spec](docs/spec-voyage-toscane.md). Ce qui reste :

- **Une attraction peut-elle être une ville ?** <!--t:4heo--> — 🗃️ modèle · 🔍 à étudier : Montefioralle
  est à la fois un village à visiter et un lieu d'étape. Trancher entre le tag `village` sur
  l'attraction, qui duplique la ville, et un `cityId` optionnel qui **référence** une ville
  existante, comme une étape de scénario référence un hébergement.
- **Attractions sur la carte** <!--t:4ehs--> — 🧩 ui · ⏳ à faire : elles portent des coordonnées
  mais [map.js](js/views/map.js) ne trace que les hébergements.
- **Renommer l'entité en « À faire »** <!--t:8kqp--> — 🧹 refacto · ⏳ à faire : la barre latérale
  et le titre disent « À faire », mais les libellés d'item disent encore « une attraction »
  (modale, recherche, chips d'étape), et les clés de code et de Sheet restent `attractions`. Reste
  à choisir le mot au singulier, puis à décider si les clés suivent — c'est la même migration que
  <!--t:omun-->.
- **Scraper un lien Google Maps** <!--t:tr0w--> — 🔌 intégration · ⏳ à faire : depuis le formulaire,
  remplir nom, adresse, coordonnées et horaires à partir d'une URL `maps.app.goo.gl`.
- **Une page Restaurants ?** <!--t:eymt--> — 🖼️ écran · 🔍 à étudier : le type étant porté par
  l'attraction, une entrée de barre latérale « Restaurants » n'est qu'un filtre sur la vue
  Attractions. À décider quand il y aura assez de contenu pour que la liste mixte devienne
  illisible.

## 🔎 Browse

- **Créer la page** <!--t:trrm--> — 🖼️ écran · 🔌 intégration · 🌙 plus tard : des propositions
  d'hôtels dans la page, et des intégrations qui partent des villes déjà choisies — par exemple les
  villes des étapes d'un scénario. Sources et point d'entrée à préciser.

## 🏙️ Villes

- **Rattacher les villes saisies au modèle existant** <!--t:p334--> — 🗃️ modèle · 🐛 fix · ⏳ à faire : les
  villes ajoutées depuis les autres écrans doivent pointer sur une entrée de `cities`, pas créer un
  doublon de texte.

## 🧩 Transverse

- **Budget et prix : étendre la règle** <!--t:u6zh--> — 🗃️ modèle · ⏳ à faire : la règle est actée
  dans [la spec](docs/spec-voyage-toscane.md) et implémentée sur les transports, les briques
  communes vivant dans [price.js](js/views/price.js). Restent les hébergements (`price`), les
  voitures (`pricePerDay` / `priceTotal`) et les charges fixes (`amount`), qui gardent chacune leur
  champ de prix unique.

- **Renommer `notes` en `userNotes`** <!--t:f4k6--> — 🗃️ modèle · 🧹 refacto · ⏳ à faire : sur
  toutes les entités, Sheet compris — donc une colonne renommée dans chaque liste de `COLLECTIONS`
  ([Code.js:8](apps-script/Code.js#L8)) et une migration dans `migrateData()`
  ([storage.js:39](js/storage.js#L39)).
- **Archiver le Sheet dans une base de référence** <!--t:1skd--> — 🔌 intégration · ⏳ à faire : un
  bouton qui pousse à la demande tout le contenu du Sheet dans une base plus large, commune à tous
  les voyages. C'est elle qui alimentera les suggestions.
- **Mode suggestion** <!--t:0p0n--> — 🖼️ écran · 🔌 intégration · ⏳ à faire : à partir de cette
  base, un panneau qui propose hébergements, voitures, restaurants et attractions en lien avec le
  voyage en cours. Reste à décider s'il est toujours affiché ou repliable comme la carte d'un
  scénario. Remplace la page **Browse**, à renommer.
- **Nommer les vues en anglais** <!--t:omun--> — 🧹 refacto · 🌙 plus tard : deux espaces de noms
  cohabitent, les vues en français (`hebergements`, `voitures`, `depenses`, `villes` — clés de
  `view`, `listViewMode`, `COLUMN_SETS`, `prefs.sort`) et les données en anglais (`accommodations`,
  `cars`, `fixedCosts`, `cities` — clés de `state` et du Sheet). Renommer les vues sur les secondes
  aligne le tout ; les prefs stockées étant indexées par vue, les colonnes masquées et le tri
  repartent à zéro une fois. La page Dépenses ajoute un troisième nom : sa clé de `view` est
  `depenses`, ses clés de `listViewMode`, `COLUMN_SETS` et `prefs.sort` sont restées `charges`.
- **Redécouper `accommodations.js`** <!--t:p2ib--> — 🧹 refacto · ⏳ à faire : 95 lignes à plat alors
  que `js/views/accommodations/` existe, et trois responsabilités dans le même fichier — le render,
  les filtres (`listFilters`, `tagFilterBlock`, `toggleTagFilter`, `toggleFavOnly`, tous lus par
  [header.js](js/views/accommodations/header.js)) et les setters (`setAccommodationType`/`Status` →
  [inline-selects.js](js/views/accommodations/inline-selects.js), `setAccommodationNotes` →
  [notes-editable.js](js/views/accommodations/notes-editable.js), `toggleFavorite` → card et
  columns).
- **gérer correctement les liens entre les prix entre les differentes entités** <!--t:8tln--> — 💾 données · 🏛️ archi · ⏳ à faire : faire
  un etat des lieux de comment la donnee est structuree sur chaque entité (car, transport,
  accomodation, restaurant etc.) et

  voir a qui il faut donner le prix et dans quel cas il faut affichier quoi
  qui doit pouvoit editer
  qui doit calculer une valeur dynamiquement donc ne dois pas pouvoir êtr emodifié (ui particuliere)

## 🔄 Synchro

- **Création du Sheet à la première utilisation** <!--t:ylrv--> — 🔌 intégration · ⏳ à faire : le
  flux complet — quand le fichier est créé, quand les données le sont, et si on les crée au bon
  moment.
- **Plusieurs versions du script `travel`** <!--t:gx5n--> — 🔌 intégration · ⏳ à faire : comprendre
  d'où viennent les déploiements multiples de l'Apps Script et n'en garder qu'un. Le dépôt ne porte
  qu'un [Code.js](apps-script/Code.js) : les versions vivent côté Google, dans l'historique de
  déploiement, pas ici.
- **Vérifier que le backend est documenté** <!--t:m9ci--> — 📄 doc · ⏳ à faire : l'en-tête de
  [Code.js](apps-script/Code.js#L1-L6) donne la procédure de déploiement ; confirmer qu'elle est à
  jour et reprise dans [docs/protocole-sync-sheet.md](docs/protocole-sync-sheet.md).

## Layout

- **fix scroll in page** <!--t:epip--> — 📐 layout · ⏳ à faire : make thinkgs sticky and other
  scrollables

## 📝 Données à saisir

Du contenu, pas des fonctionnalités : à entrer dans l'app dès que l'écran correspondant existe.

### Restaurants

- **Il Vescovino** — Greve in Chianti, Via Ciampolo da Panzano, 9 · 338 36 48 446 ·
  [ilvescovinoristorante.com](https://ilvescovinoristorante.com) · mar.-sam. 12h-15h et 19h-22h,
  dim. 12h-15h · primi 12-20 €, secondi 18-20 €. Restaurant familial tenu par une famille
  italo-brésilienne installée à Panzano. Poulet spécial et **tiramisù — le meilleur dessert**.
- **Apicorno Formaggi** — Tavarnelle Val di Pesa, Strada di Sicelle, 2b Valle · 338 119 52 75 ·
  martabuon@gmail.com · [apicorno.com/formaggi](https://www.apicorno.com/formaggi) · avr.-oct.,
  tous les jours 9h-13h. Fromager : robiola de chèvre, cenerico au charbon de bois, stracchinato,
  « caprembert » au lait de chèvre cru. Dégustation à organiser par email ou téléphone.
- <https://maps.app.goo.gl/BKQXqqXEKW8K1GjS7?g_st=ic> — à identifier.

### Attractions

- **Torre del Palacio Guinigi** — noté « 114 » dans la source, sens à retrouver.
- **Marina di Pisa** — plage.
- **Pieve Aldina** — noté dans la partie Chianti, à identifier.

### Villes

- **Montefioralle** — Greve in Chianti, Toscane. À 2 km à l'ouest de Greve, 20 min à pied de
  l'office de tourisme. Village perché parmi les plus beaux d'Italie, préservé dans son état du
  16ᵉ s., une ruelle unique enroulée autour de la colline jusqu'à une petite église. Chercher la
  façade marquée d'un V enserrant une abeille : la maison natale d'Amerigo Vespucci (1454-1512).
  À rattacher à Greve in Chianti ou au Chianti — à voir.
