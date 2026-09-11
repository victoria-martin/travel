# Blueprint — petite app collaborative, statique, base Google Sheet

Spec d'architecture réutilisable, extraite de l'app Voyage Toscane. Elle décrit un patron
complet : une app web statique, sans build ni serveur, dont la base de données partagée est un
Google Sheet. À reprendre telle quelle pour démarrer un autre projet — le domaine (voyage,
recrutement, inventaire, budget…) n'entre nulle part dans les règles ci-dessous.

Documents liés : [protocole de synchro](protocole-sync-sheet.md) · [spec produit d'exemple](spec-voyage-toscane.md)

---

## 1. Pour quel besoin

Le patron vise un cas précis :

- 2 à 10 personnes éditent **le même jeu de données**, sans compte ni permissions différenciées ;
- la donnée est tabulaire (des listes d'entrées) et tient dans quelques milliers de lignes ;
- personne ne veut administrer un serveur, une base, ni payer un hébergement ;
- il faut pouvoir **ouvrir la base à la main** comme un tableur, pour corriger en masse ou importer.

### Quand ne pas l'utiliser

- Donnée sensible : le Sheet est lisible par qui a l'URL du déploiement.
- Besoin de temps réel à la seconde, ou de verrous fins : la synchro est une réconciliation
  périodique, pas un flux.
- Plus de quelques milliers de lignes par onglet, ou des agrégats lourds : tout l'état transite en
  entier à chaque échange.
- Rôles, permissions, historique par utilisateur : rien de tout ça n'existe ici.

---

## 2. L'architecture en une page

```
        navigateur A                    navigateur B
   ┌─────────────────────┐         ┌─────────────────────┐
   │  index.html         │         │  index.html         │
   │  ├── state (RAM)    │         │  ├── state (RAM)    │
   │  ├── localStorage   │         │  ├── localStorage   │
   │  │   ├── données    │         │  │   ├── données    │
   │  │   ├── base sync  │         │  │   ├── base sync  │
   │  │   └── préférences│         │  │   └── préférences│
   └──────────┬──────────┘         └──────────┬──────────┘
              │  GET /exec  → {rev, data}     │
              │  POST /exec → push / conflit  │
              └───────────────┬───────────────┘
                     ┌────────┴─────────┐
                     │ Apps Script      │  un onglet par collection
                     │ (application web)│  une ligne par entrée
                     │   ↕              │  lecture par nom d'en-tête
                     │ Google Sheet     │
                     └──────────────────┘
```

Trois propriétés à retenir :

- **Le Sheet est la seule base.** L'app n'embarque aucune donnée : tant qu'aucune URL n'est
  renseignée, elle est vide et fonctionne quand même, en local.
- **localStorage est un cache, pas une base.** Il permet de travailler hors ligne ; ce qui a été
  modifié pendant la coupure repart à la reconnexion.
- **La fusion se fait entrée par entrée**, côté client, à partir du dernier état reçu du Sheet.
  Deux personnes qui éditent deux entrées différentes ne s'écrasent pas.

---

## 3. Les règles non négociables de la codebase

Ce sont elles qui rendent le reste cohérent. Les enfreindre casse le patron.

### Pas de build, pas de bundler, pas de modules ES

Chaque fichier est chargé tel quel par `index.html`, dans l'ordre déclaré. Les fonctions sont des
**globales**, et les boutons les appellent directement dans le HTML (`onclick="..."`).

> Conséquence pratique : **ajouter un fichier = ajouter une balise `<script src>`** dans
> `index.html`, avant le fichier de démarrage. Oublier cette ligne est l'erreur n°1 du patron.

Le fichier de démarrage (`js/init.js`) reste chargé en dernier : c'est le seul qui exécute du code
au chargement.

### Un seul état global, une seule fonction de sauvegarde

```js
let state = null; // { collectionA: [], collectionB: [], ... }
```

Chaque collection est un **tableau d'entrées portant un `id`** généré par `uid()`. Toute mutation
se termine par :

```js
saveNow(); // écrit le cache local + programme l'envoi au Sheet (débounce)
render(); // sauf si un champ a le focus — voir plus bas
```

Aucun chemin d'écriture ne contourne `saveNow()`.

### Le rendu est un re-render complet

`render()` réécrit la coquille (`#app`), puis la vue courante. Une vue est une fonction pure
`renderXxx() → string`. Pas de diff, pas de composant, pas d'état de rendu à maintenir.

Trois exceptions, toutes pour la même raison — **re-rendre arracherait le champ sous les doigts** :

| Cas                                            | Règle                                                                 |
| ---------------------------------------------- | --------------------------------------------------------------------- |
| Champ texte en cours de frappe (zone de notes) | on sauvegarde, on ne re-rend pas                                      |
| Édition en ligne (`contenteditable`)           | le blur sauvegarde ; les champs jumeaux sont resynchronisés à la main |
| Réponse de synchro qui ne change rien          | on compare avant/après et on ne re-rend que si l'état a bougé         |

Une modale ouverte bloque aussi le re-render venu d'une synchro.

### Tout ce qui est interpolé passe par `escapeHtml`

Le HTML est construit par concaténation de chaînes : c'est la seule barrière. Une valeur saisie par
un utilisateur qui arrive dans un template sans passer par là est un bug de sécurité, pas un
détail de style.

---

## 4. Modèle de données

- Une **collection** = un tableau d'objets plats. Pas de `Date`, pas de `Map`, pas d'objets
  imbriqués : tout doit tenir dans une cellule de tableur (voir le
  [protocole](protocole-sync-sheet.md) pour l'encodage des booléens, nombres et listes).
- Une **relation** se fait par identifiant (`carId`, `costIds`, `accommodationId`), **jamais par
  copie** de l'entrée liée.
- Une collection **imbriquée** (les étapes d'un scénario) vit dans son propre onglet, avec une
  colonne vers le parent ; elle est ré-imbriquée à la lecture.
- Un **singleton** (un bloc-notes partagé, un réglage global) se modélise comme une collection
  d'une seule entrée à `id` fixe : il profite gratuitement de la fusion par id.
- Les **migrations** sont une fonction `migrateData(data)` appliquée à la lecture — du cache local
  **comme** du Sheet. Elle ne fait que compléter des champs manquants ; elle n'est jamais
  conditionnée à un numéro de version.

Les valeurs à choix fermé (types, statuts) vivent dans une **map unique**, dont l'ordre de
déclaration est signifiant :

```js
const STATUSES = {
  todo: { label: 'À voir', emoji: '👀' },
  done: { label: 'Réservé', emoji: '🔒' },
};
```

Cette map pilote seule le select de la modale, le select en ligne du tableau **et** l'ordre de tri
de la colonne. Réordonner la map change le tri ; ajouter une entrée suffit à l'ajouter partout.

---

## 5. Listes déclaratives : colonnes, tri, filtres

Une liste ne code ni ses colonnes ni son tri : elle **déclare des descripteurs**.

```js
COLUMN_SETS.maListe = [
  { key: 'name', label: 'Nom', locked: true, cell: (item) => escapeHtml(item.name) },
  { key: 'status', label: 'Statut', cell: statusCell, sortValue: (item) => statusRank(item) },
  { key: 'notes', label: 'Notes', hiddenByDefault: true, cell: notesCell },
];
```

| Clé               | Effet                                                              |
| ----------------- | ------------------------------------------------------------------ |
| `cell`            | rend la cellule (obligatoire)                                      |
| `locked`          | colonne non masquable, absente du sélecteur                        |
| `hiddenByDefault` | masquée tant que l'utilisateur n'a pas touché au sélecteur         |
| `sortValue`       | rend la colonne triable — sa seule déclaration suffit              |
| `sortLabels`      | nomme les deux sens (« Favoris d'abord » plutôt que « Croissant ») |

Le sélecteur de colonnes, l'en-tête du tableau et le panneau de tri lisent **le même tableau**.
Écrire une nouvelle liste ne demande que ses descripteurs.

**Le tri est une liste ordonnée de critères** (`[{key, dir}]`) : le premier qui sépare deux lignes
l'emporte. Le clic sur un en-tête est un raccourci qui remplace tout par un tri simple et cycle
croissant → décroissant → aucun. `SORT_DEFAULTS[kind]` donne le tri de départ, valable tant que le
panneau n'a pas été ouvert ; une liste vide veut dire « aucun tri », et la liste garde alors son
ordre d'origine.

**Les filtres appartiennent à la liste, pas au panneau.** Le panneau de tri accepte un bloc
`{html, count}` fourni par l'appelante et l'affiche au-dessus des niveaux : le panneau possède le
tri, la liste possède ce sur quoi elle filtre.

---

## 6. Préférences ≠ données

Deux clés localStorage distinctes, et la frontière est stricte :

|         | Données            | Préférences                                                    |
| ------- | ------------------ | -------------------------------------------------------------- |
| Contenu | les collections    | colonnes masquées, tri, panneaux ouverts, bascules d'affichage |
| Partagé | oui, via le Sheet  | non, propre au navigateur                                      |
| Clé     | `<app>-local-data` | `<app>-prefs`                                                  |

La fusion reconstruit `state` **à partir des seules collections connues** : tout ce qui serait
rangé dedans par erreur disparaît à la première synchro. C'est le garde-fou qui impose la
séparation.

---

## 7. Services externes

Le patron n'a pas de serveur : tout service tiers est appelé soit depuis le navigateur, soit —
s'il n'a pas de CORS — **via l'Apps Script**, qui sert alors de proxy.

| Besoin               | Choix                                  | Contrainte à respecter                                                                                                            |
| -------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Fond de carte        | Leaflet via CDN + tuiles OpenStreetMap | attribution obligatoire                                                                                                           |
| Géocodage d'adresse  | Nominatim                              | 1 requête/seconde, pas de géocodage en masse : ne l'appeler que sur une action explicite, et **stocker le résultat** sur l'entrée |
| Itinéraire routier   | serveur de démo OSRM                   | sans clé mais sans garantie : mettre en cache par liste de points, prévoir l'échec                                                |
| Site tiers sans CORS | `GET /exec?param=…` sur l'Apps Script  | valider l'URL côté script, ne jamais relayer n'importe quoi                                                                       |

Règle générale : **un service externe qui échoue ne doit jamais bloquer la saisie.** Le géocodage
rate → les coordonnées restent saisissables à la main.

---

## 8. Outillage et déploiement

|                             |                                                                                                           |
| --------------------------- | --------------------------------------------------------------------------------------------------------- |
| Hébergement du front        | GitHub Pages, branche `main`, dossier racine                                                              |
| Backend                     | Apps Script déployé en application web (`Exécuter en tant que : moi`, `Qui a accès : tout le monde`)      |
| Source de vérité du backend | le fichier versionné dans `apps-script/`, **jamais** l'éditeur web                                        |
| Poussée du backend          | `clasp push -f` puis `clasp update-deployment <id>` — l'URL `/exec` ne change pas, personne ne reconnecte |
| Format                      | Prettier, une commande, aucune autre étape                                                                |

L'identifiant de déploiement est la partie secrète de l'URL : il vit dans un fichier **non
versionné** si le repo est public.

---

## 9. Démarrer un nouveau projet — checklist

1. Copier `index.html`, `styles.css`, `js/` (noyau : `data`, `storage`, `prefs`, `sync`,
   `render`, `escape-html`, `columns`, `sort`, `modals/`, `init`) et `apps-script/`.
2. Renommer les clés localStorage (`<app>-local-data`, `<app>-prefs`, `<app>-sync-url`,
   `<app>-sync-base`).
3. Remplacer les collections dans `emptyData()`, `mergeStates()`, `isEmptyState()` et
   `COLLECTIONS` du script — **les quatre listes doivent coïncider**.
4. Définir les maps de valeurs fermées (types, statuts) et les descripteurs de colonnes.
5. Écrire les vues : une fonction `renderXxx()` par onglet, branchée dans `renderMain()` et dans la
   barre latérale.
6. Déclarer chaque nouveau fichier dans `index.html`, avant `js/init.js`.
7. Déployer le script, connecter la première personne : le Sheet vide est amorcé tout seul.

---

## 10. Pièges déjà rencontrés

- **Lire les cellules par index de colonne.** Insérer une colonne décale toutes les lignes
  existantes d'un cran et corrompt la base — le champ `nom` reçoit le champ `statut`. Lire
  **par nom d'en-tête**, toujours. (Réparer coûte ensuite une fonction de rattrapage dédiée.)
- **Re-rendre pendant une saisie.** Le champ perd le focus et le curseur à chaque frappe.
- **Renvoyer une relecture du Sheet après une écriture.** L'écriture peut ne pas encore être
  visible : le client adopterait alors l'ancienne valeur. Renvoyer ce qu'on a écrit.
- **Un `POST` en `application/json`.** Il déclenche une requête de préflight qu'Apps Script ne
  gère pas. Envoyer en `text/plain`.
- **Ajouter un champ dans l'app sans l'ajouter dans `COLLECTIONS`.** Il vit en local, disparaît au
  premier aller-retour. C'est silencieux.
- **Ranger une préférence d'affichage dans les données.** Elle se retrouve partagée avec tout le
  monde, ou effacée à la synchro suivante.
