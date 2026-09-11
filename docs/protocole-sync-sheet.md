# Protocole de synchro — Google Sheet comme base partagée

Contrat complet entre une app statique et son backend Apps Script. Assez précis pour réimplémenter
l'un ou l'autre côté sans lire le code existant.

Référence d'implémentation : [js/sync.js](../js/sync.js) (client) et
[apps-script/Code.js](../apps-script/Code.js) (serveur).
Documents liés : [blueprint](blueprint-app-sheet.md) · [spec produit d'exemple](spec-voyage-toscane.md)

---

## 1. Transport

Un seul point d'entrée : l'URL `/exec` de l'application web Apps Script, déployée en
`Exécuter en tant que : moi` / `Qui a accès : tout le monde`.

### Lecture

```
GET <url>/exec          →  { rev, data }
```

`redirect: follow` est obligatoire côté client : Apps Script redirige vers un domaine de service.

### Écriture

```
POST <url>/exec
Content-Type: text/plain;charset=utf-8
{ "action": "push", "baseRev": "<rev reçue>", "data": { … } }

→  { rev, data }                        écriture acceptée
→  { conflict: true, rev, data }        le Sheet a bougé depuis baseRev
→  { error: "<message>" }               requête illisible ou action inconnue
```

**`Content-Type: text/plain` n'est pas un détail** : `application/json` déclenche une requête de
préflight `OPTIONS` qu'Apps Script ne sait pas traiter, et l'appel échoue.

### `rev`

Empreinte MD5 du JSON de l'état complet, recalculée à chaque lecture et à chaque écriture. Elle ne
sert qu'à une chose : détecter qu'un tiers a écrit entre la lecture et l'écriture. Elle n'est pas
un numéro de version et ne s'ordonne pas.

### Concurrence côté serveur

Le `doPost` prend un `LockService.getScriptLock()` (attente 25 s) autour de « relire `rev` →
comparer → écrire ». Sans ce verrou, deux `push` simultanés passent tous les deux la comparaison.

### Règle d'or de la réponse au push

Le serveur renvoie **ce qu'il vient d'écrire**, pas une relecture de l'onglet : une relecture
immédiate peut ne pas encore voir l'écriture, et le client adopterait alors l'ancienne valeur.

Côté client, symétriquement : **la réponse d'un push sert de nouvelle base, jamais à rafraîchir
l'écran.** Seul un `GET` apporte de la donnée venue d'ailleurs.

---

## 2. Le Sheet comme base

- **Un onglet par collection**, nommé exactement comme la collection.
- **Ligne 1 = les en-têtes**, figée, en gras. **Une ligne = une entrée.**
- L'onglet manquant est créé à la volée, avec ses en-têtes.
- Les colonnes attendues sont déclarées côté serveur, une liste par collection :

```js
const COLLECTIONS = {
  items: ['id', 'type', 'status', 'name', 'price', 'tags', 'favorite'],
  children: ['id', 'parentId', 'label', 'nights'],
};
```

### Lecture : par nom d'en-tête, jamais par index

Chaque cellule est retrouvée via `header.indexOf(colonne)`. C'est **la** règle qui protège la base :
ajouter ou déplacer une colonne ne décale pas les lignes déjà saisies. (Une implémentation par
index a déjà corrompu une base entière — chaque champ reçoit la valeur de son voisin.)

Par ailleurs, à la lecture :

- les lignes entièrement vides sont ignorées ;
- une entrée sans `id` en reçoit un — on peut donc coller des lignes à la main dans le Sheet ;
- une colonne inconnue de `COLLECTIONS` est ignorée, une colonne absente de l'onglet est lue vide.

### Écriture

L'onglet est réécrit en entier : en-têtes puis lignes. La plage écrite est passée en format texte
(`@`) — sans ça, Google transforme `21/09` en date et `42.899` en nombre arrondi. La largeur
effacée tient compte des anciennes colonnes, sinon une colonne retirée laisserait des cellules
orphelines à droite.

### Encodage des valeurs

Tout est texte dans une cellule. Trois listes déclarent le décodage :

| Déclaration        | Cellule                             | Valeur JS                          |
| ------------------ | ----------------------------------- | ---------------------------------- |
| `BOOL_FIELDS`      | `true` / `vrai` / `oui` / `1` / `x` | booléen                            |
| `NUM_FIELDS`       | `"3"`                               | entier (`0` si illisible)          |
| `LIST_FIELDS`      | `"a,b,c"`                           | tableau de chaînes, vides retirées |
| champs de relation | `""`                                | `null`                             |
| tout le reste      | texte                               | chaîne                             |

Les listes tiennent dans **une seule cellule**, séparées par des virgules : un tableau d'ids ou de
tags reste lisible et éditable à la main.

### Collections imbriquées

Une collection enfant vit dans **son propre onglet**, avec une colonne vers le parent :

- à l'écriture, les enfants sont aplatis et la colonne parent est remplie ;
- à la lecture, ils sont regroupés par parent et la colonne parent est retirée de l'objet rendu.

### Normalisation

Avant d'écrire, chaque entrée passe par l'encodage d'écriture **puis** le décodage de lecture. Le
client reçoit ainsi exactement ce qu'une relecture lui donnerait : pas de dérive entre ce qu'il
affiche et ce que le Sheet contient.

---

## 3. Fusion côté client

### Les trois états

|          | Rôle                                                        |
| -------- | ----------------------------------------------------------- |
| `remote` | ce que le Sheet vient de renvoyer                           |
| `local`  | l'état courant de l'app                                     |
| `base`   | le dernier état **reçu** du Sheet, conservé en localStorage |

`base` est ce qui permet de distinguer « ajouté ici » de « supprimé là-bas » : sans elle, aucune
suppression n'est propageable, et toute fusion dégénère en écrasement.

### Table de vérité, entrée par entrée (par `id`)

| présent dans `remote` | dans `local` | dans `base`              | résultat                                               |
| --------------------- | ------------ | ------------------------ | ------------------------------------------------------ |
| oui                   | non          | oui                      | **retirée** — supprimée ici depuis la dernière synchro |
| oui                   | non          | non                      | **prise** — ajoutée là-bas                             |
| oui                   | oui          | non                      | version locale                                         |
| oui                   | oui          | oui, identique au local  | version distante                                       |
| oui                   | oui          | oui, différente du local | version locale — dernier enregistrement gagnant        |
| non                   | oui          | oui                      | **retirée** — supprimée là-bas                         |
| non                   | oui          | non                      | **gardée** — ajoutée ici                               |

Conséquence à annoncer aux utilisateurs : **deux entrées différentes éditées en même temps sont
toutes deux conservées ; sur la même entrée, la dernière personne qui enregistre gagne.**

### Fusion d'une entrée à collection imbriquée

Le parent et ses enfants se fusionnent **séparément** : renommer un scénario chez l'un et déplacer
une étape chez l'autre doivent coexister. Les champs propres du parent suivent la table ci-dessus,
la collection d'enfants est fusionnée récursivement avec la même règle.

---

## 4. Cycle de vie

### Première connexion

```
GET → { rev, data }
├── Sheet vide, app non vide       → le Sheet est amorcé avec les données locales
├── les deux non vides, pas de base→ ⚠ on demande à l'utilisateur laquelle des deux
│                                     versions sert de point de départ
└── sinon                          → on adopte le Sheet (fusionné si une base existe)
```

Le choix ne se pose qu'**une fois**, à la connexion initiale : ensuite `base` existe et la fusion
tranche seule.

### Rythme

| Événement                                     | Effet                                                                   |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| toute modification                            | cache local immédiat + envoi programmé (débounce ~1,5 s)                |
| retour sur l'onglet / focus de la fenêtre     | lecture silencieuse, si aucune modale n'est ouverte                     |
| réponse identique à la base (`rev` inchangée) | rien, pas de re-render                                                  |
| conflit au push                               | fusion, puis **une seule** nouvelle tentative ; échec → erreur affichée |
| erreur réseau                                 | statut rouge et nouvel essai ~15 s plus tard                            |

Il n'y a **pas de scrutation périodique** : la lecture est déclenchée par le retour sur l'onglet.
Un rafraîchissement automatique se rajoute en une ligne (`setInterval`) si le besoin apparaît —
avec la même garde « pas pendant une modale ».

### Hors ligne

Tout continue en localStorage. Les envois échouent, le statut passe au rouge, et la fusion à la
reconnexion rattrape l'écart.

### États affichés

`off` (non connecté) · `pulling` / `pushing` · `ok` · `choice` (arbitrage demandé) · `error`
(message au survol). Un bouton d'état dans la barre latérale, cliquable, qui ouvre les réglages et
propose la déconnexion — la déconnexion laisse les données locales en place.

---

## 5. Ajouter un champ — la checklist

Un champ oublié quelque part disparaît **silencieusement** au premier aller-retour.

1. Le champ est écrit par l'app (formulaire, édition en ligne).
2. Il est ajouté à `COLLECTIONS[collection]` côté Apps Script.
3. S'il est booléen, numérique ou listé : l'ajouter à `BOOL_FIELDS` / `NUM_FIELDS` /
   `LIST_FIELDS`.
4. S'il doit exister sur les entrées déjà en base : le compléter dans la migration client.
5. Pousser le script sur le déploiement existant — l'URL `/exec` ne change pas.

Ajouter une **collection** demande en plus de la déclarer dans l'état vide, dans la fusion et dans
le test « état vide » côté client.

---

## 6. Limites assumées

- Pas d'authentification : qui a l'URL `/exec` lit et écrit tout.
- L'état complet transite à chaque échange — le patron plafonne à quelques milliers de lignes.
- Granularité de la fusion : l'entrée. Deux personnes sur **la même** entrée, la dernière gagne.
- Latence : le temps d'un aller-retour, déclenché au retour sur l'onglet.
- Les quotas Apps Script s'appliquent (temps d'exécution, nombre d'appels).
