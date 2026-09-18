# Spec produit — Carnet de voyages

Spec fonctionnelle de l'app, écrite comme exemple de format : **décisions actées** en tête,
**modèle de données** ensuite, puis **un bloc par écran** qui dit ce qu'on voit, ce qu'on peut
faire et les règles qui ne se devinent pas. Le backlog ne vit pas ici mais dans
[PLAN.md](../PLAN.md), pour que la spec reste la description de ce qui existe.

Documents liés : [map des parcours](map-user-flows.md) · [blueprint réutilisable](blueprint-app-sheet.md) ·
[protocole de synchro](protocole-sync-sheet.md)

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
- Le montant d'une dépense saisie est pris **tel quel**, sans multiplication. Le coût d'une voiture
  dans un scénario est son prix **multiplié par les jours**, comme un hébergement est multiplié par
  ses nuits : une location se loue à la journée.
- **Ce qui décide table ou type : la forme temporelle.** Dormir se compte en nuits (Hébergements),
  disposer d'un bien loué en jours (les offres de voiture), se déplacer va d'un départ à une arrivée
  (Transports), faire occupe un créneau sur place (Activités), payer n'occupe rien (Dépenses). Une
  chose neuve n'ouvre une table que si sa forme temporelle n'existe pas encore — sinon c'est un
  type dans une table existante. C'est pourquoi un restaurant est un type d'« Activités », et une
  location de voiture n'est pas un transport : le trajet **utilise** la location.
- **Une liste « à faire » ne se saisit pas, elle se compose** : une ressource, une colonne, et les
  mots gardés sur cette colonne. Ce qui reste à traiter se lit déjà dans les statuts des autres
  pages — le redemander ligne à ligne ferait une seconde vérité à tenir à jour. Une liste affiche
  donc le tableau de sa page d'origine, mêmes cellules et mêmes éditions en place : rien n'y est
  réécrit, rien ne peut y diverger.
- **Une page a une adresse, et c'est un `#`.** `index.html#attractions`, `index.html#scenario/<id>` :
  l'adresse se recharge, se met en favori et s'envoie. Un vrai chemin (`/attractions`) demanderait un
  serveur qui réécrit tout vers `index.html` — ni `file://` ni GitHub Pages ne le font, et le
  rechargement tomberait sur un 404.
- **Un lieu se situe sur quatre niveaux** — pays, région, province, ville — et une seule adresse,
  celle qu'on géocode. Ces quatre-là valent pour tout ce qui se localise, hébergements et lieux. C'est l'ordre du fil d'Ariane HomeExchange, et celui qu'on lit : « Italie · Ligurie ·
  Savone · Castelbianco ». Une ville prend son nom comme niveau ville à défaut de géocodage.
- **Une ville et une activité sont le même objet.** Un endroit du voyage tient dans une seule
  table ; son type dit ce qu'il est — Ville, Village, Musée, Plage… — et son rôle vient de ce qui le
  référence : une étape s'y pose, une ligne d'étape en fait une visite, un trajet en part. Deux
  tables obligeaient à saisir Montefioralle deux fois pour la voir dans les deux rôles, et à
  corriger son adresse aux deux endroits.
- **Un seul filtre dans l'app.** Le panneau ne connaît aucune page : il lit les colonnes que la
  liste déclare, donc la même brique filtre les hébergements, les lieux, la carte et les listes
  enregistrées. Une colonne ajoutée quelque part devient filtrable sans que le panneau le sache.
- **Une étape porte son lieu**, et son titre en montre la ville et la région, moins ce que son
  propre nom et la pastille du lieu disent déjà.
- **L'ocre dit « choisi », le vert dit « réservé ».** Deux axes, deux couleurs : l'ocre marque ce
  qu'on retient (scénario choisi, colonne retenue), le vert ce qui est pris — le statut **Réservé**
  d'un hébergement. Croiser les deux sur une même carte se lit donc sans ambiguïté.
- Un scénario porte **une** voiture et **plusieurs** charges fixes, **en référence** aux tables
  Offres et Charges fixes — jamais des copies.
- **Un modèle appartient au voyage, sa disponibilité au loueur.** Ce que la voiture est ne dépend de
  personne ; savoir qu'on la trouve chez Hertz est une relation, que le loueur porte. D'où le menu
  Modèle d'une offre, qui ne propose que les modèles de son loueur au lieu de tout le catalogue.
- **Une offre dit ce que le loueur propose, un scénario ce qu'on y prend.** Les options cochées sur
  un véhicule sont le catalogue retenu chez ce loueur ; celles d'un scénario sont son choix à lui,
  et deux scénarios comparent deux assurances sur la même voiture sans la dupliquer. Le montant, lui,
  ne vit qu'à un endroit : le catalogue du loueur. Une option qu'on en retire quitte du même geste
  les offres et les scénarios qui l'avaient cochée : une référence morte s'effacerait des totaux
  sans le dire.
- Un home exchange se paie en **GuestPoints** : ces montants ne s'additionnent **jamais** aux
  euros. Ils ont leur propre ligne de total.
- Un prix se saisit en texte libre (`120`, `1 200,50 €`) : seul le nombre est extrait pour les
  calculs, l'affichage garde la saisie.
- Un champ prix accepte un **calcul** : une saisie commençant par `=` (`=625/4`) est évaluée quand
  le champ perd le focus, et remplacée par son résultat arrondi à l'entier.
- **Une dépense se corrige à sa source** : la page Dépenses lit les montants portés par les autres
  entités — un hébergement réservé, la voiture par défaut — et ne les édite jamais. Seules les
  charges fixes se saisissent là, parce qu'elles n'ont pas d'autre page. D'où les deux blocs,
  Calculé et Saisi, plutôt qu'une liste unique où l'origine d'une ligne serait invisible.
- Un budget saisi sur une étape **remplace** le prix calculé de l'hébergement, et reste en euros
  même sur une étape en GuestPoints.
- Les dates des étapes se **calculent** depuis la date de départ du scénario et les nuits qui
  précèdent : elles ne se saisissent pas.
- **Une option est une suite d'étapes, et non un contenu d'étape.** Comparer deux façons de passer
  les mêmes jours, ce n'est pas comparer deux hôtels pour une nuit : c'est comparer deux bouts
  d'itinéraire, qui n'ont pas forcément le même nombre d'étapes — deux nuits en Toscane d'un côté,
  une nuit à Sienne puis une dans le Chianti de l'autre. Une étape reste donc une étape, avec son
  lieu, ses nuits et son budget ; deux étiquettes disent seulement dans quel **groupe** elle se
  compare et dans quelle **colonne** elle se range. Une étape sans étiquette est une étape
  ordinaire : il n'existe pas deux formes d'étape à réconcilier.
- **Une seule colonne retenue par groupe**, tenue comme le scénario choisi : un drapeau par colonne
  plutôt qu'un identifiant sur le groupe — la colonne se lit à l'œil dans le Sheet, et un
  identifiant y renverrait à un autre onglet. Recliquer la colonne retenue n'en laisse aucune : le
  groupe ne compte alors ni nuit, ni lieu, ni coût.
- **Un groupe ne se déduit pas de ses colonnes, il les porte** : c'est lui qui tient ses lignes
  communes, et sans objet à lui elles n'auraient nulle part où vivre. C'est tout ce qui reste de
  l'étape qui portait les options.
- **Une étape masquée, l'étape d'un groupe masqué et celle d'une colonne écartée ne comptent nulle
  part** : ni dates, ni nuits, ni totaux, ni carte, ni récap, ni nombre d'étapes. Ce sont des
  variantes mises de côté, gardées sous la main plutôt que supprimées, et seule la liste du détail
  les montre. Masquer un groupe sort toutes ses colonnes d'un geste : c'est l'étape entière qu'on met
  de côté, pas l'une de ses façons de la faire. Conséquence :
  partout ailleurs, le rang d'une étape est son rang **parmi les visibles** — masquer la deuxième
  fait passer C en B, et décale les dates. Retenir une autre colonne les décale de même, puisque
  l'arrivée d'une étape somme les nuits qui la précèdent.
- **Les étapes d'un groupe se tiennent d'affilée** dans le scénario, l'ordre du fichier étant
  l'ordre affiché. D'où deux conséquences sur les gestes : les flèches ↑↓ déplacent une étape dans
  sa seule portée — sa colonne, ou la liste — et un glisser-déposer lui donne la colonne de la carte
  visée, ce qui la fait entrer dans un groupe ou en sortir. Le rang que ces flèches font gagner à
  une étape ordinaire est celui des **rangées** de la liste, un groupe entier comptant pour une :
  l'étape se pose juste avant ou juste après le groupe voisin, et ne l'enjambe pas pour atterrir de
  l'autre côté. Le groupe porte les mêmes flèches dans son en-tête et se déplace de même — sans
  quoi il ne pourrait changer de place que si une étape voisine le contournait.
- **Une reprise de format ne fabrique jamais d'identifiant neuf.** Elle se rejoue à chaque lecture,
  des deux côtés de la synchro : l'étape née d'une option porte donc l'identifiant de cette option,
  et le groupe qui remplace l'étape celui de l'étape suffixé. Un identifiant tiré au hasard change l'empreinte de l'état que le
  Sheet renvoie, et la synchro compare des empreintes — tout envoi se verrait alors refuser en
  conflit, indéfiniment.
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
- **Une ligne appartient à une étape ou à un groupe**, activités et dépenses mêlées sur la même
  liste. Celle d'un groupe vaut quelle que soit la colonne retenue — une visite de vignoble se fait
  de toute façon — celle d'une étape ne compte que si la sienne est retenue : un massage n'existe
  que dans l'une des colonnes. Les deux porteurs se lisent pareil, un porteur n'est qu'un objet qui
  tient ses lignes, d'où un seul identifiant de porteur à passer plutôt qu'un couple.
- **Une ligne référence une activité ou une dépense, jamais les deux**, comme une étape référence
  un lieu ou un hébergement. Rien ne se saisit librement sur une étape : un nom inconnu crée
  l'entrée dans sa table, et elle existe donc aussi sur sa page. Un montant libre posé sur l'étape
  a été écarté — il aurait compté dans le Total général sans apparaître sur la page Dépenses.
- **Le budget d'une ligne est une enveloppe pour la ligne entière** : le nombre ne le multiplie pas,
  contrairement au prix de ce qu'elle référence, qui est unitaire.
- **La route se chiffre au kilomètre, pas à la barrière** : l'itinéraire dit une distance, pas quelle
  part en est à péage. Les péages sont donc un taux au kilomètre appliqué à tout le tracé, et
  l'essence la consommation du modèle loué sur cette même distance — un ordre de grandeur pour
  départager deux scénarios, jamais une facture. Les deux taux sont **du voyage** : on y compare des
  itinéraires, pas des carburants, et laissés vides ils retombent sur un ordre de grandeur (1,85 €/L,
  0,08 €/km). Rien ne s'enregistre : déplacer une étape refait le calcul.
- **Une attraction naît « À trier »** : c'est le seul statut posé d'office, dans les quatre
  vocabulaires. Une entrée qui vient d'apparaître n'a été jugée par personne, et le dire vaut mieux
  que « Non renseigné », qui ne distingue pas le neuf de l'oublié.
