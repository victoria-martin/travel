# Design system visuel (Storybook) — plan d'exécution pour un agent

Objectif : voir chaque brique partagée de [src/shared/](../src/shared/) cataloguée par variante
au même endroit, savoir où elle est réellement utilisée, et retrouver la décision produit qui l'a
posée. Deux docs existent déjà et sont la source de vérité, pas à redériver :

- [docs/design-system.md](../design-system.md) — inventaire des tokens/classes CSS réels
  (`styles.css`), variantes de boutons, tags, cartes, toast.
- [docs/spec-voyage-toscane.md](../spec-voyage-toscane.md) — décisions produit par écran.

Storybook ne remplace ni l'un ni l'autre : chaque story pointe vers l'entrée qui la justifie.

## Règle d'arrêt — à respecter strictement

Faire l'Étape 1 (installation) + l'Étape 2 (composants sans dépendance `window.*`) puis
**s'arrêter et attendre un go explicite** avant l'Étape 3 (composants à stubber) et la suite.
Même esprit que les plans de migration modales/panneaux : valider le mécanisme sur un périmètre
réduit avant de dérouler tout l'inventaire.

## Règles dures (projet)

- **Jamais de Playwright/navigateur** pour vérifier le rendu des stories, même pour diagnostiquer
  un souci d'affichage. Lancer `pnpm storybook` et laisser l'utilisatrice regarder à l'écran.
- **Ne jamais modifier un composant de `src/shared/`** pour le faire "mieux marcher" dans
  Storybook (retirer une dépendance à `window.*`, changer une prop). Stubber au niveau de la story
  uniquement. Si un composant ne peut vraiment pas se raconter sans réécriture, le signaler et
  s'arrêter plutôt que de réécrire au passage.
- `pnpm react:typecheck` et `pnpm react:build` doivent rester propres après chaque étape — ajouter
  Storybook ne doit rien casser sur le build de l'app réelle.
- Pas de thème Storybook tiers, pas de design tokens dupliqués : Storybook doit refléter
  `styles.css` tel qu'il est, pas imposer un style par-dessus.
- `storybook-static/` (le build) rejoint `react-dist/` dans [.gitignore](../.gitignore).

## Contrainte technique centrale : deux familles de dépendances `window.*`

`src/shared/` n'est pas 100% autonome — certains composants lisent des globales posées par l'app
legacy (scripts classiques, voir [CLAUDE.md](../../CLAUDE.md)). Il y a deux cas, à traiter
différemment :

