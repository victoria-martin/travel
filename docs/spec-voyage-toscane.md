# Spec produit — Carnet de voyages

Spec fonctionnelle de l'app, écrite comme exemple de format : **décisions actées** en tête,
**modèle de données** ensuite, puis **un bloc par écran** qui dit ce qu'on voit, ce qu'on peut
faire et les règles qui ne se devinent pas. Le backlog ne vit pas ici mais dans
[PLAN.md](../PLAN.md), pour que la spec reste la description de ce qui existe.

Documents liés : [blueprint réutilisable](blueprint-app-sheet.md) · [protocole de synchro](protocole-sync-sheet.md)

---

## 1. Objectif

Préparer ses voyages à plusieurs : pour chacun, rassembler des hébergements candidats, les situer
sur une carte, et **comparer plusieurs itinéraires chiffrés** avant de réserver quoi que ce soit.

- **Plusieurs voyages** cohabitent dans la même app. On en ouvre un, et tous les écrans ne montrent
  que ses données.
- **Utilisateurs** : deux à quelques personnes, toutes avec les mêmes droits, chacune sur son
  navigateur. Pas de compte, pas de rôle.
- **Ce que l'app n'est pas** : ni un moteur de réservation, ni un agrégateur d'offres. Tout est
  saisi ou collé à la main ; les liens externes restent des liens.

---

## 2. Décisions actées

Les arbitrages qui ne se relisent pas dans le code, et dont tout le reste découle :

- Le prix d'un hébergement est un prix **par nuit** → total d'un lieu = prix × nuits.
- Le montant d'une charge fixe est pris **tel quel**, sans multiplication. Le coût d'une voiture
  dans un scénario est son prix **multiplié par les nuits** du scénario — cf. [PLAN.md](../PLAN.md),
  cette règle contredit la décision d'origine et reste à trancher.
- Un scénario porte **une** voiture et **plusieurs** charges fixes, **en référence** aux tables
  Voitures et Charges fixes — jamais des copies.
- Un home exchange se paie en **GuestPoints** : ces montants ne s'additionnent **jamais** aux
  euros. Ils ont leur propre ligne de total.
- Un prix se saisit en texte libre (`120`, `1 200,50 €`) : seul le nombre est extrait pour les
  calculs, l'affichage garde la saisie.
- **Une dépense se corrige à sa source** : la page Dépenses lit les montants portés par les autres
  entités — un hébergement réservé, la voiture par défaut — et ne les édite jamais. Seules les
  charges fixes se saisissent là, parce qu'elles n'ont pas d'autre page. D'où les deux blocs,
  Calculé et Saisi, plutôt qu'une liste unique où l'origine d'une ligne serait invisible.
- Un budget saisi sur une étape **remplace** le prix calculé de l'hébergement, et reste en euros
  même sur une étape en GuestPoints.
- Les dates des étapes se **calculent** depuis la date de départ du scénario et les nuits qui
  précèdent : elles ne se saisissent pas.
- **Une étape masquée ne compte nulle part** : ni dates, ni nuits, ni totaux, ni carte, ni récap, ni
  nombre d'étapes. C'est une variante mise de côté, gardée sous la main plutôt que supprimée. Seule
  la liste du détail la montre, grisée. Conséquence : partout ailleurs, le rang d'une étape est son
  rang **parmi les visibles** — masquer la deuxième fait passer C en B, et décale les dates.
- **Tous les voyages tiennent dans le même Sheet**, chaque entrée portant une colonne `travelId`,
  placée en première colonne de chaque onglet pour trier et filtrer d'un coup d'œil — y compris sur
  l'onglet `steps`, où elle est recopiée depuis le scénario parent.
  Un classeur par voyage a été écarté : l'Apps Script travaille sur `getActiveSpreadsheet()`, donc
  il aurait fallu dupliquer le classeur et redéployer le script à la main à chaque nouveau voyage.
- **Aucune reprise automatique des entrées orphelines** : une entrée sans `travelId`, ou qui en
  porte un que la liste des voyages ne contient pas, n'apparaît simplement dans aucun voyage. L'app
  n'invente jamais de voyage pour les accueillir — une réponse du Sheet à laquelle il manque
  l'onglet `travels` ou la colonne `travelId` créait sinon un voyage fantôme qui repartait dans la
  synchro et détournait les entrées des autres.