- **Un restaurant est une attraction**, d'un type de plus — pas une entité à part. Les champs qu'on
  croyait lui appartenir (fourchette de prix, horaires, téléphone) valent aussi pour un musée ou une
  dégustation : ils sont portés par l'attraction, quel que soit son type. Une collection séparée
  aurait obligé à fusionner deux tables à la main dès qu'un écran veut montrer les deux — carte,
  suggestions, rattachement à une étape — alors qu'ici une page Restaurants n'est qu'un filtre.
- **Ajouter, c'est d'abord choisir sa source.** Un hébergement s'ajoute depuis un lien Booking,
  HomeExchange ou Airbnb, ou à la main : quatre portes, quatre formulaires. Chacun ne porte que ce
  que sa source remplit, là où une modale unique montrait les trois champs de lien à la fois et
  demandait de deviner lequel valait pour l'annonce en cours. Modifier, en revanche, rouvre toujours
  la fiche complète : une fois créée, une fiche n'a plus de source.
- **Hors dispo se calcule, il ne se saisit pas.** Ni sur l'hébergement ni sur l'étape il n'y a de
  case à cocher : la comparaison se refait à chaque rendu depuis les dates existantes (date de
  recherche, dates de l'étape, disponible du · au), donc rien ne peut diverger si l'une d'elles
  change ensuite. La date de recherche elle-même n'est lue que dans le lien Google Maps d'une
  recherche d'hôtel (`!5mN!1s<date>`) — un format non documenté par Google, à confirmer si un lien
  la porte autrement.

---

## 3. Modèle

### D'où vient la donnée

| Nature                                          | Collections                                                                           | Ce qui la caractérise                                                                          |
| ----------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Racine**                                      | `travels`                                                                             | possède tout le reste et le filtre ; un seul voyage est ouvert                                 |
| **Base** — porte sa propre donnée               | `accommodations`, `attractions`, `carModels`, `providers`, `fixedCosts`, `transports` | se saisit sans rien d'autre à l'écran ; ce qu'elle référence l'enrichit sans la définir        |
| **Contexte** — n'existe que par un croisement   | `offers` (loueur × modèle)                                                            | supprimer un parent les vide de sens ; `rentals` dort, sans lecteur                            |
| **Arbitrage** — ne porte presque rien en propre | `scenarios`, leurs `steps` et leurs `groups`                                          | des références (offre, options, charges, transports, hébergement) et un ordre                  |
| **Question enregistrée**                        | `todoLists`                                                                           | ressource + colonne + valeurs gardées : la seule entité qui référence l'écran et non la donnée |
| **Texte libre**                                 | `tripNotes`                                                                           | une entrée par voyage                                                                          |
| **Dérivée, zéro stockage**                      | la Carte, le bloc « Calculé » de Dépenses, les totaux d'un scénario                   | relisent les collections à chaque rendu, n'écrivent jamais                                     |

Deux familles vivent hors de l'état. Les **vocabulaires figés en code** — statuts, types, modes,
motorisations, boîtes, unités d'option, récurrences — ne s'éditent pas dans l'app ; seul leur ordre
l'est, depuis le panneau « Trier ». Les **vocabulaires ouverts par l'usage** — tags d'un
hébergement ou d'une activité, catégories d'une dépense — sont l'union de ce qui est déjà saisi : un
mot existe dès qu'il est tapé quelque part. Les options d'un prestataire sont l'exception qui les
sépare : elles portent un prix et une unité, donc ce sont des données, et elles n'appartiennent
qu'au loueur qui les propose.

Les **préférences locales** — colonnes masquées, tri et ordre des mots, voyage ouvert, largeur du
panneau — vivent dans leur propre clé du navigateur et ne partent jamais au Sheet.

### Comment ça s'édite

| Ressource      | Modale | Fiche latérale | En place dans la ligne                                            | Autre porte                                                              |
| -------------- | ------ | -------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Hébergements   | ✅     | ✅             | type, statut, prix, notes, tags, favori                           | trois formulaires d'import collé — Booking, HomeExchange, Airbnb         |
| Activités      | ✅     | ✗              | type, statut, tags, favori                                        | créée en tapant son nom depuis une étape                                 |
| Transports     | ✅     | ✗              | mode, statut, favori                                              | —                                                                        |
| Offres         | ✅     | ✗              | statut, notes, motorisation et boîte — qui écrivent sur le modèle | —                                                                        |
| Prestataires   | ✅     | ✅             | —                                                                 | créé par-dessus la modale qui le réclame                                 |
| Modèles        | ✅     | ✗              | motorisation, boîte, consommation                                 | créé en tapant un nom de véhicule sur une offre, ou coché chez un loueur |
| Dépenses       | ✅     | ✗              | notes, catégories                                                 | créée depuis le bloc Dépenses d'un scénario                              |
| Scénarios      | ✗      | ✗              | nom, favori                                                       | un bouton crée, le glisser ordonne                                       |
| Étapes         | ✅     | ✗              | titre, budget, lieu, nuits, type                                  | le glisser ordonne                                                       |
| Notes          | ✗      | ✗              | le texte lui-même                                                 | —                                                                        |
| Listes À faire | ✗      | ✗              | les pastilles de valeurs                                          | trois champs en tête de page                                             |

Deux asymétries, qu'aucune décision ne porte et que le backlog garde : la fiche latérale n'existe
que pour deux ressources sur dix, et l'édition en place n'est offerte que là où on l'a posée au
coup par coup.

### Les entités

| Entité              | Porte                                                                                                                                                               | Notes                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Voyage**          | nom, emoji, image, description, statut, dates de début et de fin, destination (pays / région), couleur d'accent, voyageurs, prix du litre, péage au km              | possède tout le reste ; un seul est ouvert à la fois                   |
| **Hébergement**     | type, statut, nom, adresse, pays, région, province, ville, coordonnées, prix/nuit, dates, lien, lien de réservation, notes, tags, favori                            | la fiche de référence ; c'est elle qui porte le prix                   |
| **Lieu**            | nom, type, statut, description, adresse, pays, région, province, ville, coordonnées, hébergement, lien, horaires, téléphone, budget, prix mini / maxi, tags, favori | un endroit du voyage : une ville où l'on se pose, un site qu'on visite |
| **Transport**       | mode, statut, départ et arrivée (lieu + précision libre), dates et heures, compagnie, référence, voiture, budget, prix mini / maxi, lien, notes, favori             | un trajet du voyage ; en mode voiture il référence une offre           |
| **Offre**           | le loueur, le modèle, statut, lieu et dates de prise en charge, prix par jour, options cochées chez le loueur, lien, notes, **par défaut**                          | ce qu'un loueur demande pour un modèle ; une seule par défaut          |
| **Charge fixe**     | libellé, montant unitaire, catégories, récurrence, notes                                                                                                            | liste simple                                                           |
| **Scénario**        | nom, favori, **choisi**, date de départ, offre retenue et ses options, charges, transports, **étapes**                                                              | un itinéraire candidat                                                 |
| **Étape**           | titre, notes, date d'arrivée libre, masquée, **options**                                                                                                            | appartient à un scénario, l'ordre compte                               |
| **Option d'étape**  | nom, où l'on se pose (un lieu **ou** un hébergement), nuits, budget, retenue                                                                                        | appartient à une étape ; une seule est retenue                         |
| **Notes de voyage** | texte libre                                                                                                                                                         | un bloc par voyage                                                     |
| **Liste dynamique** | ressource, colonne, valeurs gardées                                                                                                                                 | une question posée à une collection, sur la page « À faire »           |
| **Item du catalogue** | libellé, catégories, notes                                                                                                                                        | pas de `travelId` : le seul catalogue commun à tous les voyages        |
| **Item de valise**  | référence catalogue optionnelle, libellé, catégories, quantité, coché                                                                                              | appartient au voyage ; sans référence, propre à ce voyage seul         |

**Statut d'un voyage**, dans l'ordre du workflow : Idée 💭 · En préparation 🧭 · Réservé 🔒 ·
En cours ✈️ · Passé 📦.

**Type d'hébergement** — Airbnb 🛏️ · Home exchange 🔁 · Hôtel 🏨 · Maison 🏡 · Camping ⛺.
**Statuts**, dans l'ordre du workflow, qui est aussi l'ordre de tri : Réservé 🔒 · Contacté ✉️ ·
Attente réponse ⏳ · À booker 💳 · Go ✅ · Intéressé 👍 · À voir 👀 · Pas dispo 🚫 · Écarté 👎.

**Mode de transport** — Avion ✈️ · Train 🚆 · Bus 🚌 · Ferry ⛴️ · Voiture 🚗. C'est le mode qui
décide des champs utiles : les quatre premiers portent une compagnie et une référence de
réservation, la voiture référence une entrée de la table des locations.
**Statuts d'un transport**, dans l'ordre du workflow et du tri : Réservé 🔒 · À réserver 💳 ·
Go ✅ · À voir 👀 · Écarté 👎.

**Type d'attraction** — Nature 🌿 · Patrimoine 🏛️ · Musée 🖼️ · Ville 🏙️ · Village 🏘️ ·
Plage 🏖️ · Activité 🎟️ · Restaurant 🍝. C'est lui qui dit ce qu'on a devant soi : une ville et un
musée sont la même entité, rangés dans la même table.
**Statuts d'une attraction**, dans l'ordre du workflow et du tri : À trier 📥 · À voir 👀 ·
Go ✅ · Vu ☑️ · Écarté 👎. Les statuts d'hébergement ne s'appliquent pas : on ne réserve pas un
point de vue. C'est le seul statut qui soit posé d'office : une attraction naît « À trier », qu'elle
vienne de la modale ou d'un nom créé au vol depuis une étape — elle n'a été triée par personne.

Les deux champs peuvent rester vides : « Non renseigné ❔ » est l'état d'un hébergement créé ou
importé sans choix explicite. Il s'affiche tel quel partout — tag de la ligne, popup de la carte,
filtre de type — et se trie **après** toutes les valeurs connues.

> Les deux listes vivent dans une map unique qui pilote à la fois les selects, les couleurs de la
> carte et l'ordre de départ de leur colonne. Les quatre types portent
> quatre teintes distinctes de la palette — rouille, ocre, sauge, vert profond — parce que deux
> couleurs de même teinte à des clartés différentes ne se lisent pas comme deux catégories. Cet ordre est celui du workflow, et le lecteur le
> range à sa main depuis le panneau « Trier » — voir le tri des hébergements. Un mot ajouté au
> vocabulaire prend place après ceux qu'on a déjà rangés.

**Statut d'une étape** — jamais saisi : il se déduit de l'hébergement posé et de la comparaison en
cours. C'est une échelle, du plus avancé au moins avancé : Réservé 🔒 · À réserver 💳 · À l'étude
⚖️ · En recherche 🔎 · Sans hébergement ❔ · À revoir 👎. « Réservé » l'emporte sur tout — une
colonne retenue et réservée est réservée, même si les autres options sont encore à l'écran —
« À l'étude » dit un groupe dont la colonne n'est pas tranchée, et « À revoir » ferme l'échelle :
l'étape montre encore un hébergement écarté ou pas dispo, c'est elle qui appelle le geste. Un lieu
qui regroupe plusieurs étapes prend le moins avancé des leurs : un lieu n'est pas réservé tant
qu'il lui reste une nuit à trouver.

---

## 4. Les écrans

### Voyage courant

En tête de la barre latérale, un bouton **emoji + nom + sous-titre** (les dates si elles sont
saisies, sinon la destination) ouvre le menu des voyages : les autres voyages, « Modifier ce
voyage » et « Nouveau voyage ». Les deux derniers ouvrent la même modale. En barre latérale
réduite, il ne reste que l'emoji.

Au pied de la barre, sous l'état du Sheet, un bouton **⚙️ Réglages** ouvre les préférences
d'affichage **en modale** : la barre défile, un panneau déplié dedans se rognait. Le **⋮** de
n'importe quel écran ouvre exactement le même contenu, sans quitter la page — la préférence se
change indifféremment ici ou là. Ce contenu est fait de deux blocs : **Réglages généraux** ce qui
vaut pour toute l'app (les libellés des boutons), puis, **sous le nom de la page ouverte**, ce qui
ne concerne qu'elle (« Détail du scénario » : l'affichage et la couleur du fil). Un écran sans
réglage propre n'affiche que le premier bloc. Une préférence à deux états se bascule d'un
**interrupteur** et non d'une case : son état se lit de loin.

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

