# À faire

Le backlog, rangé par page. Un item terminé **sort d'ici** et va décrire l'app dans
[docs/spec-voyage-toscane.md](docs/spec-voyage-toscane.md) : ce fichier n'archive pas ce qui est
fait, git s'en charge. Les arbitrages de fond sont dans « Décisions actées » de la spec.

Chaque tâche s'écrit `- **Titre** <!--t:id--> — 🚧 en cours : …`. Le marqueur est l'identifiant
stable que le board (`pnpm plan`) relie à sa session Claude : le titre peut changer sans casser le
lien. Ne pas le retirer ni le recopier d'une tâche à l'autre. Les puces de « Données à saisir » n'en
portent pas — c'est du contenu à saisir, pas du travail à lancer.

Les statuts sont une liste figée, du premier jet à ce qui ne se fera pas — 💡 idée, 🤔 à trancher,
📌 acté, ⏳ à faire, 🚧 en cours, ⏸️ en attente, 🌙 plus tard, ✅ fait, 🚫 abandonné. Elle vit dans
[statuses.js](tools/plan-board/statuses.js) : en ajouter un se fait là, pas à la main ici.

## 💻 plan-tool

- **drag and drop** <!--t:yr9v--> — ⏳ à faire
  - ajouter un type layout
- **gerer scroll** <!--t:xwg8--> — 🧩 layout · ⏳ à faire : gerer scroll pr laisser le header qd on
  scroll
- **nouveau bouton dupliquer sur ligne :** <!--t:9870--> — 🏷️ feature · ⏳ à faire : ouvre le sheet
  et met mon focus dans l input pour le name
- **le style des boutons nouvelle section et nouvelle tache est pas fou joue plutot avec le hover stp, en mode edit de tache c est bien  et au lieu d'un bouton aouter et annuler en dessous mets un check et une X en fin de ligne stp** <!--t:nfpb--> — ✅ fait
- **liste de taches sans section + bouton** <!--t:9fd9--> — ⏳ à faire : au dessus de la liste des
  tâches, afficher une liste de tache pas liée à une section + bouton pour ajouter
