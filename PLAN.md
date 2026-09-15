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

- **try dynamic route trail** <!--t:m8qd--> — 🧩 ui · 📐 layout · 💡 idée :
  [route-trail.js](js/views/scenarios/detail/route-trail.js) s'affiche de nouveau sous l'en-tête,
  derrière la bascule « Afficher le fil » des Réglages
  ([trail-show.js](js/views/scenarios/detail/trail-show.js)). La bande de maillons prend trop de
  place, la colonne de gauche et la gouttière nue essayées ne valent pas mieux : trouver ce que le
  fil doit montrer, et quand. Il se peint du statut de l'étape comme la bande de la liste, et
  « Coloré par type d'hébergement » ([trail-color.js](js/views/scenarios/detail/trail-color.js))
  bascule sa couleur, dans le même bloc du panneau.
- **Variables du scénario ou générales ?** <!--t:p11j--> — 🗃️ modèle · 💡 idée : on commence a
  répondre à ca dans la trasfo de charges fixes en depense normameent

- **Un mode lecture du scénario** <!--t:r2wn--> — 🖼️ écran · 🧩 ui · 🔍 à étudier : le
  détail d'un scénario est aujourd'hui un plan de travail — poignées de glisser, boutons Modifier,
  ✚ d'ajout, champs éditables — alors qu'on le lit bien plus souvent qu'on ne le construit.
  Chercher à quoi ressemble la même étape quand on ne fait que la lire : ce qui disparaît, ce qui
  se resserre, et par quel geste on repasse en construction.

### Plus tard

- **Estimation de l'essence** <!--t:q7aw--> — 🧮 calcul · 🌙 plus tard
- **Estimation des péages** <!--t:dlde--> — 🧮 calcul · 🌙 plus tard

### Step

- **stepForm** <!--t:zfop--> — 🧩 ui · 💾 données · 🪟 modal · ⏳ à faire :
  ajout d un champ pour le prix (si on change ca change le prix de l accomodation),
  j ai une date d arrivée et de depart sur la vue du scenario mais pas ds le form
- **Retirer la reprise d'avant les colonnes** <!--t:v4m2--> — 🔄 synchro · ⏳ à faire : l'onglet
  `stepOptions` et la colonne `city` de `COLLECTIONS.steps` ([Code.js](apps-script/Code.js)) ne sont
  plus que la source de la reprise, et repartent vides au premier enregistrement. Une fois la
  conversion passée dans le Sheet, les retirer de la collection avec `adoptScenarioSteps` et
  `explodeStepOptions`, des deux côtés — l'Apps Script et [storage.js](js/storage.js).

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

## 🚗 Voitures

La page existe : modèle, statuts, prix, voiture par défaut et tableau sont décrits dans
[la spec](docs/spec-voyage-toscane.md). Ce qui reste :

- **Type de motorisation** <!--t:md3s--> — 🗃️ modèle · ⏳ à faire : essence, diesel, hybride,
  électrique. Une liste figée sur le modèle de [car-statuses.js](js/car-statuses.js), plus une
  colonne et un champ de modale.
- **Modèles équivalents** <!--t:eq9v--> — 🗃️ modèle · ⏳ à faire : `model` devient le modèle
  **choisi**, et la voiture porte à côté les autres modèles proposés par le loueur pour la même
  location.

## 💰 Dépenses

La page existe : les deux blocs Calculé / Saisi, les sources dérivées et le récap sont décrits dans
[la spec](docs/spec-voyage-toscane.md). Les charges fixes sont le bloc Saisi ; elles gardent leur
table et leur modale.

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
- **La récurrence sur une ligne d'étape** <!--t:n4vc--> — 🧮 calcul · 🔍 à étudier : une dépense
  rattachée au scénario se multiplie par ses nuits, ses jours ou ses voyageurs
  ([expense-recurrences.js](js/expense-recurrences.js)), mais la même posée sur une étape ou un
  groupe garde le `count` saisi à la main ([extras/amount.js](js/views/scenarios/detail/extras/amount.js)) :
  la même dépense ne compte pas pareil selon où on l'accroche. Appliquer l'unité au porteur demande
  de faire redescendre celui-ci dans toute la chaîne des lignes — `extraLinesTotal` et
  `scenarioExtraLines` ne manipulent que des lignes détachées de leur porteur — et de dire ce que
  valent les nuits d'un groupe, qui porte plusieurs colonnes. À trancher avant de s'y mettre :
  l'unité et le `count` se multiplient-ils l'un l'autre.
- **Les récurrences écrites en texte libre** <!--t:qm7e--> — 🗃️ modèle · ⏳ à faire : le champ était
  du texte avant de devenir un vocabulaire ; une valeur inconnue retombe sur « une fois »
  silencieusement, donc une dépense qui disait « par jour » compte désormais une seule fois. Relire
  la colonne du Sheet et rattacher chaque texte à sa clé.
