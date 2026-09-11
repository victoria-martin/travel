# Plan de travail

Suivi des lots en cours sur l'app. Mettre à jour l'état ici à chaque lot terminé.

## Décisions actées

- Le prix d'un hébergement est un prix **par nuit** → total d'un lieu = prix × nuits.
- Le prix d'une voiture et le montant d'une charge sont pris **tels quels**.
- Un scénario porte **une** voiture (`carId`) et **plusieurs** charges fixes (`costIds`), en
  référence aux tables `cars` et `fixedCosts` — jamais des copies.

## Lots

### 1. Nuits retirées de la ligne de détail d'une étape — ✅ fait

Sous le titre d'une étape : date d'arrivée et notes seulement. Le select à droite est la seule
source pour les nuits.

### 2. Total par lieu dans le récap — ✅ fait

Récap en 3 colonnes (lieu · nuits · total) + ligne « Total hébergements ».

### 3. Carte du scénario — ✅ fait

Bloc « Trajet » sous les étapes : marqueurs des étapes + tracé routier réel. Le tracé est partagé
avec la vue Carte ([scenario-map.js](js/views/scenarios/scenario-map.js)).

### 4. Voiture du scénario — ✅ fait (sans le bouton d'ajout)

Bloc « Voiture » : select des voitures de la table + coût. Reste à faire : bouton
**« + Ajouter une voiture »** qui ouvre la modale Voitures et rattache la nouvelle voiture au
scénario.

### 5. Charges fixes du scénario — ⏳ à faire

- Bloc sous les étapes, **dans une autre couleur** que les étapes.
- Une ligne par charge rattachée (libellé, montant, retirer).
- « + Ajouter une charge » → ouvre la modale Charges fixes, puis rattache au scénario (donc
  alimente la table Charges fixes).
- Un select pour rattacher une charge déjà existante.

### 6. Total général du scénario — ⏳ à faire

Hébergements + voiture + charges, en tête du récap, avec le détail par bloc.

### 7. Sheet + README — ✅ fait côté code

`COLLECTIONS.scenarios` = `id, name, carId, costIds, favorite` dans [Code.js](apps-script/Code.js).
👉 À pousser sur le déploiement existant (l'URL `/exec` ne change pas) :

```sh
pnpm run push-script
```

### 8. Carte à droite dans la page scénario — ✅ fait

Détail d'un scénario en 2 colonnes : étapes + voiture + récap à gauche, bloc « Trajet » dans une
colonne de droite sticky ([detail.js](js/views/scenarios/detail/detail.js)). Bouton
« Masquer / Afficher la carte » dans l'en-tête ; l'état vit dans `prefs.showScenarioMap`
([prefs.js](js/prefs.js)), donc il est retenu d'une session à l'autre. Sous 1100px, la carte
repasse sous les étapes.

### 9. Favori sur un scénario — ✅ fait

- Champ `favorite` sur le scénario, étoile cliquable dans la liste
  ([row.js](js/views/scenarios/list/row.js)) et dans l'en-tête du détail
  ([header.js](js/views/scenarios/detail/header.js)). Étoile partagée :
  [favorite-star.js](js/views/favorite-star.js).
- Les favoris remontent en tête de la liste.
- `COLLECTIONS.scenarios` gagne `favorite` → `pnpm run push-script` (cf. lot 7).

### Colonnes hébergement triables : type, statut, ville — ✅ fait

- Une colonne devient triable en déclarant `sortValue` dans son descripteur ; le tri, le cycle
  croissant → décroissant → aucun et l'en-tête cliquable vivent dans [columns.js](js/columns.js),
  donc n'importe quelle liste en profitera.
- `sortValue` posé sur type (libellé), statut (ordre du workflow `ACCOMMODATION_STATUSES`) et ville
  ([columns.js](js/views/accommodations/table/columns.js)).
- Tant qu'aucun tri n'est actif, la liste garde les favoris en tête ; un tri explicite prend le
  relais. Il n'est pas retenu d'une session à l'autre (`listSort` dans [data.js](js/data.js)).

### variables du scénario ou generales ? — ⏳ à étudier

### ajouter d autres valeurs possible pour status : Attente réponse, A booker, Interessé ? — ⏳ à faire

### ajouter une date de depart dans les scenarios

### Total sur la ligne d'une étape — ✅ fait

Au bout de la ligne, à droite du select de nuits : prix par nuit × nuits
([step-card.js](js/views/scenarios/detail/step-card.js), `stepCost` dans
[money.js](js/views/scenarios/money.js)). Rien d'affiché quand l'étape est rattachée à une ville
ou quand le total est nul — seul un hébergement porte un prix.

### dans les etapes; pouvoir mettre un budget sur une etape — ✅ fait

Champ `budget` sur l'étape, saisi à la main : rempli, il remplace le prix de l'hébergement dans le
total de la ligne (`stepCost` dans [money.js](js/views/scenarios/money.js)). Éditable en bout de
ligne, où le total calculé reste affiché en gris tant qu'aucun budget n'est saisi
([step-card.js](js/views/scenarios/detail/step-card.js)), et dans la modale de l'étape à côté de
Nuits. Toujours en euros, même sur une étape en GuestPoints. Le récap « Hébergements » reste
calculé par lieu (prix/nuit × nuits) : il n'intègre pas les budgets d'étape.

### on utilise pas tags pour pour les hebergements ? — ⏳ à étudier

## NTH

- **Nouvelle liste « Attractions »** — pas encore spécifiée (colonnes, place dans la barre
  latérale, rattachement à une étape ?).

## Problème ouvert

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
