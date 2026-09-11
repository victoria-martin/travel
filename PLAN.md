# Plan de travail

Suivi du travail sur l'app, rangé par page. Mettre à jour l'état ici à chaque lot terminé.

## Décisions actées

- Le prix d'un hébergement est un prix **par nuit** → total d'un lieu = prix × nuits.
- Le prix d'une voiture et le montant d'une charge sont pris **tels quels**.
- Un scénario porte **une** voiture (`carId`) et **plusieurs** charges fixes (`costIds`), en
  référence aux tables `cars` et `fixedCosts` — jamais des copies.
- Un home exchange se paie en GuestPoints : ces montants ne s'additionnent jamais aux euros.

---

# À faire

## Voitures

- **Valeur par défaut** — ⏳ à faire
- **Notes en champ modifiable** — ⏳ à faire : même édition en ligne que sur les hébergements.

## Attractions

- **Créer la page** — ⏳ à faire : pas encore spécifiée (colonnes, place dans la barre latérale,
  rattachement à une étape ?).

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

---

# Fait

## Hébergements

### Tags — ✅

Champ `tags` sur l'hébergement, tableau de chaînes. Pas de liste d'options à administrer : les
options proposées sont l'union des tags déjà saisis ([tags.js](js/views/tags.js)), donc un tag
existe dès qu'il est tapé quelque part et disparaît avec son dernier porteur.

- Saisie dans la modale : chips avec une croix, un champ en dessous, Entrée ou virgule ajoute, la
  `datalist` propose les tags existants ([tags-field.js](js/views/accommodations/modal/tags-field.js)).
  Le champ écrit dans `modal.payload` et ne repeint que son bloc, sinon les autres champs déjà
  saisis seraient perdus.
- Affichés en chips dans la colonne « Tags » de la table et sur les cartes.
- Filtre par tag dans le panneau « Trier & filtrer » de l'en-tête : un hébergement sort dès qu'il
  porte **un** des tags cochés. Le panneau de tri accueille un bloc de filtre passé par la liste
  ([sort.js](js/sort.js)) — il n'est affiché qu'en mode tableau, donc le filtre ne l'est pas non
  plus en mode cartes.
- Côté Sheet : colonne `tags` sur `accommodations`, rangée dans `LIST_FIELDS` (une cellule, valeurs
  séparées par des virgules) comme `costIds` ([Code.js](apps-script/Code.js)).
  👉 À pousser : `pnpm run push-script`

### Trois statuts de plus — ✅

Intéressé 👍, Attente réponse ⏳ et À booker 💳 s'ajoutent à `ACCOMMODATION_STATUSES`
([data.js](js/data.js)), qui pilote seule le select de la modale, le select en ligne et le tri de la
colonne Statut. Les statuts y sont rangés dans l'ordre du workflow (à voir → réservé, puis les deux
sorties pas dispo / écarté), c'est cet ordre que suit le tri.

### Province et région saisissables — ✅

Les deux champs, jusqu'ici cachés et remplis par la seule géolocalisation, sont visibles et
modifiables dans le bloc de localisation partagé par les modales hébergement et ville
([locate-fields.js](js/views/locate/locate-fields.js)). Chacun propose en `datalist` les valeurs
déjà présentes dans les hébergements et les villes, sans empêcher d'en saisir une nouvelle. Le
choix d'un résultat de géocodage écrase toujours les deux champs.

### Colonnes triables : type, statut, ville — ✅

- Une colonne devient triable en déclarant `sortValue` dans son descripteur. Tout le tri vit dans
  [sort.js](js/sort.js), à côté de [columns.js](js/columns.js) qui garde la visibilité des
  colonnes — donc n'importe quelle liste en profitera.
- Le tri est une liste ordonnée de critères : le premier qui sépare deux lignes l'emporte
  (« statut, puis ville »). Panneau **Trier** dans l'en-tête de la vue : un niveau par ligne,
  colonne + sens, ↑/↓ pour réordonner, ✕ pour retirer. Le clic sur un en-tête reste le raccourci
  — il remplace tout par un tri simple et cycle croissant → décroissant → aucun.
- `sortValue` posé sur type, statut et ville
  ([columns.js](js/views/accommodations/table/columns.js)). Type et statut se trient sur l'**ordre
  de leur map** dans [data.js](js/data.js) : réorganiser `ACCOMMODATION_TYPES` ou
  `ACCOMMODATION_STATUSES` change le tri.
- Les favoris sont un critère comme un autre : ⭐ se retire, se combine ou s'inverse comme les
  autres colonnes. Une colonne peut nommer ses deux sens via `sortLabels`.