- **Une dépense qui n'existe que dans un scénario** <!--t:x8dr--> — 🗃️ modèle · ⏳ à faire : une
  dépense peut n'appartenir qu'à un scénario, et disparaît alors de la page Dépenses. Le
  rattachement reste porté côté scénario — les `costIds`, les lignes d'une étape ou d'un groupe —
  le `scenarioId` optionnel sur la dépense restant écarté : elle ne peut pas porter un champ par
  niveau de rattachement. Aujourd'hui une dépense ajoutée depuis le détail
  ([expenses-block.js](js/views/scenarios/detail/expenses-block.js)) reste sur la page Dépenses
  ([manual.js](js/views/expenses/manual.js)), et le ✕ la détache sans la supprimer. À trancher : ce
  qui marque une dépense comme propre au scénario, et ce que devient le ✕ sur elle.

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
- **Renommer l'entité en « activité »** <!--t:8kqp--> — 🧹 refacto · ⏳ à faire : la barre latérale
  et le titre disent « Activités », mais les libellés d'item disent encore « une attraction »
  (modale, recherche, chips d'étape), et les clés de code et de Sheet restent `attractions`. Reste
  à décider si les clés suivent — c'est la même migration que <!--t:omun-->.
- **Les horaires depuis un lien Google Maps** <!--t:tr0w--> — 🔌 intégration · ⏳ à faire : le nom,
  l'adresse et les coordonnées se remplissent déjà
  ([GoogleMaps.js](apps-script/GoogleMaps.js)), lus dans l'URL finale et dans les métadonnées de
  partage. Les horaires, eux, ne vivent que dans le blob d'initialisation de la page : il faut
  d'abord regarder ce qu'une vraie fiche renvoie, `testGoogleMaps()` depuis l'éditeur Apps Script.
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

- **Filtrer sur les quatre niveaux de lieu** <!--t:w8q2--> — 🧩 ui · 🔌 intégration · ⏳ à faire : le
  panneau de la carte ne propose que la province, et `distinctCounties()`
  ([map/filters.js](js/views/map/filters.js#L14)) ignore `state.cities`. Le remplacer par une
  cascade Pays → Région → Province → Ville lue sur `PLACE_LEVELS`, alimentée par les trois
  collections localisées, puis poser la même brique dans les en-têtes Hébergements et Activités.
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
- **Redécouper `accommodations.js`** <!--t:p2ib--> — 🧹 refacto · ⏳ à faire : 58 lignes à plat alors
  que `js/views/accommodations/` existe. Les filtres en sont sortis dans
  [filters.js](js/views/accommodations/filters.js) et
  [filter-panel.js](js/views/accommodations/filter-panel.js) ; restent le render et les setters
  (`setAccommodationType`/`Status` →
  [inline-selects.js](js/views/accommodations/inline-selects.js), `setAccommodationNotes` →
  [notes-editable.js](js/views/accommodations/notes-editable.js), `toggleFavorite` → card et
  columns).
- **gérer correctement les liens entre les prix entre les differentes entités** <!--t:8tln--> — 💾 données · 🏛️ archi · ⏳ à faire : faire
  un etat des lieux de comment la donnee est structuree sur chaque entité (car, transport,
  accomodation, restaurant etc.) et

  voir a qui il faut donner le prix et dans quel cas il faut affichier quoi
  qui doit pouvoit editer
  qui doit calculer une valeur dynamiquement donc ne dois pas pouvoir êtr emodifié (ui particuliere)

- **Ouvrir une ligne dans un panneau de détail : les autres listes** <!--t:n3vd--> — 🧩 ui ·
  🖼️ écran · 💡 idée : les hébergements ouvrent leur fiche en panneau, d'une ligne du tableau
  comme du ↗ du menu de lieu d'une étape. Reste à déclarer `ROW_CLICKS` pour villes, activités,
  transports et voitures, dont la fiche s'ouvre encore dans la modale centrée. Reste aussi à
  trancher ce que devient le ✎ de la colonne actions, qui ouvre toujours la modale. C'est la revue
  de navigation qui précède la PWA.
- **Installer l'app en PWA** <!--t:s7ka--> — ⚙️ infra · ⏸️ en attente : un `manifest.json` et un
  service worker — icône sur l'écran d'accueil, plein écran sans barre d'adresse, hors-ligne
  puisque tout est déjà dans `localStorage`, et l'URL reste partageable. React Native est écarté :
  5801 des 7397 lignes de `js/` sont du rendu DOM à réécrire, Leaflet n'y existe pas, et on perdrait
  le lien à envoyer. À reprendre une fois la navigation revue.

- **Passer le repo en privé et héberger sur Netlify** <!--t:r6wc--> — ⚙️ infra · ⏳ à faire : le
  dépôt est public parce que le site est une GitHub Page ; un repo privé y demanderait GitHub Pro,
  Netlify le fait en gratuit — pas de build, déploiement au push. Reste à trancher le dossier
  publié : avec `.`, tout le dépôt est servi par URL directe — [PLAN.md](PLAN.md), [docs/](docs/),
  [apps-script/](apps-script/), [tools/](tools/) —, donc ne publier que ce que le navigateur
  charge, ce qui met `index.html`, `styles.css` et `js/` sous un dossier. Le code applicatif, lui,
  reste lisible dans l'onglet Sources quoi qu'il arrive : ce qu'on gagne, c'est l'historique git et
  les fichiers hors app. Fermer le _contenu_ du voyage est une autre question — il y faudrait une
  auth devant le site (Cloudflare Access, gratuit jusqu'à 50 comptes). Deux lignes de la spec
  nomment GitHub Pages comme hôte, le `#` des adresses
  ([spec](docs/spec-voyage-toscane.md#L43)) et la pastille « local » de la favicon
  ([spec](docs/spec-voyage-toscane.md#L188)) : elles suivront.

## 🔄 Synchro

- **Création du Sheet à la première utilisation** <!--t:ylrv--> — 🔌 intégration · ⏳ à faire : le
  flux complet — quand le fichier est créé, quand les données le sont, et si on les crée au bon
  moment.
- **Résolution de conflits visuelle** <!--t:yx4a--> — 🧩 ui · 🔌 intégration · 🌙 plus tard : le
  3-voies de [sync.js](js/sync.js) fusionne entrée par entrée sans rien montrer, et un push qui
  reste en conflit après une deuxième tentative ne laisse qu'un message d'erreur. Un écran qui pose
  les deux versions côte à côte et laisse trancher champ par champ.
- **Plusieurs versions du script `travel`** <!--t:gx5n--> — 🔌 intégration · ⏳ à faire : comprendre
  d'où viennent les déploiements multiples de l'Apps Script et n'en garder qu'un. Le dépôt ne porte
  qu'un [Code.js](apps-script/Code.js) : les versions vivent côté Google, dans l'historique de
  déploiement, pas ici.
- **Vérifier que le backend est documenté** <!--t:m9ci--> — 📄 doc · ⏳ à faire : l'en-tête de
  [Code.js](apps-script/Code.js#L1-L6) donne la procédure de déploiement ; confirmer qu'elle est à
  jour et reprise dans [docs/protocole-sync-sheet.md](docs/protocole-sync-sheet.md).

## ✅ À faire

La page existe : le builder, les listes dynamiques et leur modèle sont décrits dans
[la spec](docs/spec-voyage-toscane.md). Ce qui reste :

- **Créer l'onglet `todoLists` dans le Sheet** <!--t:tq7d--> — 🔌 intégration · ⏳ à faire :
  `todoLists` est déclarée dans [Code.js](apps-script/Code.js) et dans
  [storage.js](js/storage.js), mais l'onglet n'existera qu'après un `pnpm push-script` et un
  premier envoi. Tant que ce n'est pas fait, les listes ne vivent qu'en local.
- **Filtrer sur « Non renseigné »** <!--t:x5nb--> — 💾 données · 🔍 à étudier : une valeur vide ne
  se propose pas, parce qu'une cellule du Sheet joint les valeurs par virgules et qu'un morceau
  vide se perd à la relecture ([Code.js](apps-script/Code.js) `LIST_FIELDS`). Il faudrait un mot
  sentinelle pour lister ce qui n'a pas de statut.
- **Filtrer sur les tags** <!--t:g2vw--> — 🧩 ui · ⏳ à faire : la colonne Tags ne déclare pas de
  `sortValue`, donc le builder ne la propose pas. Un tag est pourtant l'axe le plus naturel d'une
  liste à faire.
- **Changer la ressource d'une liste** <!--t:m8rc--> — 🧩 ui · 💡 idée : on modifie les valeurs en
  cliquant les pastilles de la liste, mais changer de ressource ou de colonne demande de la
  supprimer et de la refaire.
- **Nommer une liste** <!--t:k6ja--> — 🗃️ modèle · 💡 idée : le titre est composé de la ressource
  et de la colonne. Un nom libre — « avant de partir », « à payer » — dirait mieux pourquoi la
  liste existe.
- **Ordonner les listes** <!--t:p9wd--> — 🧩 ui · 💡 idée : elles se suivent dans l'ordre de
  création. Un glisser comme celui des étapes les rangerait.

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