- **Un restaurant est une attraction**, d'un type de plus — pas une entité à part. Les champs qu'on
  croyait lui appartenir (fourchette de prix, horaires, téléphone) valent aussi pour un musée ou une
  dégustation : ils sont portés par l'attraction, quel que soit son type. Une collection séparée
  aurait obligé à fusionner deux tables à la main dès qu'un écran veut montrer les deux — carte,
  suggestions, rattachement à une étape — alors qu'ici une page Restaurants n'est qu'un filtre.

---

## 3. Modèle

| Entité              | Porte                                                                                                                                                    | Notes                                                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Voyage**          | nom, emoji, image, description, statut, dates de début et de fin, destination (pays / région), couleur d'accent, voyageurs                               | possède tout le reste ; un seul est ouvert à la fois            |
| **Hébergement**     | type, statut, nom, adresse, ville, province, région, coordonnées, prix/nuit, dates, lien, lien de réservation, notes, tags, favori                       | la fiche de référence ; c'est elle qui porte le prix            |
| **Ville**           | nom, adresse géocodée, coordonnées, province, région, notes                                                                                              | une étape de passage sans nuit, ou un repère                    |
| **Attraction**      | nom, type, statut, description, adresse géocodée, coordonnées, province, région, lien, tags, favori                                                      | un lieu à visiter ; localisée comme une ville                   |
| **Transport**       | mode, statut, départ et arrivée (ville + précision libre), dates et heures, compagnie, référence, voiture, budget, prix mini / maxi, lien, notes, favori | un trajet du voyage ; en mode voiture il référence une location |
| **Voiture**         | loueur, modèle, prix / jour, prix total, dates, lieu de prise en charge, lien, notes, **par défaut**                                                     | liste simple ; une seule voiture par défaut                     |
| **Charge fixe**     | libellé, montant, catégorie, récurrence, notes                                                                                                           | liste simple                                                    |
| **Scénario**        | nom, favori, date de départ, voiture, charges, **étapes**                                                                                                | un itinéraire candidat                                          |
| **Étape**           | lieu (une ville **ou** un hébergement), nuits, budget, notes, date d'arrivée libre, masquée                                                              | appartient à un scénario, l'ordre compte                        |
| **Notes de voyage** | texte libre                                                                                                                                              | un bloc par voyage                                              |

**Statut d'un voyage**, dans l'ordre du workflow : Idée 💭 · En préparation 🧭 · Réservé 🔒 ·
En cours ✈️ · Passé 📦.

**Type d'hébergement** — Home exchange 🔁 · Hôtel 🏨 · Maison 🏡 · Camping ⛺.
**Statuts**, dans l'ordre du workflow, qui est aussi l'ordre de tri : Réservé 🔒 · Contacté ✉️ ·
Attente réponse ⏳ · À booker 💳 · Go ✅ · Intéressé 👍 · À voir 👀 · Pas dispo 🚫 · Écarté 👎.

**Mode de transport** — Avion ✈️ · Train 🚆 · Bus 🚌 · Ferry ⛴️ · Voiture 🚗. C'est le mode qui
décide des champs utiles : les quatre premiers portent une compagnie et une référence de
réservation, la voiture référence une entrée de la table des locations.
**Statuts d'un transport**, dans l'ordre du workflow et du tri : Réservé 🔒 · À réserver 💳 ·
Go ✅ · À voir 👀 · Écarté 👎.

**Type d'attraction** — Nature 🌿 · Patrimoine 🏛️ · Musée 🖼️ · Village 🏘️ · Plage 🏖️ ·
Activité 🎟️.
**Statuts d'une attraction**, dans l'ordre du workflow et du tri : À voir 👀 · Go ✅ · Vu ☑️ ·
Écarté 👎. Les statuts d'hébergement ne s'appliquent pas : on ne réserve pas un point de vue.

Les deux champs peuvent rester vides : « Non renseigné ❔ » est l'état d'un hébergement créé ou
importé sans choix explicite. Il s'affiche tel quel partout — tag de la ligne, popup de la carte,
filtre de type — et se trie **après** toutes les valeurs connues.