- Le tri de départ est déclaré en liste ordonnée dans `SORT_DEFAULTS`, à côté du jeu de colonnes
  ([columns.js](js/views/accommodations/table/columns.js)) : favoris, puis type, puis statut. Il
  tient tant que le panneau n'a pas été touché.
- Les critères sont retenus d'une session à l'autre (`prefs.sort`, cf. [prefs.js](js/prefs.js)) ;
  une liste vide veut dire « aucun tri », la liste garde alors son ordre d'origine.

## Scénarios

### Nuits retirées de la ligne de détail d'une étape — ✅

Sous le titre d'une étape : date d'arrivée et notes seulement. Le select à droite est la seule
source pour les nuits.

### Total par lieu dans le récap — ✅

Récap en 3 colonnes (lieu · nuits · total) + ligne « Total hébergements ».

### Totaux séparés euros / GuestPoints — ✅

Les nuits en home exchange s'additionnent en GP sur leur propre ligne du récap, jamais avec les
euros ([money.js](js/views/scenarios/money.js), [recap.js](js/views/scenarios/detail/recap.js)).

### Total sur la ligne d'une étape — ✅

Au bout de la ligne, à droite du select de nuits : prix par nuit × nuits
([step-card.js](js/views/scenarios/detail/step-card.js), `stepCost` dans
[money.js](js/views/scenarios/money.js)). Rien d'affiché quand l'étape est rattachée à une ville
ou quand le total est nul — seul un hébergement porte un prix.

### Budget sur une étape — ✅

Champ `budget` sur l'étape, saisi à la main : rempli, il remplace le prix de l'hébergement dans le
total de la ligne (`stepCost` dans [money.js](js/views/scenarios/money.js)). Éditable en bout de
ligne, où le total calculé reste affiché en gris tant qu'aucun budget n'est saisi
([step-card.js](js/views/scenarios/detail/step-card.js)), et dans la modale de l'étape à côté de
Nuits. Toujours en euros, même sur une étape en GuestPoints.

### Carte du scénario — ✅

Bloc « Trajet » sous les étapes : marqueurs des étapes + tracé routier réel. Le tracé est partagé
avec la vue Carte ([scenario-map.js](js/views/scenarios/scenario-map.js)).

### Carte à droite dans la page scénario — ✅

Détail d'un scénario en 2 colonnes : étapes + voiture + récap à gauche, bloc « Trajet » dans une
colonne de droite sticky ([detail.js](js/views/scenarios/detail/detail.js)). Bouton
« Masquer / Afficher la carte » dans l'en-tête ; l'état vit dans `prefs.showScenarioMap`
([prefs.js](js/prefs.js)), donc il est retenu d'une session à l'autre. Sous 1100px, la carte
repasse sous les étapes.

### Voiture du scénario — ✅ (sans le bouton d'ajout)

Bloc « Voiture » : select des voitures de la table + coût.

### Favori sur un scénario — ✅

- Champ `favorite` sur le scénario, étoile cliquable dans la liste
  ([row.js](js/views/scenarios/list/row.js)) et dans l'en-tête du détail
  ([header.js](js/views/scenarios/detail/header.js)). Étoile partagée :
  [favorite-star.js](js/views/favorite-star.js).
- Les favoris remontent en tête de la liste.

## Notes

### Bloc-notes partagé — ✅

Onglet « Notes » : une zone de texte libre, stockée comme une collection d'une entrée
(`tripNotes`) pour passer par la fusion par id de [sync.js](js/sync.js)
([notes.js](js/views/notes.js)).

## Transverse

### Sheet + README — ✅ côté code

`COLLECTIONS` dans [Code.js](apps-script/Code.js) porte `scenarios` (`id, name, carId, costIds,
favorite`), la colonne `budget` des étapes et l'onglet `tripNotes`.
👉 À pousser sur le déploiement existant (l'URL `/exec` ne change pas) :

```sh
pnpm run push-script
```

---

# Problème ouvert

**Vue Hébergements cassée** (constatée le 10/09) : les noms affichent des valeurs de statut
(`toCheck`, `go`) et il ne reste que 3 colonnes. Deux causes distinctes, aucune liée aux lots
ci-dessus, et le redéploiement du Code.js ne les corrige pas :

1. Champs décalés d'un cran (`name` reçoit `status`) — hypothèse : l'en-tête de l'onglet
   `accommodations` du Sheet ne correspond plus aux valeurs des lignes (la lecture se fait par nom
   d'en-tête).
2. Colonnes masquées : `prefs.hiddenColumns.hebergements` dans le localStorage — à recocher dans
   « Colonnes ».

Diagnostic en attente, à lancer dans la console du navigateur :

```js
JSON.parse(localStorage.getItem('voyage-toscane-prefs'));
```

```js
JSON.parse(localStorage.getItem('voyage-toscane-local-data')).accommodations[0];
```