- **le sortir du projet travel ?** <!--t:u4fp--> — 🌙 plus tard

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
- **Catégories** <!--t:fjcp--> — 🗃️ modèle · 🤔 à trancher : une liste figée sur le modèle d'
  [accommodation-types.js](js/accommodation-types.js) (vêtements, papiers, santé, électronique,
  bagage cabine, voiture, à faire avant de partir) ou des tags libres comme
  [tags.js:5](js/views/tags.js#L5). Les deux existent déjà dans l'app, il faut choisir lequel.
- **Modèle par défaut** <!--t:l13t--> — 🧩 ui · 🤔 à trancher : un bouton « Partir d'une liste
  type » qui crée les items d'un coup, versus une liste vide. Si modèle il y a, il vit à côté de la
  vue, comme [default-car.js](js/views/cars/default-car.js).
- **Cocher** <!--t:30rq--> — 🧩 ui · 💡 idée : une case par ligne, écrite directement en base comme
  les inline-edits existants, et un compteur « 12 / 30 » dans l'en-tête.

### Intégration aux scénarios

- **Quantités déduites des nuits** <!--t:19lc--> — 🧮 calcul · 🤔 à trancher : le scénario connaît
  déjà ses nuits ([nights.js](js/views/scenarios/nights.js)). Une quantité peut valoir « 1 par
  nuit » plutôt qu'un nombre fixe, et se recalculer quand le scénario retenu change. Suppose un
  scénario « retenu » sur le voyage — même prérequis que les chiffres des cartes Voyages.
- **Items rattachés à une étape** <!--t:q8pc--> — 🗃️ modèle · 🤔 à trancher : un `stepId` optionnel
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
- **Chiffres de la carte** <!--t:aqpf--> — 🗃️ modèle · 🧮 calcul · 🤔 à trancher : ce qu'une carte
  de voyage résume — nombre d'hébergements et de scénarios, budget du scénario retenu — et donc s'il
  faut un scénario « retenu » sur le voyage, ce qui n'existe pas aujourd'hui.
- **Supprimer un voyage** <!--t:kgci--> — 🧩 ui · 🗃️ modèle · 🌙 plus tard : avec la page Voyages,
  puisque c'est de là qu'on supprime. Confirmation obligatoire, et les données rattachées partent
  avec.
- **Voyageurs → coût par personne** <!--t:th4r--> — 🧮 calcul · ⏳ à faire : le récap d'un scénario
  affiche le total divisé par le nombre de voyageurs, à côté du total général.

## 🏠 Hébergements

- **Sort de l'import depuis un tableau** <!--t:sga5--> — 🧩 ui · 🔌 intégration · 🤔 à trancher : le
  bouton « Importer » n'est affiché que tant qu'aucun Sheet n'est connecté
  ([header.js:41](js/views/accommodations/header.js#L41)), et `openPasteImport()` reste commentée
  dans [paste-import.js](js/views/accommodations/modal/paste-import.js#L50) avec les questions
  ouvertes sur le flux d'import de fichier. Garder, généraliser ou supprimer.
- **Dropdown custom pour les selects inline** <!--t:kig5--> — 🧩 ui · ✅ fait : `accommodationTypeSelect`
  et `accommodationStatusSelect` ([inline-selects.js](js/views/accommodations/inline-selects.js))
  sont des `<select>` natifs, dont les `<option>` n'affichent que du texte — impossible d'espacer
  l'emoji et le libellé. Les remplacer par un bouton + une liste en `div`, ce qui remplace aussi
  leurs `onchange`.

## 💶 Charges fixes

- **Budget et prix** <!--t:w4qe--> — 🗃️ modèle · ⏳ à faire : applique la règle transverse « Budget
  et prix » — un `budget` optionnel, et le prix en `amountMin` / `amountMax`. Le champ `type`
  `budget total` / `cost` envisagé ici n'a plus lieu d'être : une charge sans prix saisi **est** une
  enveloppe, le dire deux fois ouvre la porte à la contradiction.
- **Fourchette incomplète** <!--t:hl47--> — 🧮 calcul · 🤔 à trancher : ce que vaut la charge dans
  un total quand un seul des deux montants est saisi.

## ✈️ Transports

Les trajets d'un voyage — avion, train, bus, ferry, voiture. Rien n'est commencé. La voiture garde
sa propre entrée de barre latérale : `cars` reste la table de location, et un transport de mode
voiture la **référence** plutôt que de la recopier.

- **Créer la page** <!--t:qfr9--> — 🖼️ écran · 💡 idée : `navBtn('transports', '✈️', 'Transports')`
  dans la barre latérale, après Voitures ([render.js:10](js/render.js#L10)), et
  `js/views/transports/` pour le domaine.
- **Entité `transports`** <!--t:9wxo--> — 🗃️ modèle · 💡 idée : une collection de plus dans
  `COLLECTIONS` ([Code.js:8](apps-script/Code.js#L8)) et dans `emptyData()`
  ([storage.js:17](js/storage.js#L17)), avec son `travelId` en première colonne. Modèle proposé :
  mode, départ, arrivée, date et heure de départ, date et heure d'arrivée, compagnie, numéro /
  référence de réservation, budget, `amountMin` / `amountMax`, lien, statut, favori, notes.
- **Modes** <!--t:hk8r--> — 🗃️ modèle · 🤔 à trancher : une liste figée sur le modèle d'
  [accommodation-types.js](js/accommodation-types.js) — ✈️ avion, 🚆 train, 🚌 bus, ⛴️ ferry, 🚗
  voiture. C'est le mode qui décide des champs utiles : un vol a une compagnie et un numéro, une
  voiture a un `carId`.
- **Départ et arrivée : des villes** <!--t:vn43--> — 🗃️ modèle · 🤔 à trancher : deux `cityId` qui
  pointent sur `cities`, comme une étape de scénario référence une ville, plutôt que deux champs
  texte. Un aéroport n'est pas une ville — à voir si on ajoute un champ libre à côté ou si on
  l'accepte tel quel.
- **Mode voiture → `carId`** <!--t:rsft--> — 🗃️ modèle · ⏳ à faire : un transport de mode voiture
  référence une entrée de `cars` ([get-car.js](js/views/cars/get-car.js)).
- **Budget et prix** <!--t:fi2n--> — 🗃️ modèle · ⏳ à faire : applique la règle transverse « Budget
  et prix » — un `budget` optionnel, et le prix en `amountMin` / `amountMax`.
- **Prix sur le transport** <!--t:4ojw--> — 🗃️ modèle · 📌 acté : `amountMin` / `amountMax` sur le
  transport lui-même, pour tous les modes, voiture comprise.
- **Prix dans le total d'un scénario** <!--t:8suc--> — 🧮 calcul · ⏳ à faire : les transports
  rattachés à un scénario s'ajoutent au récap ([recap.js](js/views/scenarios/detail/recap.js)), à
  côté des hébergements, de la voiture et des charges fixes, selon la règle transverse — prix s'il
  existe, budget sinon.

### Intégration aux scénarios

- **Un transport entre deux étapes** <!--t:u2p3--> — 🗃️ modèle · 🤔 à trancher (déplacé de « Scénarios / Plus tard ») : le
  trajet se lit entre deux étapes consécutives. Soit un `transportIds` sur le scénario, soit un
  `transportId` sur l'étape d'arrivée — à choisir avant d'écrire quoi que ce soit.
- **Affichage dans le détail** <!--t:2icu--> — 🧩 ui · 💡 idée : entre deux `step-card`
  ([step-list.js](js/views/scenarios/detail/step-list.js)), une ligne fine avec le mode, l'horaire
  et le prix. C'est le même emplacement que la distance et l'essence de « Plus tard ».
- **Aller-retour du voyage** <!--t:oujb--> — 🗃️ modèle · 🤔 à trancher : le vol aller et le vol
  retour encadrent le voyage entier, pas une étape. Soit deux transports sans étape rattachée, soit
  des étapes fictives de départ et de retour dans le scénario.

## 🎡 Attractions

La page existe : modèle, types, statuts, tags et tableau sont décrits dans
[la spec](docs/spec-voyage-toscane.md). Ce qui reste :

- **Rattachement à une étape** <!--t:f934--> — 🧩 ui · 🗃️ modèle · ⏳ à faire : une étape de
  scénario référence déjà une ville ou un hébergement
  ([step-place-dropdown.js](js/views/scenarios/detail/step-place-dropdown.js)) ; reste à décider si
  elle porte en plus une liste d'attractions, et ce que le détail du scénario en affiche.
- **Une attraction peut-elle être une ville ?** <!--t:4heo--> — 🗃️ modèle · 🤔 à trancher : Montefioralle
  est à la fois un village à visiter et un lieu d'étape. Trancher entre le tag `village` sur
  l'attraction, qui duplique la ville, et un `cityId` optionnel qui **référence** une ville
  existante, comme une étape de scénario référence un hébergement.
- **Tags éditables depuis le tableau** <!--t:r1em--> — 🧩 ui · ⏳ à faire : les hébergements éditent
  leurs tags sur place ([tags-cell.js](js/views/accommodations/table/tags-cell.js)), les attractions
  passent par la modale. Généraliser la cellule demande de lui passer son getter et son vocabulaire.
- **Attractions sur la carte** <!--t:4ehs--> — 🧩 ui · ⏳ à faire : elles portent des coordonnées
  mais [map.js](js/views/map.js) ne trace que les hébergements.
- **Type `Restaurant` 🍝** <!--t:s0ad--> — 🗃️ modèle · ⏳ à faire : un type de plus dans la liste
  figée, plus le vocabulaire de tags qui va avec — trattoria, pizzeria, gastronomique, terrasse,
  vue, cave / dégustation, fromager, glacier, street food, végétarien. Reste à décider si la liste
  amorcée dépend du type choisi ou si elle est commune à tous.
- **Prix, horaires, téléphone** <!--t:nvyg--> — 🗃️ modèle · ⏳ à faire : trois champs de plus sur
  l'attraction, pour **tous** les types — un musée a des horaires et un prix d'entrée autant qu'une
  trattoria.
- **Rattacher une attraction à un hébergement** <!--t:3cn1--> — 🗃️ modèle · ⏳ à faire : un
  `hotelId` optionnel, pour la table d'hôtes ou le restaurant de l'hôtel.
- **Scraper un lien Google Maps** <!--t:tr0w--> — 🔌 intégration · ⏳ à faire : depuis le formulaire,
  remplir nom, adresse, coordonnées et horaires à partir d'une URL `maps.app.goo.gl`.
- **Une page Restaurants ?** <!--t:eymt--> — 🖼️ écran · 🤔 à trancher : le type étant porté par
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

## 🗓️ Scénarios

- **Charges fixes** <!--t:ost1--> — 🧩 ui · ⏳ à faire
  - Bloc sous les étapes, **dans une autre couleur** que les étapes.
  - Une ligne par charge rattachée (libellé, montant, retirer).
  - « + Ajouter une charge » → ouvre la modale Charges fixes, puis rattache au scénario (donc
    alimente la table Charges fixes).
  - Un select pour rattacher une charge déjà existante.
  - Tant que `costIds` reste vide, la ligne « Charges fixes » du total général affiche 0 €.
- **Coût de la voiture × nuits** <!--t:q9vm--> — 🧮 calcul · 🐛 fix · 🤔 à trancher : [car-block.js:4](js/views/scenarios/detail/car-block.js#L4)
  multiplie le prix de la voiture par les nuits du scénario, contre la décision actée « pris tel
  quel, sans multiplication ». Corriger le code ou la décision — et le total s'affiche sans unité.
- **Deux dates par étape** <!--t:h4x6--> — 🗃️ modèle · 🐛 fix · 🤔 à trancher : les dates se
  calculent depuis le départ du scénario ([step-dates.js](js/views/scenarios/step-dates.js)), mais
  le champ libre « arrivée le » (`arrivalDate`) reste dans la modale et s'affiche à côté
  ([step-card.js:94](js/views/scenarios/detail/step-card.js#L94)). Le retirer ou lui donner un rôle.
- **Bouton « + Ajouter une voiture »** <!--t:tzp2--> — 🧩 ui · ⏳ à faire : ouvre la modale Voitures
  et rattache la nouvelle voiture au scénario.
- **Variables du scénario ou générales ?** <!--t:p11j--> — 🗃️ modèle · 🤔 à trancher

### Plus tard

- **Distance entre deux étapes** <!--t:mc15--> — 🧮 calcul · 🔌 intégration · ⏸️ en attente
- **Estimation de l'essence** <!--t:q7aw--> — 🧮 calcul · ⏸️ en attente
- **Estimation des péages** <!--t:dlde--> — 🧮 calcul · ⏸️ en attente

## 🧩 Transverse

- **Budget et prix** <!--t:u6zh--> — 🗃️ modèle · 📌 acté : partout où une entité coûte — charge
  fixe, transport, hébergement, voiture — deux notions distinctes et jamais un champ `type` pour les
  départager.
  - Le **budget** est l'enveloppe qu'on se donne : un champ, optionnel, saisi à la main.
  - Le **prix** est ce que ça coûte vraiment : `amountMin` / `amountMax`.
  - Dans un total : le prix s'il est connu, le budget sinon, et la ligne dit laquelle des deux est
    affichée. Une entité sans prix **est** une enveloppe — rien de plus à déclarer.
  - Les deux se saisissent et s'affichent pareil d'un écran à l'autre, donc les briques de
    formulaire et de cellule sont communes.

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
  cohabitent, les vues en français (`hebergements`, `voitures`, `charges`, `villes` — clés de
  `view`, `listViewMode`, `COLUMN_SETS`, `prefs.sort`) et les données en anglais (`accommodations`,
  `cars`, `fixedCosts`, `cities` — clés de `state` et du Sheet). Renommer les vues sur les secondes
  aligne le tout ; les prefs stockées étant indexées par vue, les colonnes masquées et le tri
  repartent à zéro une fois.
- **Redécouper `accommodations.js`** <!--t:p2ib--> — 🧹 refacto · ⏳ à faire : 95 lignes à plat alors
  que `js/views/accommodations/` existe, et trois responsabilités dans le même fichier — le render,
  les filtres (`listFilters`, `tagFilterBlock`, `toggleTagFilter`, `toggleFavOnly`, tous lus par
  [header.js](js/views/accommodations/header.js)) et les setters (`setAccommodationType`/`Status` →
  [inline-selects.js](js/views/accommodations/inline-selects.js), `setAccommodationNotes` →
  [notes-editable.js](js/views/accommodations/notes-editable.js), `toggleFavorite` → card et
  columns).

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

- **fix scroll in page** <!--t:epip--> — 🧩 layout · ⏳ à faire : make thinkgs sticky and other
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