> Les deux listes vivent dans une map unique qui pilote à la fois les selects, les couleurs de la
> carte et l'ordre de tri de leur colonne. Les réordonner change le tri.

---

## 4. Les écrans

### Voyage courant

En tête de la barre latérale, un bouton **emoji + nom + sous-titre** (les dates si elles sont
saisies, sinon la destination) ouvre le menu des voyages : les autres voyages, « Modifier ce
voyage » et « Nouveau voyage ». Les deux derniers ouvrent la même modale. En barre latérale
réduite, il ne reste que l'emoji.

La **couleur d'accent** du voyage ouvert remplace les deux verts structurants du thème — barre
latérale, boutons, états actifs. Sans couleur choisie, l'app garde les siens.

L'**onglet du navigateur** suit lui aussi le voyage : son nom en titre, son emoji en favicon, rendu
en SVG `data:` sans fichier. Ouverte en local — fichier, `localhost` ou `127.0.0.1` —, la favicon
porte en plus une **pastille orange** cerclée de blanc : d'un coup d'œil dans la liste des onglets,
on sait si on regarde sa copie de travail ou la prod GitHub Pages.

Créer un voyage l'ouvre aussitôt. Tant qu'il n'y en a aucun, le bouton affiche « Aucun voyage » et
le menu ne propose que la création.

**Voyage** — les champs de la modale : pays, région, dates de début et de fin, statut, nombre de
voyageurs, couleur d'accent (une palette fermée, ou aucune), image, description. En-tête de la
modale : l'emoji dans une pastille teintée, le titre et la destination. Le nom et l'emoji n'ont pas
de champ à eux — le titre de l'en-tête s'édite en place, et la pastille ouvre un menu de
suggestions d'emoji doublé d'un champ de collage, qui reste la valeur retenue. La couleur choisie
tient toute la modale — papier et bordure teintés, bouton Enregistrer — et suit le clic sur les
pastilles, avant même l'enregistrement.

### Hébergements

**Hébergement** — la fiche de référence ; c'est elle qui porte le prix.

| Champ                     | Détail                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| type                      | Home exchange · Hôtel · Maison · Camping, ou non renseigné                                      |
| statut                    | les neuf statuts du workflow, ou non renseigné                                                  |
| nom                       |                                                                                                 |
| adresse                   | saisie libre, c'est elle qu'on géocode                                                          |
| adresse géocodée          | écrite par « Localiser »                                                                        |
| ville · province · région | proposées par le géocodage, modifiables à la main                                               |
| coordonnées               | latitude, longitude                                                                             |
| prix/nuit                 | texte libre, éditable depuis la ligne et la carte ; en GuestPoints si le type est Home exchange |
| dates                     | texte libre (« 12–14 juin »)                                                                    |
| lien                      | l'annonce ; un lien HomeExchange collé pré-remplit la fiche                                     |
| lien de réservation       | Booking ; un lien collé pré-remplit la fiche                                                    |
| notes                     | éditables depuis la ligne                                                                       |
| tags                      | liste libre, sans administration                                                                |
| favori                    | ⭐, et un critère de tri                                                                        |

La vue principale, en **tableau ou en cartes**.

- **Colonnes** : favori, nom (+ notes en dessous), type, statut, ville, province, région, tags,
  adresse, prix, dates, notes, lien, Booking, actions. Région, adresse et notes sont masquées par
  défaut ; nom, favori et actions ne sont jamais masquables. Le sélecteur « Colonnes » garde le
  choix d'une session à l'autre.
- **Tri** — panneau « Trier » : une liste ordonnée de critères (« statut, puis ville »),
  chacun avec son sens, réordonnable. Le clic sur un en-tête est le raccourci : il remplace tout
  par un tri simple et cycle croissant → décroissant → aucun. Tri de départ : favoris, puis type,
  puis statut. Les favoris sont un critère comme un autre.
- **Filtres** : ⭐ favoris uniquement — un bouton à part, toujours visible — et par tag dans le
  panneau « Filtrer », un hébergement sortant dès qu'il porte **un** des tags cochés.