| Champ                            | Détail                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| type                             | Airbnb · Home exchange · Hôtel · Maison · Camping, ou non renseigné                             |
| statut                           | les neuf statuts du workflow, ou non renseigné                                                  |
| nom                              |                                                                                                 |
| adresse                          | une seule, c'est elle qu'on géocode                                                             |
| pays · région · province · ville | proposés par le géocodage, modifiables à la main                                                |
| coordonnées                      | latitude, longitude                                                                             |
| prix/nuit                        | texte libre, éditable depuis la ligne et la carte ; en GuestPoints si le type est Home exchange |
| dates                            | texte libre (« 12–14 juin »)                                                                    |
| disponible du · au               | deux dates, laissées vides à la création : la fenêtre que l'annonce propose                     |
| lien                             | l'annonce ; un lien HomeExchange ou Airbnb collé pré-remplit la fiche                           |
| lien de réservation              | Booking ; un lien collé pré-remplit la fiche                                                    |
| lien Google Maps                 | colle-le et le nom, l'adresse et les coordonnées se remplissent                                 |
| date de recherche                | pas un champ à saisir : posée par le lien Google Maps quand la fiche vient d'une recherche d'hôtel, elle ne sert qu'à l'indicateur hors dispo |
| notes                            | éditables depuis la ligne                                                                       |
| tags                             | liste libre, sans administration                                                                |
| favori                           | ⭐, et un critère de tri                                                                        |

La vue principale, en **tableau ou en cartes**.

- **Colonnes** : favori, nom (+ notes en dessous), type, statut, ville, province, région, pays,
  tags, adresse, prix, dates, disponible du, disponible au, notes, lien, Booking, actions. Région,
  pays, adresse et notes sont masquées par défaut ; nom, favori et actions ne sont jamais
  masquables. Le sélecteur « Colonnes » garde le choix d'une session à l'autre.
- **Tri** — panneau « Trier » : une liste ordonnée de critères (« statut, puis ville »),
  chacun avec son sens, réordonnable. Le clic sur un en-tête est le raccourci : il remplace tout
  par un tri simple et cycle croissant → décroissant → aucun. Tri de départ : favoris, puis type,
  puis statut. Les favoris sont un critère comme un autre.
- **Un critère de vocabulaire se trie en rangeant ses mots** : sur type, statut ou mode, croissant
  et décroissant ne veulent rien dire — c'est l'ordre des statuts qui fait le tri. Le second champ
  du niveau ouvre donc la liste des mots, qu'on glisse l'un au-dessus de l'autre ; l'ordre obtenu
  vaut pour toute l'app et se garde d'une session à l'autre, à côté des colonnes masquées. Ces
  colonnes n'ont pas de sens inverse : l'en-tête y cycle croissant → aucun.
- **Filtres** : ⭐ favoris uniquement — un bouton à part, toujours visible — et le panneau
  « Filtrer », décrit dans les règles transverses.
- **Édition en ligne** : type, statut, prix et notes se changent directement dans la ligne comme
  dans la carte, sans ouvrir la fiche. Le prix garde sa monnaie (€ ou GP) affichée à côté du champ.
- **Hors dispo** : une pastille à côté du nom (ligne, carte et fiche) quand la date de recherche
  tombe hors de « disponible du · au ». Le style de la pastille — pastille rouge, ambre, ou icône
  seule — est un réglage du menu Affichage, pour comparer les trois sans coder. La même
  comparaison vaut pour une étape de scénario, contre ses dates à elle.
- **Tags** : aucune liste d'options à administrer. Les options proposées sont l'union des tags déjà
  saisis — un tag existe dès qu'il est tapé quelque part, et disparaît avec son dernier porteur.
  Un tag coché puis disparu est retiré du filtre tout seul.
- **Ajouter** : le `+` ouvre un panneau de quatre portes — depuis un lien Booking, depuis un lien
  HomeExchange, depuis un lien Airbnb, ou à la main. Chaque porte a son formulaire : le lien en
  tête, puis nom, localisation, prix, dates et notes. Statut, tags et coup de cœur ne s'y trouvent
  pas, ils se posent depuis la liste. Le type est celui de la porte pour HomeExchange et Airbnb ;
  Booking logeant aussi bien un hôtel qu'une maison, sa porte garde le select que l'import remplit.
- **La fiche s'ouvre en panneau** : cliquer une ligne du tableau — ailleurs que sur une cellule qui
  agit déjà, pastille, champ ou bouton — pose la fiche contre le bord droit de l'écran, sur un fond
  assombri ; Échap ou un clic dehors la referme, sous la même garde que la modale quand une saisie
  n'est pas enregistrée. C'est le formulaire de la modale au mot près, posé autrement : les deux ne
  peuvent pas diverger. L'**ajout**, lui, garde la modale centrée.
- **Créer / modifier** : la modale complète, celle de la porte « à la main » et de toute
  modification. L'adresse se géocode sur clic du bouton « Localiser », qui
  propose des résultats ; le choix d'un résultat écrase pays, région, province, ville et coordonnées.
  Les quatre niveaux restent saisissables à la main, avec les valeurs déjà présentes en
  suggestion.
- **Import d'un lien HomeExchange** : coller le lien dans le champ pré-remplit type, nom,
  GuestPoints/nuit, pays, région, province et ville — **seuls les champs vides**, jamais une saisie déjà
  faite. Nécessite la synchro configurée : la page est lue par l'Apps Script, le navigateur ne peut
  pas la lire lui-même.
- **Import d'un lien Airbnb** : collé dans le même champ « Lien » que HomeExchange, il pré-remplit
  type, nom, coordonnées, pays, région et ville — **seuls les champs vides**, et même dépendance à
  la synchro. Les coordonnées viennent du JSON-LD, donc la fiche se place sur la carte sans passer
  par « Localiser » ; elles sont celles qu'Airbnb publie avant réservation, approximatives. La
  région et le pays se lisent dans le titre de la page. Il n'y a **ni prix ni province** : Airbnb
  ne sert pas le montant dans sa page, même quand le lien porte des dates.
- **Import d'un lien Booking** : coller le lien dans le champ « Lien Booking » pré-remplit nom,
  type, prix, adresse, pays, région et ville — **seuls les champs vides**,
  comme pour HomeExchange, et même dépendance à la synchro. Le nom et l'adresse viennent du JSON-LD
  de la page, le prix du bloc `data-testid` — il n'existe que si le lien porte des dates.
- **Import d'un lien Google Maps** : coller le lien dans le champ « Lien Google Maps » pré-remplit
  nom, adresse et coordonnées — **seuls les champs vides**, et même dépendance à la synchro. C'est
  la voie pour une chambre d'hôtes ou un hôtel qui n'est sur aucune plateforme. Les niveaux — pays,
  région, province, ville — ne viennent pas de là : Google ne les sert pas dans ses métadonnées de
  partage, « Localiser » reste le chemin.
- **Import depuis un tableau** : coller des lignes copiées d'un tableur crée les hébergements
  correspondants ; type et statut sont reconnus depuis le texte, sinon laissés non renseignés. Le bouton
  « Importer » n'apparaît que **tant qu'aucun Sheet n'est connecté** — la synchro est ensuite la voie
  d'entrée des lignes.

### Lieux & activités

**Lieu** — un endroit du voyage. La table réunit ce qu'on visite et ce où l'on se pose : un musée,
une plage, un restaurant, et la ville d'une étape dont on ne connaît pas encore le logement. C'est
le **type** qui le dit, pas la table où il serait rangé.

| Champ                         | Détail                                                    |
| ----------------------------- | --------------------------------------------------------- |
| nom                           |                                                           |
| type                          | liste figée, comme le type d'un hébergement               |
| statut                        | liste propre, courte                                      |
| description                   | texte libre                                               |
| adresse                       | c'est elle qu'on géocode                                  |
| coordonnées                   | latitude, longitude                                       |
| pays, région, province, ville | proposés par le géocodage, modifiables à la main          |
| hébergement                   | facultatif ; référence un hébergement du voyage           |
| lien Google Maps              | colle-le et la fiche se remplit                           |
| lien                          |                                                           |
| horaires                      | texte libre, quel que soit le type                        |
| téléphone                     | texte libre                                               |
| budget                        | l'enveloppe qu'on se donne                                |
| prix mini / maxi              | la fourchette réelle, règle transverse « Budget et prix » |
| tags                          | texte libre, amorcés par un vocabulaire par défaut        |
| favori                        | étoile en tête de ligne                                   |

Un même lieu tient les deux rôles qu'une étape lui donne : elle s'y **pose** — le select de lieu le
propose à côté des hébergements — et une autre étape l'ajoute en **activité** dans ses lignes. Une
seule fiche, donc une seule adresse à corriger. Un trajet y désigne aussi son départ et son
arrivée.

Tableau seul, pas de vue en cartes. Colonnes : favori, nom, type, statut, prix, tags, description,
ville, province, région, pays, adresse, coordonnées, hébergement, horaires et téléphone, lien —
région, pays, adresse, coordonnées, hébergement, horaires et téléphone masqués par défaut. Les
quatre niveaux sont des colonnes à part, comme chez les hébergements : c'est ce qui les rend
filtrables un à un — « les lieux de Toscane ». Tri par défaut favoris d'abord, puis type, puis nom. Même bloc de
localisation que les hébergements.

- **Un lien Google Maps collé remplit la fiche** : nom, adresse et coordonnées, lus par l'Apps
  Script — le navigateur ne peut pas lire google.com lui-même. Le nom et les coordonnées viennent
  de l'URL finale, que Google écrit et qu'un lien court (`maps.app.goo.gl`) ne porte qu'après
  redirection ; l'adresse, des métadonnées de partage. Un champ déjà rempli n'est jamais écrasé,
  comme pour un lien Booking.
- **L'hébergement se choisit dans la modale** : la table d'hôtes ou le restaurant d'un hôtel
  **référence** sa fiche plutôt que d'en recopier le nom, comme une option d'étape référence son
  hébergement. Il reste facultatif — la plupart des activités n'en ont pas.
