# StyleX — plan d'adoption

Objectif : remplacer les classes CSS écrites à la main dans les composants React par des styles
compilés StyleX (`stylex.create`), pour que le compilateur garantisse qu'une classe utilisée existe
réellement — plutôt que de continuer à passer des chaînes de caractères (`clsx`, template strings)
non vérifiées. Migration progressive, composant par composant, en parallèle du portage modales en
cours ([react-migration-modales-plan.md](../archivé/react-migration-modales-plan.md)) — pas un chantier séparé.

## Règle d'arrêt — à respecter strictement

**Ne faire QUE le spike de validation (étape 1 ci-dessous), puis s'arrêter et attendre un go
explicite** avant toute généralisation à d'autres composants.

## État des lieux

- [styles.css](../styles.css) : 5104 lignes, un seul fichier, chargé en `<link>` classique dans
  [index.html](../index.html). Duplication réelle de sélecteurs minime (4 classes sur tout le
  fichier : `.toolbar-btn`, `.scenario-detail-side`, `.scenario-detail-main`, `.rental-count`) — le
  problème n'est donc pas un volume de doublons, c'est l'absence de garantie à la compilation :
  `btn-ghost` dans [Button.tsx](../src/shared/buttons/Button.tsx) est une chaîne de caractères,
  rien ne dit si `.btn-ghost` existe encore dans styles.css.
- Build React : `vite build` en **mode lib**, sortie **IIFE unique**
  ([vite.config.ts](../vite.config.ts)), pas de serveur dev — l'app tourne en scripts classiques
  (`<script src="react-dist/react-app.js">`). Contrainte dure pour tout outillage CSS.

## Ce que fait StyleX

`stylex.create({...})` est compilé à la build (plugin Babel) en classes atomiques déduplquées, plus
une feuille CSS statique séparée. `stylex.props(styles.x)` rend le `className` (et le style inline
pour le dynamique) à l'usage. Le compilateur supprime les objets de style du bundle JS final.

## Intégration envisagée

- Plugin officiel actuel : `@stylexjs/unplugin`, configuré via `stylex.vite({...})` dans
  [vite.config.ts](../vite.config.ts), placé avant `react()`. **Pas** `vite-plugin-stylex`
  (communautaire, obsolète depuis 2 ans, force une vieille version du babel-plugin).
- **Point dur non vérifié** : la doc officielle dit que le CSS généré s'injecte dans un asset CSS
  existant, importé par un composant React — pensé pour un entrypoint HTML classique. Ce projet
  build en mode lib + IIFE, sans entrée HTML. Aucune confirmation trouvée que l'extraction CSS sort
  un fichier exploitable dans cette configuration précise. C'est l'objet du spike ci-dessous, pas
  une hypothèse à acter avant de l'avoir testée.

## Coexistence avec styles.css

- Les deux cohabitent sans conflit de nommage. `styles.css` reste pour tout ce qui n'est pas encore
  porté en React (vues classiques, modales `js/modals/` pas encore portées).
- StyleX ne génère que pour les composants React déjà portés, dans un fichier CSS séparé à ajouter
  en `<link>` dans [index.html](../index.html) à côté de `styles.css`.
- Aucune classe existante à toucher tant que son composant n'est pas porté — `.btn-ghost` reste
  dans styles.css pour le JS classique, StyleX a son équivalent pour `Button.tsx`. Doublon
  temporaire assumé, normal en migration progressive. Ne pas supprimer une classe de styles.css
  tant qu'un autre consommateur JS classique existe encore.

## Étape 1 — spike de validation (Button.tsx)

1. `pnpm add -D @stylexjs/unplugin`
2. Ajouter `stylex.vite({...})` dans [vite.config.ts](../vite.config.ts), avant `react()`.
3. Convertir [Button.tsx](../src/shared/buttons/Button.tsx) en `stylex.create` — même rendu visuel,
   mêmes variantes (`default`/`ghost`/`danger`/`text`, `default`/`small`/`square`), zéro changement
   de comportement.
4. `pnpm react:build`.
5. Vérifier concrètement qu'un fichier CSS est émis dans `react-dist/` et qu'il contient les règles
   attendues pour les variantes de Button — pas supposer que ça a marché parce que le build est vert
   (un build vert ne prouve que l'absence d'erreur de compilation, pas que le CSS est sorti).
6. Si un fichier CSS est sorti : l'ajouter en `<link>` dans [index.html](../index.html), vérifier à
   l'écran que `Button` s'affiche identique à avant (Playwright exclu sur ce projet — vérif visuelle
   manuelle).
7. Rapporter en **[À tester]**, avec le fichier CSS généré en lien et le résultat observé.

## Si le spike échoue

Rapporter l'échec tel quel, ne pas contourner par une bidouille (post-traitement du build, injection
manuelle du CSS) sans un nouveau go. Alternative à évaluer dans ce cas : `@stylexjs/postcss-plugin`
plutôt que l'unplugin — non investigué plus avant ici faute de piste confirmée pour le mode lib.

## Si le spike réussit — suite (non commencée tant que non validé)

- Trancher la convention de fichier (styles inline dans le composant vs fichier `*.stylex.ts` à
  part) — proposer avant de coder, pas de décision seule.
- Migrer composant par composant, au fil des portages React déjà en cours — pas de chantier StyleX
  dédié qui court-circuiterait le backlog modales.
- Ne jamais supprimer une classe de styles.css tant qu'un consommateur JS classique l'utilise
  encore.

## Non résolu, à trancher plus tard

- Options du plugin (`useCSSLayers`, `runtimeInjection`) — valeurs par défaut à valider en situation
  réelle, pas en théorie.
- Nommage du fichier de style séparé, si cette option est retenue à l'étape 1.
