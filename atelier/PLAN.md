# Plan — travel-analyzed

## Reporté

- [ ] **Wireframe & design system.** Les zones d'écran depuis `index.html` (18 ko) et le style
      depuis `styles.css` (68 ko). Mis de côté le 17/09/2026 : on le fait après le reste.

## Tranché

- **Les arêtes `travelId` ne se dessinent pas.** `travelId` est une colonne de 18 des 19 onglets de
  `COLLECTIONS` : tracer la relation partout donnerait 18 flèches convergeant sur `Travel`. Elle
  reste un champ visible sur chaque objet, sans arête. Seule la hiérarchie réelle est dessinée
  (Scenario → Step → StepOption, etc.).
- **L'onglet `cities` n'est pas un objet du modèle.** Il est dans `COLLECTIONS` mais plus dans
  `TRAVEL_COLLECTIONS`, et la migration `absorbCities` le fond dans `attractions` — c'est voulu.
  Onglet legacy, il n'apparaît pas dans le modèle.
- **Le catalogue ne prend que les 34 briques qui portent une décision** — les 24 familles
  dupliquées, les 4 à écrire, les 6 externes. Les 187 briques et 50 inline décrivent du code déjà
  rangé, sur lequel il n'y a rien à arbitrer ; elles auraient fait une matrice brique × flow de
  4 065 cases. Le relevé complet des 271 reste dans `briques-completes.json`.
- **« Comparer des locations de voiture » est un flow à part**, marqué partiel : `js/views/rentals/`
  est un domaine complet (cartes, table, modale, `rental-save`) mais aucune des 8 routes de
  `js/router.js` ne le sert. « Organiser mes déplacements » ne couvre plus que les trajets.

## Écrit

`flows.json`, `catalogue.json`, `modele.json`, `technique.json`, `dev.json` — écrits directement,
sans passer par l'écran d'import. Les `id` sont des slugs lisibles (`comparer-hebergements`,
`get-entite`, `accommodation`) sur le modèle de pr-tools, donc la matrice brique × flow et les
relations du modèle se relisent à l'œil.

`analyse.json` reste comme relevé brut, `briques-completes.json` comme relevé des 271 briques.

## À écrire par moi

- `intention.json` — de quoi il s'agit, pour qui, ce que ce n'est pas.
- `notes.json` — le bloc libre et les tâches.
- `wireframe.json` — reporté, voir plus haut.