- **Édition en ligne** : type, statut, prix et notes se changent directement dans la ligne comme
  dans la carte, sans ouvrir la fiche. Le prix garde sa monnaie (€ ou GP) affichée à côté du champ.
- **Tags** : aucune liste d'options à administrer. Les options proposées sont l'union des tags déjà
  saisis — un tag existe dès qu'il est tapé quelque part, et disparaît avec son dernier porteur.
  Un tag coché puis disparu est retiré du filtre tout seul.
- **Créer / modifier** : une modale. L'adresse se géocode sur clic du bouton « Localiser », qui
  propose des résultats ; le choix d'un résultat écrase ville, province, région et coordonnées.
  Ville, province et région restent saisissables à la main, avec les valeurs déjà présentes en
  suggestion.
- **Import d'un lien HomeExchange** : coller le lien dans le champ pré-remplit type, nom,
  GuestPoints/nuit, ville, province et région — **seuls les champs vides**, jamais une saisie déjà
  faite. Nécessite la synchro configurée : la page est lue par l'Apps Script, le navigateur ne peut
  pas la lire lui-même.
- **Import d'un lien Booking** : coller le lien dans le champ « Lien Booking » pré-remplit nom,
  type, prix, adresse (fiche et champ à géocoder), ville et région — **seuls les champs vides**,
  comme pour HomeExchange, et même dépendance à la synchro. Le nom et l'adresse viennent du JSON-LD
  de la page, le prix du bloc `data-testid` — il n'existe que si le lien porte des dates.
- **Import depuis un tableau** : coller des lignes copiées d'un tableur crée les hébergements
  correspondants ; type et statut sont reconnus depuis le texte, sinon laissés non renseignés. Le bouton
  « Importer » n'apparaît que **tant qu'aucun Sheet n'est connecté** — la synchro est ensuite la voie
  d'entrée des lignes.

### Villes

**Ville** — une étape de passage sans nuit, ou un repère.

| Champ            | Détail                                            |
| ---------------- | ------------------------------------------------- |
| nom              |                                                   |
| adresse géocodée | écrite par « Localiser »                          |
| coordonnées      | latitude, longitude                               |
| province, région | proposées par le géocodage, modifiables à la main |
| notes            |                                                   |

Liste triée par nom : nom, lieu (adresse géocodée, ou province · région), coordonnées, notes. Même
bloc de localisation que les hébergements. Sert à poser une étape de passage sans nuitée.

### Attractions

**Attraction** — un lieu à visiter.

| Champ            | Détail                                             |
| ---------------- | -------------------------------------------------- |
| nom              |                                                    |
| type             | liste figée, comme le type d'un hébergement        |
| statut           | liste propre, courte                               |
| description      | texte libre                                        |
| adresse géocodée | écrite par « Localiser »                           |
| coordonnées      | latitude, longitude                                |
| province, région | proposées par le géocodage, modifiables à la main  |
| lien             |                                                    |
| tags             | texte libre, amorcés par un vocabulaire par défaut |
| favori           | étoile en tête de ligne                            |

Tableau seul, pas de vue en cartes. Colonnes : favori, nom, type, statut, tags, description, lieu
(adresse géocodée, ou province · région), coordonnées (masquées par défaut), lien. Tri par défaut
favoris d'abord, puis type, puis nom. Même bloc de localisation que les villes et les hébergements.

- **Type et statut s'éditent depuis la ligne**, par le même dropdown inline que les hébergements.
- **Tags** : mêmes tags libres que les hébergements — un tag existe dès qu'il est saisi — mais la
  liste proposée est amorcée par un vocabulaire par défaut (paysage, village, marché, monument,
  musée, église, jardin, point de vue, plage, thermes, randonnée, artisanat), pour qu'une première
  attraction ait déjà quelque chose à choisir. Ils se saisissent depuis la modale ; le tableau les
  affiche sans les éditer.

### Transports

**Transport** — un trajet du voyage.