1. **`window.svgIcon` / `ICON_BODIES`** ([js/icons.js](../js/icons.js)) — léger, sans dépendance
   sur l'état de l'app, utilisé par la quasi-totalité des composants (`Icon.tsx`, donc
   `IconButton`, `AddResourceButton`, `SwitchField`, `TagsField`, `SearchInput`, `FavoriteCell`,
   `ToolbarPanel`…). **À charger pour de vrai**, pas à stubber — sinon toutes les icônes sont
   vides dans Storybook, ce qui ruine l'intérêt même du catalogue.
   `js/icons.js` est un script classique (`function svgIcon(...)`, pas d'export) : un `import
'../js/icons.js'` dans `preview.ts` ne suffit pas, Vite l'exécuterait en module isolé sans
   toucher `window`. Il faut le charger en `<script src>` brut, comme `index.html` le fait déjà :
   - dans `.storybook/main.ts`, ajouter `staticDirs: ['../js']` (ou plus ciblé,
     `{ from: '../js/icons.js', to: '/icons.js' }`) pour que le dev server serve le fichier ;
   - créer `.storybook/preview-head.html` avec `<script src="/icons.js"></script>` (chemin à
     ajuster selon le `staticDirs` choisi) — c'est le même mécanisme que
     `<script src="js/icons.js">` dans [index.html](../index.html).
2. **Globales liées à l'état de l'app réelle** — `window.dismissModal`, `window.hiddenColumns`,
   `window.toggleColumn`, `window.showButtonLabels`, `window.toggleButtonLabels`,
   `window.wordSelectChanged`, `window.NEW_WORD_VALUE` (voir
   [src/types/global.d.ts](../src/types/global.d.ts)). Charger leur implémentation réelle
   demanderait tout `state.js`/`storage.js`/`render.js` — hors de propos pour un catalogue visuel.
   **À stubber** par de simples no-op posés en tête du fichier `.stories.tsx` du composant
   concerné (pas dans `preview.ts`, puisque chacun n'a qu'un ou deux composants consommateurs) :
   ```ts
   // en tête du .stories.tsx, avant le default export
   window.dismissModal = () => {};
   ```
   Pour un composant qui a besoin d'un retour (`hiddenColumns`, `showButtonLabels`), stubber avec
   une valeur fixe plutôt qu'un no-op silencieux (`window.hiddenColumns = () => [];
window.showButtonLabels = () => true;`), et le dire dans la description de la story ("stub :
   toutes les colonnes visibles").

## Étape 1 — installer et configurer Storybook

1. `pnpm dlx storybook@latest init` depuis la racine du repo — auto-détecte Vite + React 19 et
   pose `.storybook/main.ts` + `.storybook/preview.ts` + les devDependencies dans
   [package.json](../package.json). Refuser toute proposition d'addon de test/Chromatic/CI non
   demandée.
2. Dans `.storybook/main.ts` : `framework: '@storybook/react-vite'`,
   `stories: ['../src/**/*.stories.@(ts|tsx)']` (pas de `*.mdx` pour l'instant, voir Étape 4).
3. Reprendre l'alias `@` de [vite.config.ts](../vite.config.ts) via `viteFinal` dans
   `.storybook/main.ts` :
   ```ts
   async viteFinal(config) {
     return mergeConfig(config, {
       resolve: { alias: { '@': path.resolve(__dirname, '../src') } },
     });
   }
   ```
   Sans ça, tous les imports `@/shared/...` cassent dans Storybook.
4. Dans `.storybook/preview.ts`, première ligne : `import '../styles.css';` — Vite sait importer
   un `.css` brut en effet de bord, c'est le seul endroit où le fond/les couleurs/les classes
   `.btn`, `.field`, etc. sont chargées (`styles.css` n'est jamais importé par un fichier `src/`
   aujourd'hui, seulement par un `<link>` dans `index.html`).
5. Voir la contrainte technique ci-dessus pour `staticDirs` + `preview-head.html` (icônes).
6. Ajouter `storybook-static` à [.gitignore](../.gitignore).
7. Scripts `package.json` : `"storybook": "storybook dev -p 6006"`,
   `"storybook:build": "storybook build"`.
8. `pnpm react:typecheck` puis `pnpm react:build` — doivent rester propres.
9. Rapporter avec marqueur **[À tester]** : commande `pnpm storybook`, aucune story encore écrite
   — juste vérifier que l'écran Storybook s'ouvre sans erreur console et que les stories d'exemple
   générées par `init` (si gardées) affichent bien leurs styles.

## Étape 2 — composants sans dépendance `window.*`

Les plus simples, à faire en premier. Pour chaque fichier : une story par variante/usage réel du
composant (pas une story "default" unique si le composant a plusieurs variantes posées dans
`docs/design-system.md`), avec les contrôles Storybook (`argTypes`) sur les props à énumération
(`variant`, `size`…). Dans `parameters.docs.description.component` du default export, mettre un
lien vers l'entrée [docs/design-system.md](../design-system.md) concernée quand elle existe.

Pour "où c'est utilisé" : grepper les appelants réels au moment d'écrire la story
(`grep -rn "<NomDuComposant" src/domains/`) et les lister en 2-3 exemples dans la description —
ne pas inventer, ne pas recopier un inventaire figé qui va se périmer plus vite que le grep.

| Fichier | Variantes à montrer | Lien design-system.md |
| --- | --- | --- |
| [src/shared/buttons/Button.tsx](../src/shared/buttons/Button.tsx) | `variant`: default/ghost/danger/text × `size`: default/small/square | § Boutons (table variantes) |
| [src/shared/buttons/IconButton.tsx](../src/shared/buttons/IconButton.tsx) | avec/sans label visible | § Boutons ("hors de cette famille" — `.toolbar-btn`) |
| [src/shared/buttons/AddResourceButton.tsx](../src/shared/buttons/AddResourceButton.tsx) | cas unique (wrapper d'IconButton) | — |
| [src/shared/form-fields/TextField.tsx](../src/shared/form-fields/TextField.tsx) | avec/sans placeholder, avec erreur si la prop existe | — |
| [src/shared/form-fields/TextareaField.tsx](../src/shared/form-fields/TextareaField.tsx) | — | — |
| [src/shared/form-fields/SelectField.tsx](../src/shared/form-fields/SelectField.tsx) | avec/sans `placeholder` | — |
| [src/shared/form-fields/SwitchField.tsx](../src/shared/form-fields/SwitchField.tsx) | avec/sans icône, checked/unchecked | § Interrupteur |
| [src/shared/form-fields/TagsField.tsx](../src/shared/form-fields/TagsField.tsx) | vide, avec tags, vocabulaire restant | § Tags / pastilles |
| [src/shared/TagLabel.tsx](../src/shared/TagLabel.tsx) | avec/sans emoji | — |
| [src/shared/SearchInput.tsx](../src/shared/SearchInput.tsx) | vide, avec valeur | — |
| [src/shared/select/TagDropdown.tsx](../src/shared/select/TagDropdown.tsx) | avec/sans `emptyOption`, dictionnaire court/long | — |
| [src/shared/cells/TextCell.tsx](../src/shared/cells/TextCell.tsx) | valeur, valeur vide (`—`) | — |
| [src/shared/cells/LinkCell.tsx](../src/shared/cells/LinkCell.tsx) | avec lien, sans lien, label custom | § Cartes/panneaux (`.external-link`) |
| [src/shared/cells/FavoriteCell.tsx](../src/shared/cells/FavoriteCell.tsx) | favori/non favori | — |
| [src/shared/cells/EditableTextCell.tsx](../src/shared/cells/EditableTextCell.tsx) | avec valeur, placeholder vide | — |
| [src/shared/cells/TagsCell.tsx](../src/shared/cells/TagsCell.tsx) | vide (ne rend rien — le noter), avec tags | § Tags / pastilles |
| [src/shared/cells/EditableTagsCell.tsx](../src/shared/cells/EditableTagsCell.tsx) | vide, avec tags, vocabulaire | § Tags / pastilles |
| [src/shared/modal/ModalTitle.tsx](../src/shared/modal/ModalTitle.tsx) | `isNew` true/false | — |
| [src/shared/layout/FieldRow.tsx](../src/shared/layout/FieldRow.tsx) | deux `TextField` côte à côte | — |
| [src/shared/layout/ListSectionTitle.tsx](../src/shared/layout/ListSectionTitle.tsx) | cas unique | — |

`ModalSaveButton` a un id fixe (`#f-save`) lu par le reste de l'app (`submitModal()`) : une story
suffit (bouton seul), ne pas la multiplier dans une grille où `#f-save` serait dupliqué dans le
DOM.

## Étape 3 — composants dépendants de `window.*` à stubber

À faire après le go sur l'étape 2. Même recette, avec le stub documenté dans la description de la
story (voir "Contrainte technique" ci-dessus).

| Fichier | Stub nécessaire |
| --- | --- |
| [src/shared/modal/CloseModalButton.tsx](../src/shared/modal/CloseModalButton.tsx) | `window.dismissModal = () => {}` |
| [src/shared/toolbar/ColumnPicker.tsx](../src/shared/toolbar/ColumnPicker.tsx) | `window.hiddenColumns = () => []`, `window.toggleColumn = () => {}` |
| [src/shared/toolbar/SettingsMenu.tsx](../src/shared/toolbar/SettingsMenu.tsx) | `window.showButtonLabels = () => true`, `window.toggleButtonLabels = () => {}` |
| [src/shared/toolbar/ToolbarPanel.tsx](../src/shared/toolbar/ToolbarPanel.tsx) | aucun directement, mais sert de wrapper aux deux ci-dessus dans leurs stories |
| [src/shared/WordSelectField.tsx](../src/shared/WordSelectField.tsx) | `window.wordSelectChanged = () => {}`, `window.NEW_WORD_VALUE = '__new__'` |

`src/shared/header/HeaderActions.tsx` est **hors scope** de cette étape : le fichier contient un
commentaire de l'utilisatrice elle-même ("pas sûr de cette implem mais laissons pour l'instant")
et du JSX commenté — c'est un WIP non arbitré, ne pas le cataloguer ni le "finir" au passage.
Le signaler et passer au composant suivant.

## Étape 4 — pages de doc liées aux specs

Une fois les étapes 2 et 3 validées à l'écran :

1. Activer `tags: ['autodocs']` dans `.storybook/main.ts` (`docs: { autodocs: true }` selon la
   version installée) pour générer une page de doc par composant à partir de ses props + de
   `parameters.docs.description.component`.
2. Ajouter une page `.storybook/Introduction.mdx` (ou `src/shared/Introduction.mdx`) qui ne
   contient que des liens — pas de contenu dupliqué : vers
   [docs/design-system.md](../design-system.md), [docs/spec-voyage-toscane.md](../spec-voyage-toscane.md),
   et la règle d'archi [CLAUDE.md § "Un champ de formulaire de modale vit dans `shared/`"](../../CLAUDE.md).
3. Ne pas recopier le contenu de `design-system.md` dans les descriptions de story au-delà d'un
   lien + une phrase : `design-system.md` reste la source, Storybook montre le rendu.

## Backlog — hors scope de ce plan, à reprendre ensuite

- `src/shared/DataTable/` (113 lignes, fixtures de colonnes/lignes à construire) — plus lourd,
  phase à part après validation du mécanisme sur les briques simples.
- `src/shared/cells/actions/`, `src/shared/toolbar/` restants si d'autres apparaissent d'ici là.
- Composants propres à un domaine (`src/domains/*/`) qui dupliqueraient un pattern de
  `src/shared/` — à signaler comme candidats à l'extraction plutôt qu'à cataloguer tels quels,
  cf. [CLAUDE.md § "Un champ de formulaire de modale vit dans `shared/`"](../../CLAUDE.md).
- Chromatic / tests de régression visuelle — non demandé, ne pas l'ajouter sans qu'elle le
  demande explicitement.