- **Type et statut s'éditent depuis la ligne**, par le même dropdown inline que les hébergements.
- **Tags** : mêmes tags libres que les hébergements — un tag existe dès qu'il est saisi — mais la
  liste proposée est amorcée par un vocabulaire par défaut (paysage, village, marché, monument,
  musée, église, jardin, point de vue, plage, thermes, randonnée, artisanat, trattoria, pizzeria,
  gastronomique, terrasse, vue, cave / dégustation, fromager, glacier, street food, végétarien),
  pour qu'une première attraction ait déjà quelque chose à choisir. Le vocabulaire est **commun à
  tous les types** : un restaurant et un musée puisent dans la même liste. Ils s'éditent sur place
  depuis la cellule du tableau, comme ceux d'un hébergement, et depuis la modale.

### Transports

**Transport** — un trajet du voyage.

| Champ                | Détail                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| mode                 | liste figée ; décide des champs utiles                                                                     |
| statut               | liste propre, courte                                                                                       |
| départ, arrivée      | un lieu de la table Lieux & activités, plus une précision libre à côté                                     |
| dates et heures      | date et heure de départ, date et heure d'arrivée                                                           |
| compagnie, référence | pour l'avion, le train, le bus et le ferry : la compagnie référence un prestataire, la référence est libre |
| voiture              | en mode voiture seulement : référence une offre, dont le loueur et le modèle s'affichent                   |
| budget, prix         | l'enveloppe, et la fourchette réelle `prix mini` / `prix maxi`                                             |
| lien                 |                                                                                                            |
| notes                |                                                                                                            |
| favori               | étoile en tête de ligne                                                                                    |

Tableau seul, pas de vue en cartes. Colonnes : favori, mode, départ, arrivée, part le, arrive le
(masquée par défaut), compagnie / loueur, prix, statut, lien, notes (masquée par défaut). Tri par
défaut par date de départ, puis par mode.

- **Mode et statut s'éditent depuis la ligne**, par le même dropdown inline que les hébergements.
- **Un aéroport n'est pas une ville** : le départ et l'arrivée pointent sur un lieu du voyage — le
  select ouvre sur les villes et les villages, les autres lieux suivent — et la précision
  (« Aéroport de Pise », « Santa Maria Novella ») se saisit dans un champ libre à côté. Le tableau
  affiche le lieu, la précision en dessous.
- **La voiture se référence, jamais ne se recopie** : un transport de mode voiture pointe sur une
  entrée de la table des locations. Le loueur y tient la place de la compagnie et le modèle celle de
  la référence — la colonne affiche « Hertz » avec « Fiat 500 » en dessous, comme elle affiche
  « Trenitalia » avec son numéro de billet. Changer de mode dans la modale échange le bloc compagnie
  et le bloc loueur ; la valeur de l'autre mode reste enregistrée et n'est pas effacée.
- **Le loueur d'une voiture ne se saisit qu'une fois** : un transport de mode voiture ne porte pas
  de prestataire à lui — il référence une voiture, qui référence son loueur. Deux chemins vers le
  même nom finiraient par diverger.
- **Un transport de mode voiture porte quand même son prix** : la location et le trajet sont deux
  coûts distincts — le prix de la location vit sur la voiture, celui du trajet (péages, essence, un
  aller ponctuel) sur le transport. Le transport ne lit jamais le prix de la location.

**Loueur ou compagnie** — chez qui on prend un trajet. La page Transports porte trois onglets : les
trajets, « Loueurs & compagnies », et « Voitures » — les offres relevées et le catalogue des
modèles, l'une sous l'autre. Ils prennent leur propre rangée sous le titre de la page, chacun avec son icône, son nom
toujours écrit, et une pastille qui porte le nombre de lignes qu'il tient ; l'onglet ouvert est
souligné. C'est son **mode** qui dit comment on nomme un prestataire — loueur pour la voiture,
compagnie pour l'avion, le train, le bus et le ferry.

| Champ       | Détail                                                                   |
| ----------- | ------------------------------------------------------------------------ |
| mode        | le mode de transport, qui dit le mot et filtre les selects               |
| nom         | « Hertz », « Ryanair »                                                   |
| logo        | une url d'image ; à défaut, la pastille porte l'initiale du nom          |
| site        |                                                                          |
| réservation | la page de l'offre, à côté du site officiel                              |
| options     | autant de lignes qu'on veut : un libellé, un montant, et ce qu'il compte |
| modèles     | en mode voiture : les modèles du voyage qu'on trouve chez ce loueur      |
| notes       |                                                                          |

Tableau seul, tri et colonnes configurables comme les trajets. L'onglet ouvert est le geste en
cours : il ne vit ni dans l'adresse ni dans les préférences, revenir sur la page rouvre les trajets.

- **Une option est propre à son prestataire** : deuxième conducteur, bagage supplémentaire,
  assistance. Son montant se compte en forfait, par jour, par bagage, par personne ou par trajet —
  liste figée. Le libellé reste libre, et les options déjà posées ailleurs le proposent en
  autocomplétion : les mots se partagent sans qu'un vocabulaire soit à administrer.
- **La fiche s'ouvre en panneau** : cliquer une ligne de l'onglet — ailleurs que sur une cellule qui
  agit déjà — pose la fiche contre le bord droit de l'écran, comme celle d'un hébergement. L'ajout
  et la reprise en cours de saisie gardent la modale centrée.
- **Un loueur dit quels modèles il propose** : des cases à cocher dans sa fiche, une par modèle du
  voyage, et une ligne pour taper celui qui manque — il rejoint alors le catalogue et se coche. Le
  bloc n'existe qu'en mode voiture. C'est une **référence** et non une possession : la même Golf
  cochée chez deux loueurs reste une seule Golf, sans quoi on ne pourrait plus les comparer.
- **Une offre relevée chez lui compte comme une case cochée** : le fait « ce loueur propose ce
  modèle » s'écrirait sinon à deux endroits — les cases de sa fiche et toute offre qui les
  contredit. La liste se lit donc comme l'union des deux, et rien n'a à réécrire la fiche quand une
  offre arrive.
- **Un select ne propose que les prestataires de son mode** : un vol ne se prend pas chez un loueur.
- **Celui qui manque se crée sans quitter sa saisie** : le dernier item du select — « ＋ Ajouter une
  compagnie » — pose un petit formulaire par-dessus la modale ouverte, sans la re-rendre, et le
  prestataire créé s'y sélectionne. Il ne porte alors que son nom et son mode ; le reste se complète
  dans l'onglet.

L'onglet **Voitures** empile deux listes titrées, comme la page Dépenses empile Calculé et Saisi :
**Offres** d'abord — les tarifs relevés —, **Modèles** dessous — le catalogue. Chacune porte son
propre bouton d'ajout, son panneau de tri et son sélecteur de colonnes : ce sont deux listes
ordinaires de l'app, pas une carte qui en contiendrait une autre. C'est là que les deux mots se
lisent comme deux choses.

**Modèle de voiture** — une voiture du voyage : un nom, une motorisation, une boîte, une
consommation. Sa liste porte ses loueurs et le compte de ses offres, le prix le plus bas relevé en
tête.

- **La consommation est ce que la voiture EST**, au même titre que sa boîte : elle vit donc sur le
  modèle et non sur l'offre, et c'est elle qui chiffre l'essence d'un scénario qui loue ce modèle.

- **Un modèle est du voyage, pas d'un loueur** : une seule Golf, que Hertz et Sixt proposent tous
  les deux. C'est ce qui permet de les comparer — rangée sous son loueur, elle ferait deux entrées
  homonymes qui ne savent pas qu'elles parlent de la même voiture.
- **Ses loueurs se comptent des deux côtés** : le fait « ce loueur propose ce modèle » s'écrivant
  aussi bien dans les cases d'une fiche que dans une offre relevée, la colonne se dérive de la même
  union que la liste des modèles d'un loueur — sans quoi un modèle que deux fiches cochent dirait
  « aucun loueur » pendant que l'onglet d'à côté le montre chez les deux.
- **Motorisation et boîte se changent depuis la ligne** : les deux pastilles ouvrent leur
  vocabulaire et écrivent sur le modèle — c'est là que la donnée vit, et une offre qui n'a pas
  encore de modèle ne porte qu'une étiquette. Un mot de vocabulaire qui ne s'édite pas là où il
  s'affiche n'appelle donc plus le clic.
- **Le prix n'est jamais sur le modèle** : il dépend du loueur et des dates, il vit sur l'offre. Un
  modèle qu'aucune offre n'a relevé reste dans la liste, sans loueur ni prix.
- **Le catalogue se remplit en saisissant** : un modèle tapé dans la modale d'une offre rejoint le
  voyage, et le loueur le proposera puisqu'on l'aura relevé chez lui. On peut aussi l'ajouter
  depuis le bouton de sa liste ou depuis la fiche du loueur, avant d'avoir cherché quoi que ce soit.

**Offre** — ce qu'un loueur demande pour un modèle.

| Champ          | Détail                                                                      |
| -------------- | --------------------------------------------------------------------------- |
| loueur         | référence un prestataire de mode voiture ; celui qui manque se crée d'ici   |
| modèle         | parmi ceux du loueur ; celui qui manque se tape et rejoint le catalogue     |
| lieu           | l'agence ou l'aéroport de prise en charge                                   |
| départ, retour | une date et une heure chacun : la durée sur laquelle le tarif relevé valait |
| prix par jour  | le seul prix qui se saisit                                                  |
| options        | celles cochées dans le catalogue du loueur                                  |
| statut         | 🔒 Réservé · 💳 À réserver · ✅ Go · 👀 À voir · 👎 Écarté                  |
| lien, notes    | notes éditables depuis la ligne                                             |
| par défaut     | une seule offre à la fois, pour tout le voyage                              |

- **Toutes les offres tiennent une seule liste**, modèles et loueurs mêlés : colonnes modèle,
  loueur, lieu, dates, motorisation, boîte, statut, options et prix par jour. Rien n'est groupé
  d'avance, donc on range par ce qu'on vient comparer — le prix pour trouver le moins cher, le
  loueur pour lire un loueur. Le tri par défaut est modèle puis prix par jour : les offres d'une
  même voiture se retrouvent ainsi collées, de la moins chère à la plus chère.
- **Le seul prix qui se saisit est celui du jour** : un total n'a de sens que sur une durée, et la
  durée appartient au scénario qui lit l'offre — c'est lui qui multiplie ce tarif par ses jours à
  lui. Les dates d'une offre ne servent donc qu'à dire sur quelle durée le tarif relevé valait : un
  loueur est dégressif, deux relevés de durées différentes ne donnent pas le même chiffre.
- **Les options viennent du loueur, la case vient de l'offre** : le catalogue et les prix vivent
  chez le prestataire, l'offre ne porte que ce qu'elle a coché. Une option tapée depuis la fiche
  d'une offre rejoint le catalogue du loueur — corriger son prix le corrige pour toutes les offres
  qui l'ont prise. Une option au jour se compte sur les jours du scénario, une option par personne
  sur les voyageurs, un forfait une fois.
- **Voiture par défaut** : un rond ◉ en tête de ligne. Une seule offre à la fois pour tout le
  voyage — la marquer démarque les autres. C'est elle que la page Dépenses lit, et comme elle ne
  porte qu'un prix par jour, elle s'y affiche avec son unité et reste hors du total : rien ne dit
  encore sur combien de jours la multiplier.