| Champ                | Détail                                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| mode                 | liste figée ; décide des champs utiles                                                                         |
| statut               | liste propre, courte                                                                                           |
| départ, arrivée      | une ville de la table Villes, plus une précision libre à côté                                                  |
| dates et heures      | date et heure de départ, date et heure d'arrivée                                                               |
| compagnie, référence | pour l'avion, le train, le bus et le ferry                                                                     |
| voiture              | en mode voiture seulement : référence une entrée de la table Voitures, dont le loueur et le modèle s'affichent |
| budget, prix         | l'enveloppe, et la fourchette réelle `prix mini` / `prix maxi`                                                 |
| lien                 |                                                                                                                |
| notes                |                                                                                                                |
| favori               | étoile en tête de ligne                                                                                        |

Tableau seul, pas de vue en cartes. Colonnes : favori, mode, départ, arrivée, part le, arrive le
(masquée par défaut), compagnie / loueur, prix, statut, lien, notes (masquée par défaut). Tri par
défaut par date de départ, puis par mode.

- **Mode et statut s'éditent depuis la ligne**, par le même dropdown inline que les hébergements.
- **Un aéroport n'est pas une ville** : le départ et l'arrivée pointent sur une ville de la table
  Villes, et la précision (« Aéroport de Pise », « Santa Maria Novella ») se saisit dans un champ
  libre à côté. Le tableau affiche la ville, la précision en dessous.
- **La voiture se référence, jamais ne se recopie** : un transport de mode voiture pointe sur une
  entrée de la table des locations. Le loueur y tient la place de la compagnie et le modèle celle de
  la référence — la colonne affiche « Hertz » avec « Fiat 500 » en dessous, comme elle affiche
  « Trenitalia » avec son numéro de billet. Changer de mode dans la modale échange le bloc compagnie
  et le bloc loueur ; la valeur de l'autre mode reste enregistrée et n'est pas effacée.
- **Un transport de mode voiture porte quand même son prix** : la location et le trajet sont deux
  coûts distincts — le prix de la location vit sur la voiture, celui du trajet (péages, essence, un
  aller ponctuel) sur le transport. Le transport ne lit jamais le prix de la location.

### Voitures

**Voiture**

| Champ                   | Détail                                                          |
| ----------------------- | --------------------------------------------------------------- |
| loueur, modèle          | les deux forment le libellé « loueur · modèle »                 |
| prix / jour             | texte libre ; c'est lui que le scénario multiplie par les nuits |
| prix total              | texte libre ; saisi à la main, jamais calculé                   |
| dates                   | texte libre                                                     |
| lieu de prise en charge |                                                                 |
| lien                    |                                                                 |
| notes                   | éditables depuis la ligne                                       |
| par défaut              | une seule voiture à la fois                                     |

Liste simple : tableau ou cartes, ajout/modification en modale, suppression confirmée. Aucune
colonne masquable, aucun tri configurable — le besoin ne s'est pas présenté.

- **Notes éditables en ligne**, comme sur les hébergements : sous le libellé dans le tableau, sur la
  ligne 📝 des cartes.
- **Voiture par défaut** : un rond ◉ en tête de ligne. Une seule voiture à la fois — la marquer
  démarque les autres, la re-cliquer n'en laisse aucune.
- Le **lien** d'une voiture s'ouvre depuis la ligne (« Voir ») ou depuis sa carte (« Lien »).

### Dépenses

Ce que le voyage coûte, en deux blocs : **Calculé**, lu sur les autres pages, et **Saisi**, tapé
ici. Un récap ferme l'écran avec les deux sous-totaux et leur somme.

**Calculé** — une dépense dérivée se lit sur l'entité qui la porte, elle ne se saisit pas ici. Un
groupe par source, dont le titre mène à la page où la corriger :

| Source                | Ce qu'elle apporte                             |
| --------------------- | ---------------------------------------------- |
| Hébergements réservés | une ligne par hébergement au statut Réservé 🔒 |
| Voiture par défaut    | la voiture marquée ◉, si elle en porte une     |

Une source sans montant ferme — un prix par nuit, un prix par jour — s'affiche avec son unité
(« 120 € / nuit ») et reste **hors du total** tant que rien ne dit sur combien la multiplier. Une
source sans aucune ligne ne s'affiche pas ; les deux vides donnent un message d'état vide.

**Saisi** — la liste des charges fixes : tableau ou cartes, ajout et modification en modale,
suppression confirmée, tri et colonnes configurables depuis l'en-tête.

