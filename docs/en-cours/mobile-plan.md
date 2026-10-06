# Portage mobile — plan d'exécution pour un agent

Rendre l'app utilisable en étroit (téléphone, petite fenêtre) une fois le layout de page bureau
posé. Le backlog vient de la section 📱 Mobile de [PLAN.md](../../PLAN.md) : chaque lot ci-dessous
en reprend une tâche, avec son marqueur.

## État de départ

- **Navigation** : sous 640px, une barre du bas (4 pages + Plus) remplace la sidebar
  (`src/shell/MobileNav/`). Faite, hors de ce plan.
- **Modales** : sous 640px, toute modale passe plein écran ([styles.css](../../styles.css),
  `@media (max-width: 639px)` près de `.modal-sheet`).
- **Panneaux latéraux** : sous 640px, Carte/Argent/Valise du détail scénario et la carte du jour du
  Journal s'ouvrent en sheet (`onScenarioPanelToggle`, `onJournalPanelToggle`).
- **Layout de page** : posé pour le bureau — pages avec table, seule la table défile ; pages sans
  table, la page défile, en-tête et bandes du haut collés. Les media queries `1100px`, `900px` et
  `640px` de `styles.css` sont antérieures à ce layout et n'ont pas été revues avec lui.

## Règles dures (projet)

- **Jamais de Playwright/navigateur** sur ce projet. Une vérification visuelle se demande à
  l'utilisatrice, écran sous les yeux.
- **Une disposition se dessine avant de se coder** : comparatif ASCII côte à côte, et proposer un
  artifact pour voir le rendu réel.
- `pnpm react:typecheck` passe après chaque lot. Chaque lot se clôt par son commit, PLAN.md (la
  tâche sort) et la spec ([spec-voyage-toscane.md](../spec-voyage-toscane.md)) à jour.

## Lots

### 1. Le layout de page en dessous de 1100px <!--t:k4lz-->

Décider ce que devient le layout de page en étroit, puis l'appliquer à toutes les pages d'un coup.

- Pages avec table : la table garde-t-elle toute la hauteur restante, ou la page redéfile-t-elle ?
- Détail d'un scénario : ses deux colonnes défilent chacune pour soi au-dessus de 1100px ; en
  dessous elles s'empilent. Qu'est-ce qui reste collé en haut (en-tête, bannière météo, fil du
  trajet) quand la page défile en une colonne ?
- Revoir les trois seuils (`1100px`, `900px`, `640px`) : garder ceux qui ont une raison, fusionner
  les autres.

À livrer : la disposition dessinée et validée, puis le CSS du layout en étroit.

### 2. Carte d'étape illisible sous 640px <!--t:8rvg-->

Dans le détail d'un scénario, le nom de l'étape s'écrit lettre par lettre dans sa carte (la colonne
du titre s'écrase à zéro), et le ↗ de la fiche d'hébergement chevauche la pastille du lieu.
Constaté en capture le 2026-10-05 (390px de large).

À livrer : une disposition de la carte d'étape en étroit, dessinée avant d'être codée. Dépend du
lot 1 pour la largeur disponible.

### 3. Adapter le contenu au mobile <!--t:m8vx-->

Hébergements, Lieux & activités et Offres de voiture ouvrent déjà leur ligne dans un sheet plein
écran plutôt que de lire un tableau à 17-23 colonnes. Restent :

- **Transports** (16 colonnes) : pas encore de sheet — à trancher si ça vaut le coup depuis qu'il a
  perdu le mode voiture.
- **Villes et Charges fixes** (6-10 colonnes) : tables classiques, à vérifier qu'elles se lisent.
- **Les autres pages** (Journal, À faire, Phrases, Valise, Notes, Infos utiles, Carte) : passer
  chacune en étroit et lister ce qui casse, avant de corriger.

À livrer : la liste des pages qui cassent avec ce qui casse, puis les corrections une par une.

## Ordre

1 → 2 → 3. Le lot 1 fixe le cadre dans lequel les deux autres s'écrivent.