- Les colonnes d'une offre servent aussi aux listes filtrées de la page À faire, qui lisent la
  collection entière — d'où leur colonne Loueur, que le tableau d'un modèle porte déjà.

### Locations — en sommeil

La page a été retirée de la navigation. Une location — un loueur, un lieu, deux dates — ne servait
qu'à ramener au jour le total qu'un loueur affiche ; le prix qui se saisit étant désormais celui du
jour, il ne lui restait rien à porter que l'offre ne porte elle-même. Ses fichiers et sa collection
`rentals` restent en place, rien n'est effacé : la rallumer tient à ses balises `<script>`, à son
entrée de navigation et à sa modale.

Ce qu'elle savait faire reste à écrire ailleurs : la **ligne de saisie rapide** — modèle,
motorisation, boîte, prix, `Entrée` enchaîne — n'a pas d'équivalent dans la modale d'une offre.

### Dépenses

Ce que le voyage coûte, en deux blocs : **Calculé**, lu sur les autres pages, et **Saisi**, tapé
ici. Un récap ferme l'écran avec les deux sous-totaux et leur somme.

**Calculé** — une dépense dérivée se lit sur l'entité qui la porte, elle ne se saisit pas ici. Un
groupe par source, dont le titre mène à la page où la corriger :

| Source                | Ce qu'elle apporte                             |
| --------------------- | ---------------------------------------------- |
| Hébergements réservés | une ligne par hébergement au statut Réservé 🔒 |
| Voiture par défaut    | la voiture marquée ◉, si elle en porte une     |
| Transports réservés   | une ligne par transport au statut Réservé 🔒   |
| Activités, validé     | une ligne par activité au statut Go ✅         |

Une source sans montant ferme reste **hors du total** et s'affiche telle quelle : un prix par nuit
ou par jour garde son unité (« 120 € / nuit ») tant que rien ne dit sur combien le multiplier, et
une fourchette dont les deux bornes diffèrent s'affiche en fourchette. Un montant unique — une
seule borne saisie, les deux égales, ou le budget à défaut — entre dans la somme. Une source sans
aucune ligne ne s'affiche pas ; toutes vides donnent un message d'état vide.

**Saisi** — la liste des charges fixes : tableau ou cartes, ajout et modification en modale,
suppression confirmée, tri et colonnes configurables depuis l'en-tête.

**Charge fixe**

| Champ      | Détail                                                  |
| ---------- | ------------------------------------------------------- |
| libellé    |                                                         |
| montant    | texte libre, unitaire — ce que coûte **une** récurrence |
| catégories | plusieurs, en pastilles, éditables depuis la ligne      |
| récurrence | une fois, par nuit, par jour, par voyageur              |
| notes      | éditables depuis la ligne                               |

- **Récurrence** : elle dit sur quoi le montant se multiplie, jamais combien de fois — le nombre ne
  vit pas sur la dépense, il vient du scénario où elle est comptée. Une dépense « 10 € par nuit »
  rattachée à un scénario de sept nuits y vaut 70 €, et 30 € dans un scénario de trois. Sur cette
  page, où aucun scénario ne donne le compte, une dépense qui se multiplie s'affiche avec son unité
  et reste **hors du total saisi**, comme une source dérivée à montant ouvert. La colonne se range
  sur l'ordre du vocabulaire, pas sur ses libellés.

- **Catégories** : mêmes mots libres que les tags des hébergements — une catégorie existe dès
  qu'elle est tapée quelque part, et disparaît avec sa dernière porteuse. Aucune liste à
  administrer, aucun vocabulaire de départ : la cellule s'ouvre en place et propose l'union de ce
  qui est déjà saisi. La colonne se trie sur ses catégories mises bout à bout, donc sur la première
  d'abord.

### Scénarios

**Scénario** — un itinéraire candidat.

| Champ          | Détail                                                                      |
| -------------- | --------------------------------------------------------------------------- |
| nom            | éditable en ligne dans le détail                                            |
| favori         | ⭐, remonte en tête de liste                                                |
| archivé        | sort de la liste sans être supprimé ; un archivé n'est plus le choisi       |
| choisi         | ◉ un seul par voyage ; c'est lui que lisent les écrans transverses          |
| date de départ | par défaut celle du voyage ; date les étapes, vide aucune date ne s'affiche |
| voiture        | une référence à une offre de voiture                                        |
| charges        | des références à la table Charges fixes                                     |
| transports     | des références à la table Transports                                        |
| étapes         | ordonnées ; l'ordre est le trajet                                           |
| groupes        | les endroits où plusieurs suites d'étapes se comparent                      |

**Étape** — appartient à un scénario.

| Champ           | Détail                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| titre           | éditable en ligne                                                         |
| type            | un type d'hébergement, facultatif ; il restreint les hébergements du lieu |
| lieu            | un lieu **ou** un hébergement, exclusifs                                  |
| nuits           | 0 à 14                                                                    |
| budget          | remplace le coût calculé de l'hébergement                                 |
| date d'arrivée  | champ libre de la modale, en plus de la date calculée                     |
| notes           |                                                                           |
| masquée         | l'étape reste dans la liste mais sort de tous les calculs                 |
| groupe, colonne | vides pour une étape ordinaire ; sinon, où elle se compare                |
| lignes          | ses activités et ses dépenses                                             |

**Groupe** — appartient à un scénario ; l'endroit où plusieurs suites d'étapes se comparent.

| Champ    | Détail                                                            |
| -------- | ----------------------------------------------------------------- |
| nom      | éditable en ligne ; celui de l'étape qui s'est ouverte en options |
| masqué   | le groupe reste dans la liste mais sort de tous les calculs       |
| colonnes | au moins deux ; une seule retenue                                 |
| lignes   | les activités et dépenses communes à toutes ses colonnes          |

**Colonne** — appartient à un groupe.

| Champ   | Détail                                                                                 |
| ------- | -------------------------------------------------------------------------------------- |
| rang    | sa place dans le groupe ; ne s'affiche que dans la confirmation de « Garder celle-ci » |
| retenue | ce sont ses étapes qui comptent dans les dates, totaux et carte                        |

**Ligne** — une activité ou une dépense posée sur une étape ou sur un groupe.

| Champ     | Détail                                                           |
| --------- | ---------------------------------------------------------------- |
| porteur   | l'étape ou le groupe dans la liste duquel elle vit               |
| référence | une attraction **ou** une dépense, exclusives                    |
| nombre    | 1 à 10 ; multiplie le prix de la référence, jamais le budget     |
| budget    | enveloppe de la ligne entière ; remplace le prix de la référence |

- **À l'ouverture de l'app** : l'écran de départ est la liste des scénarios. Si le voyage courant
  porte un scénario nommé « TEST », c'est son détail qui s'ouvre directement — un raccourci de
  travail, lu dans le cache local au chargement.
- **Liste** : une carte par scénario. En tête, l'étoile de favori, le nom, et la pastille du
  scénario **choisi** — pleine et ocre sur celui qui est retenu, simple invite « choisir » au
  survol des autres ; la carte retenue porte en plus un liseré ocre à son bord gauche. Dessous,
  ses nuits et son nombre d'étapes. À droite, le total en euros en gros, puis
  le total en GuestPoints s'il y en a et le prix par nuit — qui ne compte que les euros, les
  GuestPoints ne se ramenant pas à une nuit. L'ordre de la liste est le choisi, puis les favoris,
  puis les autres. Actions : ouvrir, dupliquer (copie profonde, nouveaux identifiants, nom suffixé
  « (copie) »), archiver 📦, supprimer — les trois dernières n'apparaissent qu'au survol de la
  carte.
- **La bande d'itinéraire** ferme chaque carte : un segment par lieu du trajet, dans l'ordre, large
  comme ses nuits et peint de la couleur de son statut d'étape — vert réservé, or à réserver, ocre
  à l'étude, beige en recherche ou sans hébergement, rouille à revoir ; les deux statuts qui
  attendent un geste — à réserver, à revoir — se rayent en diagonale. C'est l'avancement du
  voyage qui se lit d'un coup d'œil sur la liste, et non le type d'hébergement, qui reste la
  couleur de la carte. L'infobulle d'un segment nomme le lieu, ses nuits et son statut. Elle
  porte ses dates à ses deux bouts, chacune sous un tiret : le départ à gauche, le retour là où
  elle s'arrête — donc plus tôt que celui d'un scénario plus long. Son échelle est celle de la
  liste entière — le scénario le plus long tient toute la largeur, les autres se mesurent contre
  lui — de sorte qu'une durée se compare sans lire un chiffre. Le nom du lieu s'écrit sous son
  segment, sauf sous 8 % de la barre où il ne tiendrait pas : il reste alors dans l'infobulle. Un
  scénario sans étape affiche « Aucune étape ».
- **Archiver** : un scénario qu'on ne veut plus voir sans le perdre. Le 📦 de sa carte le sort de
  la liste, et le bouton 📦 « Archivés » de l'en-tête montre les archivés **à la place** des autres
  — deux collections, pas un filtre : leur carte y porte un ↩ qui les remet. Archiver un scénario
  lui retire d'être le choisi, et un archivé ne se propose plus dans le sélecteur de la Carte.
  L'archivage est un état du scénario, donc il se garde ; les regarder est un geste en cours,
  comme comparer, et repart fermé à chaque session.
- **Comparer** : le bouton ⚖ de l'en-tête bascule la liste en mode compare. Chaque ligne gagne alors
  une case à cocher et la cliquer coche au lieu d'ouvrir le scénario ; les scénarios cochés se
  posent sous la liste, côte à côte dans la largeur, une carte chacun. La carte porte le nom, le
  détail des hébergements — le même que celui du Total général du détail, lieu par lieu, avec ses
  dates, ses nuits et son coût —, puis le total des hébergements, celui des charges, celui des
  attractions, et le total général avec les nuits. Charges et attractions ne montrent que leur
  total : leur détail se lit dans le scénario. La sélection ne dure que la session, comme le
  scénario ouvert.
- **En-tête du détail** : sa barre d'outils ne porte que des gestes sur la vue — les onglets du
  panneau latéral, le menu ⋮ — et le lien « ← Tous les scénarios ». Les données du scénario
  tiennent le bloc d'identité : l'étoile de favori, le nom éditable, et sous eux la date de départ
  suivie du nombre d'étapes et des nuits. Le total ferme cette même ligne : les
  GuestPoints, puis les euros en grand au bout.
- **Ajouter une étape** ne se fait plus depuis la barre mais depuis la liste : un ＋ fantôme entre
  deux cartes, révélé au survol, qui insère à cet endroit ; et une ligne « ＋ Ajouter une étape »
  posée au pied de la liste, toujours visible, qui ajoute à la fin — c'est aussi le seul geste d'un
  scénario sans étape. Les deux offrent « Créer une étape » et « Créer une étape avec options ».
- **Date de départ** : un champ de la ligne de sous-titre, à côté du nom. Il date la première
  étape, et les nuits de chaque étape décalent les suivantes. Sans date de départ, aucune date ne
  s'affiche.
- **Détail**, en deux colonnes : les étapes à gauche, le panneau latéral à droite. Sous les étapes,
  un pied partage la largeur — voiture, dépenses et total général à gauche, la carte du trajet à
  droite, collante à la hauteur du défilement.
