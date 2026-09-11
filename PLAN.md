# À faire

Le backlog, rangé par page. Un item terminé **sort d'ici** et va décrire l'app dans
[docs/spec-voyage-toscane.md](docs/spec-voyage-toscane.md) : ce fichier n'archive pas ce qui est
fait, git s'en charge. Les arbitrages de fond sont dans « Décisions actées » de la spec.

## Voyages

Une surcouche au-dessus de toute l'app : aujourd'hui tout est un seul voyage implicite (« Voyage
Toscane », en dur dans [index.html:6](index.html#L6) et dans la barre latérale de
[render.js:7-8](js/render.js#L7-L8)). Chaque item du backlog ci-dessous suppose que les données
appartiennent à un voyage.

**Tranché : un seul Sheet, une colonne `travelId`.** Les données de tous les voyages cohabitent
dans les mêmes onglets et sont filtrées par l'app. L'autre piste — un classeur par voyage — a été
écartée : l'Apps Script travaille sur `getActiveSpreadsheet()`
([Code.js:285](apps-script/Code.js#L285)), donc chaque voyage aurait demandé de dupliquer le
classeur et de redéployer le script à la main, et créer un voyage depuis l'app devenait impossible.

Les huit premiers items forment le lot en cours, dans l'ordre où ils se codent ; les quatre
suivants attendent sous « Plus tard ».

- **Créer l'entité Voyage** — ⏳ à faire : `travels` dans `emptyData()`
  ([storage.js:8](js/storage.js#L8)), avec nom, emoji, image, description, statut, dates de début et
  de fin, destination (pays / région), couleur d'accent, voyageurs.
- **Statuts** — ⏳ à faire : Idée, En préparation, Réservé, En cours, Passé — un fichier
  `js/travel-statuses.js` sur le modèle de
  [accommodation-statuses.js](js/accommodation-statuses.js).
- **Rattacher toutes les données au voyage** — ⏳ à faire : `travelId` sur hébergements, voitures,
  charges fixes, villes, scénarios et notes ; chaque getter et chaque vue ne lit que le voyage
  courant. Les données existantes sont migrées vers un premier voyage dans `migrateData()`
  ([storage.js:22](js/storage.js#L22)). La colonne s'ajoute **en fin** de chaque liste de
  `COLLECTIONS` ([Code.js:9-33](apps-script/Code.js#L9-L33)) : une insertion au milieu décale toutes
  les lignes déjà écrites, le bug que rattrape `unshiftAccommodation()`
  ([storage.js:62](js/storage.js#L62)).
- **Voyage courant** — ⏳ à faire : l'id du voyage ouvert vit dans `prefs`
  ([prefs.js](js/prefs.js)), pas dans les données synchronisées, et se retrouve au rechargement.
- **Modale Voyage** — ⏳ à faire : `js/views/travels/modal/form.js` et `save.js`, avec le choix de
  l'emoji, l'image et le select de statut. Sert à créer comme à modifier un voyage.
- **Sélecteur de voyage dans la barre latérale** — ⏳ à faire : en tête, à la place du titre en dur
  ([render.js:7-8](js/render.js#L7-L8)) — un bouton emoji + nom + dates qui ouvre un menu
  déroulant : les autres voyages, puis « Modifier » et « Nouveau voyage », tous deux vers la modale
  Voyage. En sidebar réduite, `.brand` est masqué ([styles.css:890](styles.css#L890)) : il ne reste
  que l'emoji, cliquable.
- **Dates du voyage → scénarios** — ⏳ à faire : la date de début du voyage sert de valeur par
  défaut au `startDate` d'un scénario, aujourd'hui saisi scénario par scénario.
- **Synchro Google Sheet** — ⏳ à faire : un onglet `travels` de plus, et la fusion entrée par
  entrée de [sync.js](js/sync.js) étendue aux voyages.

### Plus tard

- **Page Voyages** — ⏳ à faire : la liste des voyages en cartes (image, emoji, nom, destination,
  dates, statut), avec créer / modifier / dupliquer / supprimer. Sert d'écran d'accueil quand aucun
  voyage n'est ouvert. Tant qu'elle n'existe pas, le sélecteur de la barre latérale est le seul
  point d'entrée.
- **Onglet du navigateur** — ⏳ à faire : le titre et la favicon suivent le voyage courant, la
  favicon étant l'emoji rendu en SVG `data:`.
- **Couleur d'accent** — ⏳ à faire : la couleur du voyage pilote les variables CSS de l'app, pour
  savoir d'un coup d'œil dans quel projet on est.
- **Voyageurs → coût par personne** — ⏳ à faire : le récap d'un scénario affiche le total divisé
  par le nombre de voyageurs, à côté du total général.

## Hébergements

- **Sort de l'import depuis un tableau** — ⏳ à trancher : le bouton « Importer » n'est affiché que
  tant qu'aucun Sheet n'est connecté ([header.js:41](js/views/accommodations/header.js#L41)), et
  `openPasteImport()` reste commentée dans
  [paste-import.js](js/views/accommodations/modal/paste-import.js#L50) avec les questions ouvertes
  sur le flux d'import de fichier. Garder, généraliser ou supprimer.
- **Dropdown custom pour les selects inline** — ⏳ à faire : `accommodationTypeSelect` et
  `accommodationStatusSelect` ([inline-selects.js](js/views/accommodations/inline-selects.js)) sont
  des `<select>` natifs, dont les `<option>` n'affichent que du texte — impossible d'espacer
  l'emoji et le libellé. Les remplacer par un bouton + une liste en `div`, ce qui remplace aussi
  leurs `onchange`.

## Attractions

- **Créer la page** — ⏳ à faire : pas encore spécifiée (colonnes, place dans la barre latérale,
  rattachement à une étape ?).

## Browse

- **Créer la page** — ⏳ plus tard : des propositions d'hôtels dans la page, et des intégrations
  qui partent des villes déjà choisies — par exemple les villes des étapes d'un scénario. Sources
  et point d'entrée à préciser.

## Todo list de voyage

- **Créer la page** — ⏳ idée : une liste de choses à préparer / emporter, cochables. Tout reste à
  préciser : items libres ou modèle par défaut, rattachement à un scénario ou à une étape, place
  dans la barre latérale.

## Scénarios

- **Charges fixes** — ⏳ à faire
  - Bloc sous les étapes, **dans une autre couleur** que les étapes.
  - Une ligne par charge rattachée (libellé, montant, retirer).
  - « + Ajouter une charge » → ouvre la modale Charges fixes, puis rattache au scénario (donc
    alimente la table Charges fixes).
  - Un select pour rattacher une charge déjà existante.
- **Total général** — ⏳ à faire : hébergements + voiture + charges, en tête du récap, avec le
  détail par bloc.
- **Totaliser par étape, pas par hébergement** — ⏳ à faire : le récap somme aujourd'hui prix/nuit ×
  nuits par lieu, donc un budget saisi sur une étape n'entre pas dans le total.
- **Coût de la voiture × nuits** — ⏳ à trancher : [car-block.js:4](js/views/scenarios/detail/car-block.js#L4)
  multiplie le prix de la voiture par les nuits du scénario, contre la décision actée « pris tel
  quel, sans multiplication ». Corriger le code ou la décision — et le total s'affiche sans unité.
- **Deux dates par étape** — ⏳ à trancher : les dates se calculent depuis le départ du scénario
  ([step-dates.js](js/views/scenarios/step-dates.js)), mais le champ libre « arrivée le »
  (`arrivalDate`) reste dans la modale et s'affiche à côté
  ([step-card.js:88](js/views/scenarios/detail/step-card.js#L88)). Le retirer ou lui donner un rôle.
- **Bouton « + Ajouter une voiture »** — ⏳ à faire : ouvre la modale Voitures et rattache la
  nouvelle voiture au scénario.
- **Variables du scénario ou générales ?** — ⏳ à étudier

### Plus tard

- ajout type de transport entre étapes - à réfléchir
- Distance entre deux étapes.
- Estimation de l'essence.
- Estimation des péages.

## Toobar

- option pour afficher les textes dans les boutons ou non
- sauvegarder le choix dans le localStorage
- tous les boutons trier, display favorites deviennent icon-button, le view card/table devientun toggle-group je crois et ajouter juste icone +
- créer un bouton "trier"

## Transverse

- **Nommer les vues en anglais** — ⏳ à faire - pas grave : deux espaces de noms cohabitent, les vues en
  français (`hebergements`, `voitures`, `charges`, `villes` — clés de `view`, `listViewMode`,
  `COLUMN_SETS`, `prefs.sort`) et les données en anglais (`accommodations`, `cars`, `fixedCosts`,
  `cities` — clés de `state` et du Sheet). Renommer les vues sur les secondes aligne le tout ; les
  prefs stockées étant indexées par vue, les colonnes masquées et le tri repartent à zéro une fois.
- **Libellés de colonnes encore dans `<vue>.js`** — ⏳ à faire : `cityCoordsLabel` et
  `cityPlaceLabel` ([cities.js:9-17](js/views/cities/cities.js#L9-L17)) ne servent qu'à
  [cities/columns.js](js/views/cities/columns.js) et doivent y descendre.
- **Redécouper `accommodations.js`** — ⏳ à faire : 95 lignes à plat alors que
  `js/views/accommodations/` existe, et trois responsabilités dans le même fichier — le render, les
  filtres (`listFilters`, `tagFilterBlock`, `toggleTagFilter`, `toggleFavOnly`, tous lus par
  [header.js](js/views/accommodations/header.js)) et les setters (`setAccommodationType`/`Status` →
  [inline-selects.js](js/views/accommodations/inline-selects.js), `setAccommodationNotes` →
  [notes-editable.js](js/views/accommodations/notes-editable.js), `toggleFavorite` → card et
  columns).
- **Les actions des cartes sont triplées** — ⏳ à faire : la paire Modifier / Suppr. en
  `btn-ghost` / `btn-danger` est recopiée dans [accommodations/cards/card.js](js/views/accommodations/cards/card.js#L19),
  [cars/cards.js](js/views/cars/cards.js#L19) et [fixed-costs/cards.js](js/views/fixed-costs/cards.js#L17).
  Même besoin que [cells/actions/](js/views/cells/actions/), mais en boutons texte : une brique à
  part, pas un paramètre de plus sur `editButton` / `deleteButton`.