**Charge fixe**

| Champ      | Détail                     |
| ---------- | -------------------------- |
| libellé    |                            |
| montant    | texte libre, pris tel quel |
| catégorie  | texte libre                |
| récurrence | texte libre                |
| notes      | éditables depuis la ligne  |

### Scénarios

**Scénario** — un itinéraire candidat.

| Champ          | Détail                                                                      |
| -------------- | --------------------------------------------------------------------------- |
| nom            | éditable en ligne dans le détail                                            |
| favori         | ⭐, remonte en tête de liste                                                |
| date de départ | par défaut celle du voyage ; date les étapes, vide aucune date ne s'affiche |
| voiture        | une référence à la table Voitures                                           |
| charges        | des références à la table Charges fixes                                     |
| étapes         | ordonnées ; l'ordre est le trajet                                           |

**Étape** — appartient à un scénario.

| Champ          | Détail                                                    |
| -------------- | --------------------------------------------------------- |
| titre          | éditable en ligne                                         |
| région         | affichée à côté du titre                                  |
| lieu           | une ville **ou** un hébergement, exclusifs                |
| nuits          | 0 à 14                                                    |
| budget         | remplace le coût calculé de l'hébergement                 |
| date d'arrivée | champ libre de la modale, en plus de la date calculée     |
| notes          |                                                           |
| masquée        | l'étape reste dans la liste mais sort de tous les calculs |

- **Liste** : nom, nombre d'étapes, total des nuits, étoile de favori — les favoris remontent en
  tête. Actions : ouvrir, dupliquer (copie profonde, nouveaux identifiants, nom suffixé
  « (copie) »), supprimer.
- **Date de départ** : un champ dans l'en-tête du détail. Il date la première étape, et les nuits
  de chaque étape décalent les suivantes. Sans date de départ, aucune date ne s'affiche.
- **Détail**, en deux colonnes : étapes + voiture + total général à gauche, bloc « Trajet » dans une
  colonne de droite collante. Bouton « Masquer / Afficher la carte », dont l'état est retenu d'une
  session à l'autre. Sous 1100 px, la carte repasse sous les étapes.