- **Le panneau latéral** montre une chose à la fois, ou rien : la carte du trajet, l'argent
  (voiture, dépenses, total général), ou la valise du voyage ; son pied porte les nuits et le total
  quel que soit l'onglet. Ses trois boutons « 🗺 Carte », « 💶 Argent » et « 🧳 Valise » vivent dans
  la barre de l'en-tête et sont aussi sa bascule — recliquer celui qui est allumé referme le
  panneau, et les étapes prennent toute la largeur. Le passage d'un mode à l'autre est animé : les
  deux colonnes glissent vers leur nouvelle largeur au lieu de sauter. L'onglet ouvert, ou
  l'absence de panneau, est retenu d'une session à l'autre. Sous 1100 px, le panneau repasse sous
  les étapes.
- **Le partage des deux colonnes se glisse** : la poignée entre elles se tire à la souris, chaque
  colonne gardant au moins 280 px. La largeur est retenue **par onglet** — la carte se lit large,
  l'argent tient en une colonne étroite — et d'une session à l'autre.
- **Une étape** : une pastille-lettre (A, B, C… dans l'ordre du trajet — grisée et légendée quand
  le lieu n'est pas géolocalisé, donc absent de la carte), un titre éditable en ligne suivi sur la
  même ligne de ses dates calculées (« sam. 13 juin → lun. 15 juin », la seule date d'arrivée si
  0 nuit), puis en dessous sa date d'arrivée libre si elle est saisie dans la modale, et ses notes.
  Ensuite sa ligne : un select de type d'hébergement, un select de lieu (**un lieu ou un
  hébergement**, les deux dans le même select, exclusifs), la pastille de statut de l'hébergement
  quand le lieu en est un — la même que celle de la page Hébergements, et modifiable ici, où l'on
  voit le trajet entier —, un select de nuits (0 à 14), et en bout de ligne le coût. Le bord gauche de la
  carte porte la couleur du **statut de l'étape** — le même que son segment du fil d'itinéraire :
  réservé, à réserver, à l'étude, en recherche, sans hébergement, à revoir. Ce statut se nomme aussi
  en toutes lettres, dans un tag teinté posé en bout de carte au-dessus du montant : il est déduit
  et non saisi, donc sans bordure et sans geste, et son infobulle dit d'où il vient. Le fond de la carte prend la même
  couleur, très diluée — la teinte du statut, mais jamais sa texture : des rayures sur une carte
  entière mangeraient le contenu.
  Une étape masquée ne le porte pas, elle est hors du voyage ; la pastille-lettre, elle, reste neutre
  — elle dit le rang de l'étape et non son état. Les pastilles passent à la ligne plutôt que de se réduire, une
  colonne étroite ne devant jamais rendre un select inatteignable ; un champ vide se montre en
  pastille creuse (« ＋ type », « ＋ lieu ») au lieu de s'effacer. Réordonnable en la glissant par
  sa poignée ⠿ — la carte survolée montre la ligne où l'étape atterrira, au-dessus ou au-dessous selon la moitié visée ; le titre reste
  éditable en ligne, d'où la poignée plutôt qu'une carte entièrement attrapable. Duplicable,
  masquable, supprimable. Son coût se lit **en haut à droite** de la carte, sur le modèle du total
  d'un scénario dans la liste : le montant qui compte en gros, et sous lui celui qu'un budget
  remplace ou l'invite à le saisir. Ses quatre actions se posent **en bas à droite** et
  n'apparaissent qu'au survol, la seule zone libre — en haut elles couvriraient le prix.
- **Un groupe** : ses flèches ↑↓ et son nom en tête — celui de l'étape qui s'est ouverte en
  options, éditable en ligne comme un titre d'étape, puisque les colonnes comparent des façons de faire _cette_ étape-là
  et que chacune de leurs cartes garde son propre nom —, la date à laquelle il commence, et le
  compte de ses colonnes. Elles se posent côte à côte dans la largeur, chacune empilant de vraies
  cartes d'étape, sur un fond en creux dont elles se détachent. En tête de colonne, ses seuls
  gestes, alignés à droite : la pastille ◉ / ○ qui la retient et, à partir de trois colonnes, le ✕
  qui la retire avec ses étapes ; au pied, ses nuits et son coût, alignés en bas quelle que soit la
  hauteur de la colonne d'à côté, puis « Garder celle-ci » tant qu'elles ne sont que deux. Au bout
  de l'en-tête, le compte des colonnes et l'œil qui masque le groupe, seule action qu'il porte en
  propre. Une colonne ne porte pas de titre : le groupe dit ce qu'on compare, et les cartes disent
  chacune la sienne. La colonne retenue est cernée de jaune — liseré, fond, trait au-dessus de son
  pied et pastille pleine : on la repère sans la lire. Toutes les colonnes
  partent du même jour et se datent comme si elles étaient retenues, sinon rien ne les comparerait ;
  seules les cartes de la colonne retenue portent une lettre, les autres n'étant sur aucun tracé.
  Le ＋ sous la rangée ajoute une colonne, qui recopie les étapes de celle qui est retenue — on n'en
  change qu'un bout — et le ＋ dans une colonne y insère une étape de plus.
- **Comparer commence sur l'étape qu'on a** : le `＋ option` d'une carte d'étape en fait la première
  colonne d'un groupe neuf et pose sa copie en seconde. La colonne qui vient de naître s'allume le
  temps qu'on la retrouve parmi les autres.
- **La comparaison se termine par le choix d'une colonne.** À deux colonnes, retirer l'une revient à
  défaire le groupe : c'est donc « Garder celle-ci » qu'on y trouve, et pas le ✕. Les autres colonnes
  se replient sous les yeux, puis celle qu'on garde redevient une étape ordinaire du fil, allumée à
  son tour. Un groupe qui retombe à une seule colonne autrement — dernière étape supprimée, étape
  sortie au glisser — se défait de même : ses étapes redeviennent ordinaires et ses lignes communes
  rejoignent la première d'entre elles, seul endroit où elles peuvent tenir.
- **Le type restreint les hébergements, jamais les lieux** : posé sur une étape, il réduit le
  select de lieu aux hébergements de ce type ; les lieux ferment la liste quel qu'il soit, une
  étape se posant quelque part avant qu'on sache où l'on y dort. Changer de type efface un
  hébergement qui n'en relève plus, sinon la pastille montrerait un lieu absent de sa propre liste ;
  le lieu, lui, reste. Le select de lieu s'ouvre sur un champ de recherche qui interroge le nom du
  lieu comme ses niveaux — « Toscane » trouve tout ce qui y est — et une **ville qui manque s'y crée
  sous le nom tapé** : elle entre dans les lieux du voyage avec le type Ville, l'étape la prend pour
  lieu, et le reste se complète depuis la page Lieux & activités. Chaque
  hébergement de la liste porte un ↗ en bout de ligne, qui ouvre sa fiche en panneau sans quitter le
  scénario : un prix ou une adresse se vérifie là où l'on choisit.
- **Le fil du trajet** : sous l'en-tête du détail, une bande de maillons, un par étape retenue,
  dans l'ordre du trajet. Chacun porte un trait de la couleur de son avancement — la même échelle
  que la bande de la liste —, qu'une préférence bascule sur la couleur du type
  d'hébergement — depuis les Réglages comme depuis le ⋮. Il porte aussi sa lettre, son nom et ses nuits, et il est large comme ses nuits,
  en cliquable : le maillon mène à sa carte. Il reste collé sous l'en-tête quand la liste défile,
  puisque c'est là qu'il sert. Il ne s'affiche qu'à partir de deux étapes retenues, et une
  préférence des Réglages le montre ou le cache — sur un scénario court la liste dit déjà tout.
- **Créer une étape** : le ＋ entre deux rangées comme le bouton de l'en-tête ouvrent le même choix,
  « Créer une étape » ou « Créer une étape avec options » — la seconde pose un groupe de deux
  colonnes d'emblée. Dans une colonne, le ＋ n'a qu'un geste, donc pas de menu : l'étape y naît.
- **La modale d'étape** édite les nuits et le budget de l'étape. Le lieu, lui, ne se choisit que
  sur la carte.
