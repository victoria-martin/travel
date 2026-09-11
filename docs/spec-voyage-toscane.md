# Spec produit — Voyage Toscane

Spec fonctionnelle de l'app, écrite comme exemple de format : **décisions actées** en tête,
**modèle de données** ensuite, puis **un bloc par écran** qui dit ce qu'on voit, ce qu'on peut
faire et les règles qui ne se devinent pas. Le backlog ne vit pas ici mais dans
[PLAN.md](../PLAN.md), pour que la spec reste la description de ce qui existe.

Documents liés : [blueprint réutilisable](blueprint-app-sheet.md) · [protocole de synchro](protocole-sync-sheet.md)

---

## 1. Objectif

Préparer un voyage à plusieurs : rassembler des hébergements candidats, les situer sur une carte,
et **comparer plusieurs itinéraires chiffrés** avant de réserver quoi que ce soit.

- **Utilisateurs** : deux à quelques personnes, toutes avec les mêmes droits, chacune sur son
  navigateur. Pas de compte, pas de rôle.
- **Ce que l'app n'est pas** : ni un moteur de réservation, ni un agrégateur d'offres. Tout est
  saisi ou collé à la main ; les liens externes restent des liens.

---

## 2. Décisions actées

Les arbitrages qui ne se relisent pas dans le code, et dont tout le reste découle :

- Le prix d'un hébergement est un prix **par nuit** → total d'un lieu = prix × nuits.
- Le prix d'une voiture et le montant d'une charge sont pris **tels quels**, sans multiplication.
- Un scénario porte **une** voiture et **plusieurs** charges fixes, **en référence** aux tables
  Voitures et Charges fixes — jamais des copies.
- Un home exchange se paie en **GuestPoints** : ces montants ne s'additionnent **jamais** aux
  euros. Ils ont leur propre ligne de total.
- Un prix se saisit en texte libre (`120`, `1 200,50 €`) : seul le nombre est extrait pour les
  calculs, l'affichage garde la saisie.
- Un budget saisi sur une étape **remplace** le prix calculé de l'hébergement, et reste en euros
  même sur une étape en GuestPoints.

---

## 3. Modèle

| Entité              | Porte                                                                                                                              | Notes                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Hébergement**     | type, statut, nom, adresse, ville, province, région, coordonnées, prix/nuit, dates, lien, lien de réservation, notes, tags, favori | la fiche de référence ; c'est elle qui porte le prix |
| **Ville**           | nom, adresse géocodée, coordonnées, province, région, notes                                                                        | une étape de passage sans nuit, ou un repère         |
| **Voiture**         | loueur, modèle, prix, dates, lieu de prise en charge, lien, notes, **par défaut**                                                  | liste simple ; une seule voiture par défaut          |
| **Charge fixe**     | libellé, montant, catégorie, récurrence, notes                                                                                     | liste simple                                         |
| **Scénario**        | nom, favori, voiture, charges, **étapes**                                                                                          | un itinéraire candidat                               |
| **Étape**           | lieu (une ville **ou** un hébergement), date d'arrivée, nuits, budget, notes                                                       | appartient à un scénario, l'ordre compte             |
| **Notes de voyage** | texte libre                                                                                                                        | un seul bloc, partagé                                |

**Type d'hébergement** — Home exchange 🔁 · Hôtel 🏨 · Maison 🏡 · Camping ⛺.
**Statuts**, dans l'ordre du workflow, qui est aussi l'ordre de tri : Réservé 🔒 · Contacté ✉️ ·
Attente réponse ⏳ · À booker 💳 · Go ✅ · Intéressé 👍 · À voir 👀 · Pas dispo 🚫 · Écarté 👎.

> Les deux listes vivent dans une map unique qui pilote à la fois les selects, les couleurs de la
> carte et l'ordre de tri de leur colonne. Les réordonner change le tri.

---

## 4. Les écrans

### Hébergements

La vue principale, en **tableau ou en cartes**.

- **Colonnes** : favori, nom (+ notes en dessous), type, statut, ville, province, région, tags,
  adresse, prix, dates, notes, lien, Booking, actions. Région, adresse et notes sont masquées par
  défaut ; nom, favori et actions ne sont jamais masquables. Le sélecteur « Colonnes » garde le
  choix d'une session à l'autre.
- **Tri** — panneau « Trier & filtrer » : une liste ordonnée de critères (« statut, puis ville »),
  chacun avec son sens, réordonnable. Le clic sur un en-tête est le raccourci : il remplace tout
  par un tri simple et cycle croissant → décroissant → aucun. Tri de départ : favoris, puis type,
  puis statut. Les favoris sont un critère comme un autre.
- **Filtres** : ⭐ favoris uniquement, et par tag — un hébergement sort dès qu'il porte **un** des
  tags cochés. Le bloc de tags est dans le même panneau que le tri, donc absent en mode cartes.