- **Une étape** : une pastille-lettre (A, B, C… dans l'ordre du trajet — grisée et légendée quand
  le lieu n'est pas géolocalisé, donc absent de la carte), un titre éditable en ligne, puis en
  dessous ses dates calculées (« sam. 13 juin → lun. 15 juin », la seule date d'arrivée si 0 nuit),
  sa date d'arrivée libre si elle est saisie dans la modale, et ses notes. Ensuite un select de lieu
  (**une ville ou un hébergement**, les deux dans le même select, exclusifs), un select de nuits
  (0 à 14), et en bout de ligne le coût. Réordonnable ↑↓, duplicable, masquable, supprimable.
- **Masquer une étape** (case à cocher en haut à gauche de la carte) : cochée, la carte passe en
  grisé-pointillé, son contenu et ses actions se désaturent, son titre se barre, sa pastille devient
  un point, ses dates disparaissent, et le scénario se lit comme si elle n'existait pas. Sert à
  comparer deux variantes d'un même trajet sans rien perdre.
- **Dupliquer une étape** (⧉) : la copie s'insère **juste sous** l'originale, champs identiques, sans
  suffixe au nom — on ajuste l'une des deux, ou on en masque une.
- **Insérer une étape entre deux autres** : un `＋` apparaît au survol de l'espace qui sépare deux
  cartes et pose à cette position une étape vide d'une nuit, qu'on remplit sur la carte. Le bouton
  « Ajouter une étape » de l'en-tête ouvre la modale et ajoute en fin de liste.
- **Le select de lieu** : deux groupes, Villes puis Hébergements, chacun trié par nom. Les
  hébergements favoris passent en tête de leur groupe, précédés d'une ★.
- **Les attractions d'une étape** : sous la ligne du lieu, une ligne par attraction — son nom
  précédé de l'emoji de son type, un nombre de visites (1 à 10) et un budget éditable, sur la même
  grille que la ligne du lieu. La pastille du nom ouvre le même menu inline que le lieu : en
  changer, ou détacher l'attraction. Une étape ne porte jamais deux fois la même.
- **Attacher une attraction depuis la carte** : une pastille `＋` au bout de la ligne du lieu,
  visible au survol de la carte, ouvre un menu qui s'ouvre sur un champ de recherche — les
  attractions d'un voyage se comptent par dizaines. La liste propose celles qui ne sont pas déjà
  attachées, `Entrée` prend la première. Un nom sans correspondance se crée sur place :
  l'attraction ne porte alors que son nom, le reste se complète depuis la page Attractions. Les
  attractions se choisissent aussi depuis la modale d'étape.
- **Coût d'une étape** : prix/nuit de l'hébergement × nuits. Un budget saisi à la main le remplace ;
  tant qu'il est vide, le total calculé reste affiché en gris. Rien ne s'affiche sur une étape
  rattachée à une ville — seul un hébergement porte un prix.
- **Voiture** : un select parmi les voitures de la table (« loueur · modèle »), et son coût — prix
  / jour de la voiture × nuits du scénario. Le prix total saisi sur la voiture ne sert qu'à la vue
  Voitures : il ne dépend pas des dates d'un scénario. Un scénario créé naît avec la **voiture par défaut**
  rattachée : c'est une valeur de départ, pas un repli — « Aucune voiture » reste un choix qui
  tient, et les scénarios existants ne bougent pas.
- **Total général**, le seul bloc de chiffres de l'écran : une ligne par poste (hébergements,
  hébergements en GP si le scénario en compte, voiture, charges fixes rattachées), puis le total des
  nuits et le montant. Les GuestPoints y gardent leur propre montant, à côté des euros.
- **Le détail des hébergements se déplie** sous la ligne « Hébergements », au chevron : une ligne
  par lieu (lieu · nuits · dates · total), **dans l'ordre du trajet** — un lieu revisité tient sur
  une seule ligne, ses nuits additionnées et ses dates listées, placée à sa première date. Une
  dernière étape sans nuit ferme la liste avec sa seule date d'arrivée. Le dépli est retenu d'une
  session à l'autre, comme la carte. Les nuits en home exchange y figurent avec leur montant en
  GuestPoints, dont la somme est la ligne « Hébergements en GP » juste en dessous.
- **Les totaux se calculent par étape** : le coût d'une étape (budget saisi, sinon prix/nuit ×
  nuits) alimente aussi bien la ligne de son lieu que les totaux du scénario.
- **Trajet** : une pastille par étape portant sa lettre, le tracé routier réel, et des chevrons
  réguliers qui en donnent le sens. Deux étapes au même endroit partagent une pastille (« A·G »), et
  son popup liste leurs dates et leurs nuits. Le bloc est partagé avec la vue Carte.

### Carte

Aucune entité propre — l'écran lit :

| Entité          | Champs lus                          | Notes                               |
| --------------- | ----------------------------------- | ----------------------------------- |
| **Hébergement** | coordonnées, type, province, favori | sans coordonnées, pas de marqueur   |
| **Scénario**    | étapes                              | choisi en filtre, il donne le tracé |

Tous les hébergements géolocalisés, en couleur par type. Filtres : type, province, ⭐ favoris,
et **scénario** — choisir un scénario trace son trajet et n'affiche que les hébergements qu'il
utilise.

### Notes

**Notes de voyage**

| Champ | Détail             |
| ----- | ------------------ |
| texte | un bloc par voyage |

Une zone de texte libre, partagée. Enregistrée à la frappe, sans re-render.

---

## 5. Règles transverses

- **Suppression** : toujours confirmée, jamais de corbeille.
- **Barre d'outils** : les mêmes contrôles, dans le même ordre, en haut à droite de chaque écran —
  « Trier », « Filtrer », « Colonnes », les filtres propres à l'écran, la bascule tableau / cartes,
  « Ajouter », puis le menu ⋮. Chacun porte une icône, et un compteur quand il a quelque chose
  d'actif. « Trier » et « Filtrer » sont deux panneaux distincts. Le détail d'un scénario a la
  sienne : date de départ, bascule de la carte, « Ajouter une étape », ⋮.
