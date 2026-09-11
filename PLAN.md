# À faire

Le backlog, rangé par page. Un item terminé **sort d'ici** et va décrire l'app dans
[docs/spec-voyage-toscane.md](docs/spec-voyage-toscane.md) : ce fichier n'archive pas ce qui est
fait, git s'en charge. Les arbitrages de fond sont dans « Décisions actées » de la spec.

## Hébergements

- **Modale « Importer depuis un tableau » injoignable** — ⏳ à trancher : `openPasteImport()` est
  commentée ([paste-import.js](js/views/accommodations/modal/paste-import.js)) et rien n'appelle
  `openModal('paste-import')`, donc aucun geste de l'app n'ouvre le formulaire — qui reste chargé
  et enregistré dans [modal.js](js/modals/modal.js). À rebrancher sur un bouton ou à supprimer.

## Attractions

- **Créer la page** — ⏳ à faire : pas encore spécifiée (colonnes, place dans la barre latérale,
  rattachement à une étape ?).

## Browse

- **Créer la page** — ⏳ plus tard : des propositions d'hôtels dans la page, et des intégrations
  qui partent des villes déjà choisies — par exemple les villes des étapes d'un scénario. Sources
  et point d'entrée à préciser.

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
- **Date de départ du scénario** — ⏳ à faire
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
- **`scenarios/list/` et `list/` portent le même nom** — ⏳ à trancher : l'un est la liste des
  scénarios, l'autre le mécanisme générique de liste.
- **La structure des fichiers du README est périmée** — ⏳ à faire : le bloc de
  [README.md](README.md#L17) liste `data.js`, `helpers.js` et `simple-lists.js`, tous disparus.
- **Découpage de `data.js`** — 🚧 en cours : un fichier par sujet
  ([accommodation-types.js](js/accommodation-types.js),
  [accommodation-statuses.js](js/accommodation-statuses.js), [uid.js](js/uid.js),
  [state.js](js/state.js)), et le reste de l'état posé auprès de son seul consommateur — les nuits
  dans [nights.js](js/views/scenarios/nights.js), `LOCAL_KEY` dans [storage.js](js/storage.js),
  les filtres de la carte dans [map.js](js/views/map.js).
