# À faire

Le backlog, rangé par page. Un item terminé **sort d'ici** et va décrire l'app dans
[docs/spec-voyage-toscane.md](docs/spec-voyage-toscane.md) : ce fichier n'archive pas ce qui est
fait, git s'en charge. Les arbitrages de fond sont dans « Décisions actées » de la spec.

## Voyages

Le socle est en place : l'entité Voyage, le voyage ouvert dans les préférences locales, le
sélecteur et sa modale dans la barre latérale, et le `travelId` sur toutes les collections, Sheet
compris. Décrit dans [la spec](docs/spec-voyage-toscane.md). Ce qui reste :

- **Page Voyages** — ⏳ à faire : la liste des voyages en cartes (image, emoji, nom, destination,
  dates, statut), avec créer / modifier / dupliquer / supprimer. Sert d'écran d'accueil quand aucun
  voyage n'est ouvert. Tant qu'elle n'existe pas, le sélecteur de la barre latérale est le seul
  point d'entrée.
- **Supprimer un voyage** — ⏳ à faire : avec la page Voyages, puisque c'est de là qu'on supprime.
  Confirmation obligatoire, et les données rattachées partent avec.
- **Onglet du navigateur** — ⏳ à faire : le titre et la favicon suivent le voyage courant, la
  favicon étant l'emoji rendu en SVG `data:`.
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