- **Masquer une étape ou un groupe** (l'œil, à gauche de la corbeille dans les actions de la carte,
  au bout de l'en-tête pour un groupe) : l'œil barré dit que c'est déjà masqué. La carte prend alors
  une bordure en pointillés et un fond hachuré, son contenu s'efface à moitié sans rien perdre de ses
  couleurs, sa pastille devient un point, ses dates disparaissent, et le scénario se lit comme si
  elle n'existait pas — la matière dit de loin ce qui est mis de côté. Sur un groupe, le geste
  emporte toutes ses colonnes. Sert à comparer deux variantes d'un même trajet sans rien perdre.
- **Dupliquer une étape** (⧉) : la copie s'insère **juste sous** l'originale, champs identiques, sans
  suffixe au nom — on ajuste l'une des deux, ou on en masque une.
- **Insérer une étape entre deux autres** : un `＋` apparaît au survol de l'espace qui sépare deux
  cartes et pose à cette position une étape vide d'une nuit, qu'on remplit sur la carte. Le bouton
  « Ajouter une étape » de l'en-tête ouvre la modale et ajoute en fin de liste.
- **La route entre deux étapes** : la bande qui sépare deux cartes porte son tronçon routier —
  le temps de conduite puis la distance, « 1 h 11 » sur « 55 km », l'un sous l'autre, lus dans le
  même itinéraire que le tracé de la carte. Seules deux étapes voisines, toutes deux visibles et géolocalisées, en portent un : un
  tronçon qui enjamberait une étape masquée, écartée ou sans lieu ne dirait pas la distance des
  deux cartes qu'on lit. Dans un groupe, il se lit donc entre deux cartes de la colonne retenue. Le `＋` d'insertion sort à droite du libellé au survol.
- **La gouttière du scénario** : à gauche de la liste, un trait vertical court d'un bout à l'autre
  et porte un point par étape ; l'écart entre deux points est la route qui les sépare, le plus long
  tronçon du scénario tenant l'écart plein et les autres s'y rapportant, avec un plancher qui garde
  le plus court lisible. Le trait est d'un seul tenant, à une seule largeur : c'est l'écart entre
  deux points qui dit la route, la grossir ne le dirait pas deux fois. Un point tombe à la hauteur
  de la pastille-lettre de sa carte, centré sur le trait. Il longe le bord gauche et la gouttière ne
  porte que lui : la bande entre deux cartes tient le ＋ qui ouvre une étape au milieu de leur
  largeur, et la route chiffrée à son bord droit, sur la même ligne que le ＋. Le ＋
  ne s'y montre qu'au survol, et la bande ne descend jamais sous sa hauteur, sinon il déborderait sur
  les cartes.
- **Le select de lieu** : les hébergements d'abord, un groupe par type dans l'ordre du vocabulaire
  — ceux sans type connu fermant la marche —, puis les lieux, groupés par type de la même façon.
  Dans chaque groupe, les favoris
  passent en tête, précédés d'une ★, le reste est trié par nom. Chaque en-tête de groupe le replie
  et dit alors combien il cache ; une recherche déplie tout, sinon un groupe replié cacherait ce
  qu'on vient de taper.
- **Les lignes d'une étape** : sous la ligne du lieu de chaque carte, et sous les colonnes d'un
  groupe pour celles qui lui sont communes, un bloc par porteur — une ligne par activité ou dépense, sur une grille à elle : le nom
  précédé de l'emoji de son type (💰 pour une dépense) prend la largeur, le nombre et le montant
  s'épinglent à droite. Un nombre de 1 et un montant vide ne s'affichent qu'au survol de leur ligne,
  sans la quitter — sa hauteur ne saute pas sous la souris. La pastille du nom ouvre un menu qui
  détache la ligne ou la remplace par une autre du même genre : une activité par une activité, une
  dépense par une dépense. Un porteur ne porte jamais deux fois la même.
- **Rattacher depuis la carte** : la dernière ligne du bloc est un `＋ ajouter` qui porte à sa
  droite le total du porteur. Son menu s'ouvre sur un champ de recherche qui interroge d'un coup les
  activités du voyage et ses dépenses, rendues en deux groupes — on cherche un nom sans se demander
  de quelle table il vient. `Entrée` prend la première correspondance, l'activité avant la dépense.
  Un nom sans correspondance se crée sur place, dans l'un ou l'autre vocabulaire : l'entrée ne porte
  alors que son nom, le reste se complète depuis sa page. La modale d'étape, elle, ne montre et
  n'ajoute que les activités de l'étape : les dépenses et les lignes communes à un groupe se posent
  sur la carte, là où l'on voit à quel porteur elles appartiennent.
- **Le champ activités de la modale d'étape** : les chips de ce qui est attaché, puis un champ de
  recherche dont la liste s'ouvre **au focus** — sans requête elle propose tout ce qui n'est pas
  déjà attaché, la création n'apparaissant qu'une fois un nom tapé. `↑` et `↓` déplacent le résultat
  marqué, `Entrée` le prend, `Échap` referme la liste. Le survol marque le même résultat que les
  flèches : il n'y en a jamais deux en avant.
- **Coût d'une étape** : prix/nuit de l'hébergement × nuits. Un budget saisi à la main le remplace ;
  tant qu'il est vide, le total calculé reste affiché en gris. Rien ne s'affiche sur une étape
  rattachée à un lieu — seul un hébergement porte un prix. Ses lignes se comptent à part et se rangent
  par genre dans le Total général — une activité dans la famille Attractions, une dépense avec les
  Charges : celles des étapes retenues plus celles des groupes qu'elles traversent, les colonnes
  écartées étant des comparaisons.
- **Voiture** : un menu rangé par location — un loueur, ses dates, et dessous les véhicules qu'on y
  a relevés, chacun avec ce qu'il coûtera sur les jours de ce scénario. Son coût est le prix / jour
  de la voiture × jours du scénario : le prix total saisi porte sur les dates de la location, pas
  sur celles d'un scénario. Un scénario créé naît avec la **voiture par défaut** rattachée : c'est
  une valeur de départ, pas un repli — « Aucune voiture » reste un choix qui tient, et les
  scénarios existants ne bougent pas. Le menu se ferme sur **Ajouter une voiture**, qui ouvre la
  fiche d'une offre : celle qu'on y enregistre est rattachée au scénario, on relève une offre
  manquante sans quitter le scénario.
- **Les options de cette voiture**, sous le menu : une ligne à cocher par option du catalogue de son
  loueur, avec ce qu'elle coûte ici — un forfait reste entier, un prix par jour se répète sur les
  jours du scénario, un prix par personne sur les voyageurs. Choisir un véhicule coche ce qui l'est
  chez le loueur : c'est le point de départ, que le scénario reste libre de défaire. Le total du
  bloc, et la ligne Voiture du Total général, comptent les options.
- **Transports** : une ligne par trajet retenu — le mode, le départ vers l'arrivée, l'horaire et le
  prix — puis deux gestes en pied, « Rattacher un trajet » qui liste ceux du voyage encore libres,
  et « Ajouter un trajet » qui ouvre la modale Transports et rattache le nouveau au retour. Le ✕
  retire du scénario sans supprimer le trajet, qui reste sur la page Transports. Un même vol se
  rattache donc à plusieurs scénarios : c'est ce qui permet de les comparer. Le bloc n'additionne
  rien — un prix de trajet est souvent une fourchette, et le Total général ne compte que des
  montants fermes.
- **Dépenses**, sous le bloc Voiture, dans sa propre teinte pour ne pas se lire comme une étape :
  une ligne par dépense rattachée (libellé, montant, ✕), le total en tête. Deux gestes en pied —
  « Rattacher une dépense » liste celles du voyage qui ne le sont pas encore, « Ajouter une
  dépense » ouvre la modale Dépenses et rattache la nouvelle au retour. Le ✕ retire du scénario
  sans supprimer la dépense, qui reste sur la page Dépenses.
- **Total général**, le seul bloc de chiffres de l'écran : quatre familles — Hébergements, Charges
  (la voiture et les dépenses), Route, Attractions — puis le total des nuits et le montant. Les GuestPoints y
  gardent leur propre montant, à côté des euros : « Hébergements en GP » est une ligne à part, hors
  des familles, puisqu'ils ne s'additionnent à rien.
- **Une famille se déplie au chevron** et porte son détail, fermé par une ligne « Total ». Son
  montant se lit en face de son titre, repliée comme dépliée, et la ligne de pied le redit sous le
  détail. Les familles sont indépendantes — les trois peuvent rester ouvertes — et chacune garde son
  dépli d'une session à l'autre, comme la carte.
- **Le détail des hébergements** : une ligne par arrêt, **dans l'ordre du trajet** — un lieu où
  l'on dort (lieu · nuits · dates · total), une étape sans nuit avec sa seule date. Le départ, le
  retour et les haltes sont donc dans la liste au même titre que les nuitées : sans eux, la route
  qui part du premier ou mène au dernier n'aurait pas d'origine lisible. Un lieu revisité tient sur
  une seule ligne, ses nuits additionnées et ses dates listées, placée à sa première date. Les
  nuits en home exchange y figurent avec leur montant en GuestPoints.
  Toutes les lignes s'ouvrent sur la même gouttière d'icône — le type de l'hébergement, celui du
  lieu quand l'étape s'y pose, rien pour une étape de passage — d'une largeur fixe : les noms s'alignent, qu'une ligne
  porte une icône ou non. Chaque arrêt est précédé du temps de conduite pour y arriver — « 🚗 1 h
  11 », sur sa propre ligne, l'icône dans la même gouttière et le chiffre aligné sur les noms, sans
  la distance : le récap dit combien de route il y a d'un lieu au suivant, les
  kilomètres se lisent dans la gouttière de la liste d'étapes. Le filet passe au-dessus de ce temps
  et non sous lui : on arrive quelque part, donc la route et le lieu où elle mène se lisent d'un
  bloc. Il vient
  du même itinéraire que le tracé et n'apparaît qu'une fois la réponse revenue ; seules deux étapes
  voisines et géolocalisées en portent un — la toute première étape du trajet n'ayant rien avant
  elle, sa ligne n'en porte pas.
- **Le détail des charges** : la voiture, puis **une ligne par dépense** — celles rattachées au
  scénario d'abord, puis celles posées sur ses étapes et ses groupes, avec leur nombre quand il
  dépasse un. Pas de ligne « Dépenses » qui les additionnerait : le détail d'une famille nomme ce
  qu'elle contient, et un budget essence se lit sous son nom.
- **Le détail de la route** : les kilomètres du tracé, l'essence qu'ils brûlent, les péages qu'ils
  coûtent. Chaque ligne redit le taux dont vient son montant — « 6,5 L/100 · 1,85 €/L » pour
  l'essence, « 0,08 €/km » pour les péages —, parce qu'une estimation ne se lit que si l'on voit sur
  quoi elle repose. L'essence tient à la consommation du modèle loué par le scénario : sans offre
  retenue, ou sans consommation relevée sur le modèle, la ligne le dit et ne chiffre rien. Les
  kilomètres viennent du même itinéraire que le tracé, donc la famille ne chiffre rien tant que la
  réponse n'est pas revenue.
- **Le détail des attractions** : une ligne par activité rattachée aux étapes, dans l'ordre du
  trajet, avec son nombre quand il dépasse un. Une dépense rattachée à une étape n'y figure pas :
  elle se range dans le détail des Charges, aux côtés des dépenses du scénario.
- **Les totaux se calculent par étape** : le coût d'une étape (budget saisi, sinon prix/nuit ×
  nuits) alimente aussi bien la ligne de son lieu que les totaux du scénario.
- **Trajet** : une pastille par étape portant sa lettre, le tracé routier réel, et des chevrons
  réguliers qui en donnent le sens. Deux étapes au même endroit partagent une pastille (« A·G »), et
  son popup liste leurs dates et leurs nuits. Le bloc est partagé avec la vue Carte.

### Carte

Aucune entité propre — l'écran lit :

| Entité          | Champs lus                        | Notes                               |
| --------------- | --------------------------------- | ----------------------------------- |
| **Hébergement** | coordonnées, favori, ses colonnes | sans coordonnées, pas de marqueur   |
| **Lieu**        | coordonnées, favori, ses colonnes | sans coordonnées, pas de marqueur   |
| **Scénario**    | étapes                            | choisi en filtre, il donne le tracé |

Les deux collections géolocalisées, chacune en couleur par type : un hébergement est un disque,
une attraction une pastille portant l'emoji de son type — la couleur dit la famille, la forme dit
la collection.

Les filtres se lisent **dans une colonne à gauche de la carte**, toujours ouverte : on coche et on
voit le tracé changer sans rien déplier. Le bouton « Filtrer » de l'en-tête, celui des listes, porte
le même contenu pour qui préfère le panneau. Les deux portent **un bloc par collection** : une
case qui la met à l'écran, et sous elle sa propre pile de niveaux. Les deux jeux sont indépendants —
on règle celle qu'on déplie, l'autre reste tracée avec les siens — et décocher une collection donne
« seulement les Airbnb de Toscane » sans décocher le reste type par type. ⭐ Favoris ferme le
panneau ; son badge compte les niveaux actifs, les favoris et les collections retirées.

Une **ville se crée depuis la carte**, là où on voit le trou : le panneau « ＋ Ville » de l'en-tête
prend un nom, « Localiser » rend les résultats du géocodage, et cliquer l'un d'eux pose une
attraction de type Ville — le nom du résultat, ses coordonnées et ses quatre niveaux. Sa pastille
apparaît aussitôt sur la carte. Le panneau ne porte que la recherche : le statut, les tags et la
description se remplissent depuis la page Lieux & activités, et les coordonnées saisies à la main
restent l'affaire de la modale.

Le **scénario** reste dans l'en-tête, hors du panneau : il trace le trajet plus qu'il ne filtre, et
c'est lui qui porte le message d'état de l'itinéraire — enfermé dans un panneau fermé, on ne le
lirait plus. Choisir un scénario trace son trajet et ne garde que les lieux qu'il utilise —
l'hébergement de chacune de ses étapes retenues, et les activités attachées à ces étapes ou aux
groupes qu'elles traversent.

La pastille d'une étape ouvre ce que l'étape sait : ses dates et ses nuits, son statut de
réservation, l'hébergement retenu avec son coût, ses notes. Trois liens ferment le popup — le site
de l'hébergement, sa page Booking, et sa fiche, qui s'ouvre en panneau par-dessus la carte. Un
lieu où le trajet repasse empile ses étapes dans le même popup.