- **Libellés des boutons** : une option unique pour toute l'app, qui affiche ou masque le texte à
  côté des icônes. Elle se change depuis la barre latérale ou depuis le menu ⋮ de n'importe quelle
  liste. Icône seule, le libellé reste lisible au survol.
- **Fermeture d'une modale de saisie** (création comme modification) : confirmée dès qu'un champ a
  été touché, que la fermeture vienne du clic sur le fond ou du bouton « Annuler ». Une modale
  restée telle qu'ouverte se ferme sans rien demander.
- **Duplication** : hébergements, villes, attractions, voitures, charges, transports et scénarios se
  dupliquent depuis leur ligne. La copie reprend tous les champs, prend un nouvel identifiant et son
  nom est suffixé « (copie) » — une voiture dupliquée ne reprend pas le statut « par défaut », et un
  transport, qui n'a pas de nom, se copie tel quel.
- **Budget et prix** : deux notions distinctes, jamais un champ `type` pour les départager. Le
  budget est l'enveloppe qu'on se donne, saisie à la main et optionnelle ; le prix est ce que ça
  coûte vraiment, en fourchette `prix mini` / `prix maxi`. La fourchette gagne dès qu'un de ses
  deux montants est saisi, et la cellule dit laquelle des deux elle affiche (« budget 150 € »).
  Une entité sans prix **est** une enveloppe. Implémenté sur les transports ; les charges fixes,
  les hébergements et les voitures gardent pour l'instant leur champ de prix unique.
- **Liste vide** : un message d'état vide qui dit quoi faire, et qui change selon la cause —
  « aucun favori » et « aucun résultat pour ces tags » ne disent pas la même chose que
  « aucune entrée ».
- **Géocodage** : jamais automatique (le service limite à 1 requête/seconde), toujours sur clic, et
  jamais bloquant — les coordonnées restent saisissables à la main.
- **Préférences d'affichage** (voyage ouvert, colonnes masquées, tri, carte du scénario affichée,
  panneaux ouverts, libellés des boutons) : propres à chaque navigateur, **jamais partagées**.
- **Tout le reste est partagé** via le Google Sheet, en quelques secondes. Voir le
  [protocole de synchro](protocole-sync-sheet.md) : deux entrées différentes éditées en même temps
  sont toutes deux gardées ; sur la même entrée, la dernière personne qui enregistre gagne.
- **Le Sheet reste éditable à la main** comme un tableur : un onglet par table, une ligne par
  entrée. Ne pas toucher aux colonnes `id` ni aux en-têtes.
- **L'app marche sans synchro** : elle démarre vide, tout fonctionne en local, et la connexion au
  Sheet peut arriver plus tard.
- **Se déconnecter n'oublie pas l'adresse** : l'URL du Sheet quitté reste proposée dans le champ de
  la modale de synchro, pour se reconnecter sans la recoller.

---

## 6. Ce qui reste ouvert

Le suivi détaillé vit dans [PLAN.md](../PLAN.md). Les manques structurants du moment :

- **Transports et scénarios** : la page Transports existe, mais aucun trajet ne se rattache encore
  à un scénario — ni entre deux étapes, ni en aller-retour du voyage, ni dans le récap des
  totaux. Le modèle de rattachement reste à choisir.
- **Total des dépenses incomplet** : un hébergement au prix par nuit et une voiture au prix par
  jour restent hors du total tant que rien ne dit sur combien les multiplier. Le nombre de nuits
  n'existe que dans un scénario, et la page Dépenses n'en connaît aucun.
- **Autour des voyages** : pas de page Voyages, donc ni duplication ni suppression d'un voyage.
- **Charges fixes dans le scénario** : la relation (`costIds`) existe dans le modèle et alimente le
  total général, mais aucun écran ne rattache une charge à un scénario — la ligne reste donc à 0 €.
- **Le coût d'une voiture est multiplié par les nuits**, contre la décision actée qui le prenait tel
  quel — à trancher.
- **Deux dates par étape** : celle calculée depuis le départ du scénario, et le champ libre
  « arrivée le » resté dans la modale, affiché à côté.
- **Attractions** : une attraction se rattache à une étape de scénario, mais pas à une ville —
  Montefioralle est donc saisie deux fois si elle est à la fois une étape et une visite.