- **Édition en ligne** : type, statut et notes se changent directement dans la ligne, sans ouvrir
  la fiche.
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
- **Import depuis un tableau** : coller des lignes copiées d'un tableur crée les hébergements
  correspondants ; type et statut sont reconnus depuis le texte, sinon valeurs par défaut. Le
  formulaire existe mais **aucun bouton ne l'ouvre aujourd'hui** (cf. [PLAN.md](../PLAN.md)).

### Villes

Liste triée par nom : nom, lieu (adresse géocodée, ou province · région), coordonnées, notes. Même
bloc de localisation que les hébergements. Sert à poser une étape de passage sans nuitée.

### Voitures · Charges fixes

Deux listes simples, mêmes gestes : tableau ou cartes, ajout/modification en modale, suppression
confirmée. Aucune colonne masquable, aucun tri configurable — le besoin ne s'est pas présenté.

- **Notes éditables en ligne**, comme sur les hébergements : sous le libellé dans le tableau, sur la
  ligne 📝 des cartes.
- **Voiture par défaut** : un rond ◉ en tête de ligne. Une seule voiture à la fois — la marquer
  démarque les autres, la re-cliquer n'en laisse aucune.
- Le **lien** d'une voiture s'ouvre depuis la ligne (« Voir ») ou depuis sa carte (« Lien »).

### Scénarios

- **Liste** : nom, nombre d'étapes, total des nuits, étoile de favori — les favoris remontent en
  tête. Actions : ouvrir, dupliquer (copie profonde, nouveaux identifiants, nom suffixé
  « (copie) »), supprimer.
- **Détail**, en deux colonnes : étapes + voiture + récap à gauche, bloc « Trajet » dans une
  colonne de droite collante. Bouton « Masquer / Afficher la carte », dont l'état est retenu d'une
  session à l'autre. Sous 1100 px, la carte repasse sous les étapes.
- **Une étape** : titre éditable en ligne, date d'arrivée et notes en dessous, un select de lieu
  (**une ville ou un hébergement**, les deux dans le même select, exclusifs), un select de nuits
  (0 à 14), et en bout de ligne le coût. Réordonnable ↑↓, supprimable.
- **Coût d'une étape** : prix/nuit de l'hébergement × nuits. Un budget saisi à la main le remplace ;
  tant qu'il est vide, le total calculé reste affiché en gris. Rien ne s'affiche sur une étape
  rattachée à une ville — seul un hébergement porte un prix.
- **Voiture** : un select parmi les voitures de la table (« loueur · modèle »), et son coût. Un
  scénario créé naît avec la **voiture par défaut** déjà rattachée : c'est une valeur de départ, pas
  un repli — « Aucune voiture » reste un choix qui tient, et les scénarios existants ne bougent pas.
- **Récap** : une ligne par lieu (lieu · nuits · total), puis « Total hébergements ». Les nuits en
  home exchange ont **leur propre ligne en GuestPoints**.
- **Trajet** : marqueurs des étapes et tracé routier réel, partagé avec la vue Carte.

### Carte

Tous les hébergements géolocalisés, en couleur par type. Filtres : type, province, ⭐ favoris,
et **scénario** — choisir un scénario trace son trajet et n'affiche que les hébergements qu'il
utilise.

### Notes

Une zone de texte libre, partagée. Enregistrée à la frappe, sans re-render.

---

## 5. Règles transverses

- **Suppression** : toujours confirmée, jamais de corbeille.
- **Liste vide** : un message d'état vide qui dit quoi faire, et qui change selon la cause —
  « aucun favori » et « aucun résultat pour ces tags » ne disent pas la même chose que
  « aucune entrée ».
- **Géocodage** : jamais automatique (le service limite à 1 requête/seconde), toujours sur clic, et
  jamais bloquant — les coordonnées restent saisissables à la main.
- **Préférences d'affichage** (colonnes masquées, tri, carte du scénario affichée, panneaux
  ouverts) : propres à chaque navigateur, **jamais partagées**.
- **Tout le reste est partagé** via le Google Sheet, en quelques secondes. Voir le
  [protocole de synchro](protocole-sync-sheet.md) : deux entrées différentes éditées en même temps
  sont toutes deux gardées ; sur la même entrée, la dernière personne qui enregistre gagne.
- **Le Sheet reste éditable à la main** comme un tableur : un onglet par table, une ligne par
  entrée. Ne pas toucher aux colonnes `id` ni aux en-têtes.
- **L'app marche sans synchro** : elle démarre vide, tout fonctionne en local, et la connexion au
  Sheet peut arriver plus tard.

---

## 6. Ce qui reste ouvert

Le suivi détaillé vit dans [PLAN.md](../PLAN.md). Les manques structurants du moment :

- **Total général** d'un scénario (hébergements + voiture + charges) : le récap s'arrête aux
  hébergements.
- **Charges fixes dans le scénario** : la relation existe dans le modèle, l'écran ne l'expose pas
  encore.
- **Totaux par étape plutôt que par lieu** : le récap somme prix/nuit × nuits par lieu, donc un
  budget saisi sur une étape n'entre pas dans le total.
- **Date de départ** du scénario, et donc les dates d'étapes calculées plutôt que saisies.
- **Attractions** : page envisagée, pas encore spécifiée.