### Notes

**Notes de voyage**

| Champ | Détail             |
| ----- | ------------------ |
| texte | un bloc par voyage |

Une zone de texte libre, partagée. Enregistrée à la frappe, sans re-render.

### Valise

Deux entités : un **catalogue** personnel (`packingItems`), sans `travelId` — seule collection de
l'app qui n'est pas scopée par voyage — et la **valise du voyage** (`packingListItems`), scopée par
`travelId`. Un item de la valise référence un item du catalogue (`packingItemId`) ou porte son
propre libellé et ses catégories s'il est né dans ce voyage (maillot de bain) ; quand il référence
le catalogue, le libellé et les catégories se lisent là-bas et ne sont jamais recopiés — les
modifier au catalogue les change partout où l'item est utilisé.

| Champ (catalogue)  | Détail                          |
| ------------------- | -------------------------------- |
| libellé, catégories | catégories en tags libres        |
| notes                | libre                            |

| Champ (valise du voyage) | Détail                                                          |
| -------------------------- | ---------------------------------------------------------------- |
| référence catalogue        | optionnelle ; vide pour un item propre au voyage                 |
| libellé, catégories        | seulement si pas de référence catalogue                          |
| quantité                   | un nombre fixe, ou « 1 par nuit » (déduite du scénario retenu)   |
| coché                      | emballé ou non                                                   |

La page **Valise** (nav, après Notes) empile deux listes, comme l'onglet Voitures empile Offres et
Modèles : la valise du voyage ouvert en premier — table éditable, case à cocher et compteur
« X / Y » en tête, un panneau « Ajouter depuis le catalogue » (dropdown des items pas encore dans
cette valise) et un bouton « + Item du voyage » pour un item propre — puis le catalogue dessous, en
référence, avec son propre `+ Item`. Supprimer un item du catalogue référencé ailleurs détache les
lignes qui le référençaient : elles gardent son libellé et ses catégories, figés sur elles.

Le détail d'un scénario porte un troisième onglet dans son panneau latéral, à côté de Carte et
Argent (voir plus haut) : **Valise**, compact comme le bloc Dépenses — case à cocher, libellé,
quantité, retirer — avec le même panneau « Ajouter depuis le catalogue » et le même « + Item ». La
valise y montrée est celle du voyage ouvert, pas une valise propre à ce scénario : elle est donc
identique quel que soit le scénario dont on regarde le détail.

Une maquette d'une composition plus travaillée (catalogue groupé par catégorie, panneau de
composition, badges catalogue/voyage) existe en artifact — voir PLAN.md — à reprendre si le picker
actuel (une simple liste déroulante) ne suffit pas.

### À faire

**Liste dynamique** — une question posée à une collection, pas des lignes qu'on saisit. L'écran
réunit ce qui reste à traiter dans le voyage : les hébergements à booker, les transports à
réserver, les voitures encore en attente.

| Champ     | Détail                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| ressource | la collection lue : Hébergements, Lieux & activités, Transports, Offres, Dépenses |
| colonne   | la colonne sur laquelle la liste filtre                                           |
| valeurs   | les mots gardés sur cette colonne — OU entre eux                                  |

Le builder tient les trois en tête de page : deux selects, puis la rangée des valeurs à cocher.
Une colonne n'est proposée que si elle porte des **mots** — son vocabulaire (statut, type, mode)
ou ceux que ses lignes portent (ville, province, récurrence) ; un prix, une date, un favori n'en
portent pas, et une égalité sur un nombre ne filtre rien. Une valeur n'est proposée que si une
ligne la porte vraiment.

Chaque liste montre le tableau de sa page d'origine, ses colonnes visibles et ses éditions en
place : on change un statut là où on le lit, et la ligne quitte la liste. La rangée de pastilles
reste sous le titre — c'est là qu'on ajoute ou retire un mot, une liste n'a pas de mode édition.
Changer de ressource ou de colonne, en revanche, fait une autre liste.

Les listes vivent dans le Sheet comme le reste du voyage : elles se retrouvent sur un autre
appareil.

---

## 5. Règles transverses

### Filtrer

Le même panneau sur toutes les listes, sur la forme de « Trier » : une **pile de niveaux**, un
niveau étant une colonne et les mots qu'on y garde.

```
Filtrer par [ Type   ▾ ] [ Airbnb, Hôtel ▾ ] ✕
et          [ Région ▾ ] [ Toscane       ▾ ] ✕
＋ Ajouter un niveau
```

- **OU dans un niveau, ET entre niveaux** — « les Airbnb et les hôtels, en Toscane ». L'ordre des
  niveaux ne change rien au résultat : ils se cumulent tous, et il n'y a donc rien à y ranger.
- **Une colonne se propose dès qu'elle porte des mots** : son vocabulaire (statut, type, mode), ou
  ceux que ses lignes tiennent (ville, tag, catégorie). Un prix, une date, un favori n'en portent
  pas. Une colonne qui tient une **liste** — les tags, les catégories d'une dépense — donne ses
  mots un à un : on filtre sur un tag, pas sur la suite de tags d'une ligne.
- **Seules les valeurs qu'une ligne porte vraiment** sont proposées, et une colonne qui n'en a
  qu'une disparaît : un statut que personne n'a ne filtrerait rien. Une valeur cochée puis retirée
  de sa dernière ligne sort du filtre toute seule.
- **Les mots se cochent dans un menu déroulant**, pas dans une rangée à plat : un `<select>` ne sait
  ni en garder plusieurs ni porter une pastille. Le menu ne fait que cocher — ranger l'ordre des
  mots reste au panneau « Trier », qui est le seul endroit d'où cet ordre se règle. Au-delà de huit
  valeurs, un champ de recherche réduit la liste sans masquer ce qui est déjà coché.
- **Le filtre est le geste en cours**, pas une préférence : il ne survit pas au rechargement,
  contrairement au tri et aux colonnes masquées. Il vit par **écran** — filtrer la carte ne filtre
  pas la page —, et là où l'écran ne désigne pas une seule liste (la carte, « À faire »), un
  premier menu dit laquelle.

- **Adresse d'une page** : le `#` de l'URL dit où on est — `#carte`, `#hebergements`,
  `#scenario/<id>` pour le détail d'un scénario. Recharger revient au même endroit, et les flèches
  du navigateur parcourent les pages visitées. Une adresse inconnue laisse la page courante ; un
  scénario supprimé retombe sur la liste. Sans `#`, l'app ouvre le scénario **TEST** comme avant.
- **Suppression** : toujours confirmée, jamais de corbeille.
- **Fermer un formulaire sur une saisie non enregistrée** pose la question dans l'app, jamais dans
  le `confirm` du navigateur : « Enregistrer les modifications ? », avec le choix d'enregistrer, de
  fermer sans enregistrer, ou de revenir au formulaire. La question se pose par-dessus les champs
  sans les re-rendre — ils ne vivent que dans l'écran tant qu'ils ne sont pas lus.
- **Entrée enregistre, Échap ferme** dans toute modale comme dans tout panneau. Un champ qui traite
  déjà la touche la garde : Entrée ajoute un tag, choisit un résultat, et va à la ligne dans une
  zone de texte.
- **Ce qui vient d'apparaître s'allume** : un geste refait toute la page, donc ce qui naît d'un clic
  — et ce qui reste quand une comparaison se termine — se cerne de jaune une seconde et se ramène
  sous les yeux. Une sortie s'anime avant d'être écrite : ce qui s'en va se replie d'abord. Les deux
  animations tombent à rien quand le système demande de réduire le mouvement.
- **Barre d'outils** : les mêmes contrôles, dans le même ordre, en haut à droite de chaque écran —
  « Trier », « Filtrer », « Colonnes », les filtres propres à l'écran, la bascule tableau / cartes,
  « Ajouter », puis le menu ⋮. Chacun porte une icône, et un compteur quand il a quelque chose
  d'actif. « Trier » et « Filtrer » sont deux panneaux distincts. Le détail d'un scénario a la
  sienne : date de départ, bascule de la carte, « Ajouter une étape », ⋮.
- **Dropdown inline** : le menu d'un tag se pose par-dessus la page, hors du cadre qui porte sa
  cellule — le tableau, qui défile horizontalement, rognerait sinon celui des dernières lignes. Il
  s'ouvre sous son déclencheur, au-dessus quand la place est de ce côté, et se referme dès qu'on
  fait défiler.
- **Libellés des boutons** : une option unique pour toute l'app, qui affiche ou masque le texte à
  côté des icônes. Elle se change dans les Réglages de la barre latérale ou depuis le menu ⋮ de
  n'importe quelle liste. Icône seule, le libellé reste lisible au survol.
- **Icônes** : le chrome de l'app — barre latérale, barres d'outils, onglets, boutons d'action,
  état de la synchro — est dessiné en trait, jamais en emoji. Une icône prend la couleur et la
  taille du texte qui la porte. Les **vocabulaires** gardent leurs emoji : types et statuts
  d'hébergement, d'activité, de transport et de voiture, motorisation, boîte, récurrence, statut
  d'étape, et l'emoji que porte un voyage — ce sont des données qu'on choisit, pas du décor.
  Là où les deux se côtoient dans une même liste (le menu de lieu d'une étape, les lignes du
  récap, les dépenses dérivées), l'emoji l'emporte : une rangée ne mélange pas les deux.
- **Fermeture d'une modale de saisie** (création comme modification) : confirmée dès qu'un champ a
  été touché, que la fermeture vienne du clic sur le fond ou du bouton « Annuler ». Une modale
  restée telle qu'ouverte se ferme sans rien demander.
- **Duplication** : hébergements, lieux, voitures, charges, transports et scénarios se
  dupliquent depuis leur ligne. La copie reprend tous les champs, prend un nouvel identifiant et son
  nom est suffixé « (copie) » — une voiture dupliquée ne reprend pas le statut « par défaut », et un
  transport, qui n'a pas de nom, se copie tel quel.
- **Budget et prix** : deux notions distinctes, jamais un champ `type` pour les départager. Le
  budget est l'enveloppe qu'on se donne, saisie à la main et optionnelle ; le prix est ce que ça
  coûte vraiment, en fourchette `prix mini` / `prix maxi`. La fourchette gagne dès qu'un de ses
  deux montants est saisi, et la cellule dit laquelle des deux elle affiche (« budget 150 € »).
  Une entité sans prix **est** une enveloppe. Implémenté sur les transports ; les charges fixes,
  les hébergements et les voitures gardent pour l'instant leur champ de prix unique.
- **Nuits et jours** : les nuits sont saisies, les jours s'en déduisent — un séjour de N nuits dure
  N+1 journées, on arrive la première et on repart le lendemain de la dernière ; sans nuit il n'y a
  pas de journée. Ce qui se loue à la journée se compte donc en jours : une location de voiture se
  prend le jour de l'arrivée et se rend celui du départ.
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

Les manques structurants sont tenus par la [map des parcours](map-user-flows.md#06--ce-que-la-map-met-à-nu),
qui rattache chacun au parcours qu'il casse, et par le fichier de l'objectif concerné dans
[docs/flows/](flows/). Le suivi détaillé, lui, vit dans [PLAN.md](../PLAN.md).
