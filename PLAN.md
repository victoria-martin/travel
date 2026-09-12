# À faire

Le backlog, rangé par page. Un item terminé **sort d'ici** et va décrire l'app dans
[docs/spec-voyage-toscane.md](docs/spec-voyage-toscane.md) : ce fichier n'archive pas ce qui est
fait, git s'en charge. Les arbitrages de fond sont dans « Décisions actées » de la spec.

## ✈️ Voyages

Le socle est en place : l'entité Voyage, le voyage ouvert dans les préférences locales, le
sélecteur et sa modale dans la barre latérale, et le `travelId` sur toutes les collections, Sheet
compris. Décrit dans [la spec](docs/spec-voyage-toscane.md). Ce qui reste :

- **Page Voyages** — ⏳ à faire : la liste des voyages en cartes (image, emoji, nom, destination,
  dates, statut), avec créer / modifier / dupliquer / supprimer. Sert d'écran d'accueil quand aucun
  voyage n'est ouvert. Tant qu'elle n'existe pas, le sélecteur de la barre latérale est le seul
  point d'entrée.
- **Place dans le site** — ⏳ à faire : `navBtn('voyages', '✈️', 'Voyages')` en tête de la barre
  latérale, avant Hébergements ([render.js:9](js/render.js#L9)), et `view = 'voyages'` comme vue
  initiale quand `currentTravelId` est vide. Le dossier
  [js/views/travels/](js/views/travels/) existe déjà : la page y ajoute `travels.js`, `header.js`
  et `cards.js`, et réutilise `modal/` et `get-travel.js` du sélecteur.
- **Ouvrir un voyage depuis une carte** — ⏳ à faire : un clic sur la carte appelle le même
  `setCurrentTravel()` que le menu du sélecteur ([current-travel.js](js/current-travel.js)) et
  bascule sur Hébergements. Le sélecteur reste, les deux points d'entrée partagent le même chemin.
- **Chiffres de la carte** — ⏳ à trancher : ce qu'une carte de voyage résume — nombre
  d'hébergements et de scénarios, budget du scénario retenu — et donc s'il faut un scénario
  « retenu » sur le voyage, ce qui n'existe pas aujourd'hui.
- **Supprimer un voyage** — ⏳ à faire : avec la page Voyages, puisque c'est de là qu'on supprime.
  Confirmation obligatoire, et les données rattachées partent avec.
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

## Charges fixes

- **Type de charge** — ⏳ à faire : un champ `type` à plusieurs valeurs, `budget total` (une enveloppe qu'on se donne) et `cost` (une dépense certaine), sur le modèle de
  [accommodation-types.js](js/accommodation-types.js).
- **Fourchette de prix** — ⏳ à faire : remplacer le montant unique par `amountMin` / `amountMax`.
  Reste à définir ce que vaut la charge dans un total quand la fourchette est incomplète — un seul
  des deux saisi, ou aucun.

## Attractions

- **Créer la page** — ⏳ à faire : place dans la barre latérale, colonnes, rattachement à une étape.
- **Modèle** — ⏳ à faire : nom, description, type, tags, favori, lien, statut.
- **`attractionTags`** — ⏳ à faire : libres et créables à la saisie, exactement comme les tags
  d'hébergement — la liste des options est l'union de ce qui est déjà utilisé
  ([tags.js:5](js/views/tags.js#L5)) — mais amorcée par une liste par défaut. Proposition :
  paysage, village, monument, musée, église, jardin, point de vue, plage, marché, thermes,
  randonnée, artisanat.
- **Une attraction peut-elle être une ville ?** — ⏳ à faire : Montefioralle est à la fois un village
  à visiter et un lieu d'étape. Trancher entre un tag `village` sur l'attraction, qui duplique la
  ville, et une attraction qui **référence** une ville existante par son id, comme une étape de
  scénario référence un hébergement.

## Restaurants

- **Restaurant ou attraction taguée ?** — ⏳ à faire : à trancher **avant** tout le reste de cette
  section, parce que tout en découle. Un restaurant a des champs qu'une attraction n'a pas
  (fourchette de prix, horaires, téléphone) — c'est l'argument pour une entité à part.
- **Créer l'entité** — ⏳ à faire : une collection `restaurants` dans `COLLECTIONS`
  ([Code.js:8](apps-script/Code.js#L8)) et dans `emptyData()` ([storage.js:17](js/storage.js#L17)),
  avec son `travelId`.
- **Créer la vue** — ⏳ à faire : `js/views/restaurants/`, en écrivant ses fichiers en clair comme
  Villes et Hébergements.
- **Modèle** — ⏳ à faire : nom, description, type, `restaurantTags`, favori, lien, hotelId, statut,
  fourchette de prix, horaires, téléphone.
- **`restaurantTags`** — ⏳ à faire : même design que les `attractionTags` ci-dessus — libres,
  créables à la saisie, amorcés par une liste par défaut. Proposition : trattoria, pizzeria,
  gastronomique, terrasse, vue, cave / dégustation, fromager, glacier, street food, végétarien.
- **Scraper un lien Google Maps** — ⏳ à faire : depuis le formulaire, remplir nom, adresse,
  coordonnées et horaires à partir d'une URL `maps.app.goo.gl`.

## Browse

- **Créer la page** — ⏳ plus tard : des propositions d'hôtels dans la page, et des intégrations
  qui partent des villes déjà choisies — par exemple les villes des étapes d'un scénario. Sources
  et point d'entrée à préciser.

## 🧳 Valise

La liste de ce qu'on emporte et de ce qu'on prépare, cochable. Remplace l'idée « Todo list de
voyage ». Tout est à trancher, rien n'est commencé.

- **Créer la page** — ⏳ idée : `navBtn('valise', '🧳', 'Valise')` dans la barre latérale, après
  Notes ([render.js:11](js/render.js#L11)), et `js/views/packing/` pour le domaine — un dossier par
  domaine, comme `cars/` ou `cities/`.
- **Entité `packingItems`** — ⏳ idée : une collection de plus dans `COLLECTIONS`
  ([Code.js:8](apps-script/Code.js#L8)) et dans `emptyData()` ([storage.js:17](js/storage.js#L17)),
  avec son `travelId` en première colonne comme les autres. Modèle proposé : libellé, catégorie,
  quantité, coché, `travelerId` plus tard, notes.
- **Catégories** — ⏳ à trancher : une liste figée sur le modèle d'
  [accommodation-types.js](js/accommodation-types.js) (vêtements, papiers, santé, électronique,
  bagage cabine, voiture, à faire avant de partir) ou des tags libres comme
  [tags.js:5](js/views/tags.js#L5). Les deux existent déjà dans l'app, il faut choisir lequel.
- **Modèle par défaut** — ⏳ à trancher : un bouton « Partir d'une liste type » qui crée les items
  d'un coup, versus une liste vide. Si modèle il y a, il vit à côté de la vue, comme
  [default-car.js](js/views/cars/default-car.js).
- **Cocher** — ⏳ idée : une case par ligne, écrite directement en base comme les inline-edits
  existants, et un compteur « 12 / 30 » dans l'en-tête.

### Intégration aux scénarios

- **Quantités déduites des nuits** — ⏳ à trancher : le scénario connaît déjà ses nuits
  ([nights.js](js/views/scenarios/nights.js)). Une quantité peut valoir « 1 par nuit » plutôt qu'un
  nombre fixe, et se recalculer quand le scénario retenu change. Suppose un scénario « retenu » sur
  le voyage — même prérequis que les chiffres des cartes Voyages.
- **Items rattachés à une étape** — ⏳ à trancher : un `stepId` optionnel sur l'item (maillot pour
  l'étape mer, chaussures de rando pour l'étape Chianti), sur le modèle d'une étape qui référence
  un hébergement. La page Valise les grouperait alors par étape, dans l'ordre du scénario.
- **Bloc « Valise » dans le détail d'un scénario** — ⏳ idée : sous les étapes, à côté du bloc
  Charges fixes, une ligne par catégorie avec son compteur et un lien vers la page. Lecture seule :
  on coche depuis la page Valise, pas depuis le scénario.
- **Ce qui dépend de la voiture** — ⏳ idée : le scénario porte déjà une voiture
  ([car-block.js](js/views/scenarios/detail/car-block.js)). Des items « coffre de toit », « siège
  enfant » n'ont de sens que s'il y a une voiture — à voir si la valise s'en sert ou si c'est une
  complication inutile.

## Villes

- **Rattacher les villes saisies au modèle existant** — ⏳ à faire : les villes ajoutées depuis les
  autres écrans doivent pointer sur une entrée de `cities`, pas créer un doublon de texte.

## Scénarios

- **Charges fixes** — ⏳ à faire
  - Bloc sous les étapes, **dans une autre couleur** que les étapes.
  - Une ligne par charge rattachée (libellé, montant, retirer).
  - « + Ajouter une charge » → ouvre la modale Charges fixes, puis rattache au scénario (donc
    alimente la table Charges fixes).
  - Un select pour rattacher une charge déjà existante.
  - Tant que `costIds` reste vide, la ligne « Charges fixes » du total général affiche 0 €.
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
- Vérifier flow gestion de la création de sheet à la 1ere utilisation, voir si on créé bien les données qd il faut, qd on créé le ficiher etc

## Toobar

- option pour afficher les textes dans les boutons ou non
- sauvegarder le choix dans le localStorage
- tous les boutons trier, display favorites deviennent icon-button, le view card/table devientun toggle-group je crois et ajouter juste icone +
- créer un bouton "trier"

## Transverse

- **Renommer `notes` en `userNotes`** — ⏳ à faire : sur toutes les entités, Sheet compris — donc
  une colonne renommée dans chaque liste de `COLLECTIONS` ([Code.js:8](apps-script/Code.js#L8)) et
  une migration dans `migrateData()` ([storage.js:39](js/storage.js#L39)).
- **Plusieurs versions du script `travel`** — ⏳ à faire : comprendre d'où viennent les déploiements
  multiples de l'Apps Script et n'en garder qu'un. Le dépôt ne porte qu'un
  [Code.js](apps-script/Code.js) : les versions vivent côté Google, dans l'historique de
  déploiement, pas ici.
- **Vérifier que le backend est documenté** — ⏳ à faire : l'en-tête de
  [Code.js](apps-script/Code.js#L1-L6) donne la procédure de déploiement ; confirmer qu'elle est
  à jour et reprise dans [docs/protocole-sync-sheet.md](docs/protocole-sync-sheet.md).
- **Archiver le Sheet dans une base de référence** — ⏳ à faire : un bouton qui pousse à la demande
  tout le contenu du Sheet dans une base plus large, commune à tous les voyages. C'est elle qui
  alimentera les suggestions.
- **Mode suggestion** — ⏳ à faire : à partir de cette base, un panneau qui propose hébergements,
  voitures, restaurants et attractions en lien avec le voyage en cours. Reste à décider s'il est
  toujours affiché ou repliable comme la carte d'un scénario. Remplace la page **Browse**, à
  renommer.
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

## Données à saisir

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
