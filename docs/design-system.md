# Design system — état des lieux

Recense ce qui existe dans [styles.css](../styles.css), pas ce qui devrait exister. Base pour
construire un vrai design system plus tard — chaque entrée pointe vers la classe et la ligne
réelles.

## Couleurs (`:root`, styles.css:4-17)

| Token             | Valeur    | Usage                          |
| ------------------ | --------- | ------------------------------- |
| `--paper`          | `#f1e9d8` | fond de page                    |
| `--paper-raised`   | `#faf5ea` | fond de carte/panneau, hover    |
| `--ink`            | `#24312b` | texte principal                 |
| `--ink-soft`       | `#5b6660` | texte secondaire                |
| `--line`           | `#d9cfb8` | bordures                        |
| `--stone`          | `#3e6259` | accent primaire (fond bouton)   |
| `--stone-dark`     | `#2c4740` | accent primaire hover/actif     |
| `--ochre`          | `#c98a3e` | accent secondaire               |
| `--gold`           | `#dfa32c` | accent secondaire               |
| `--rust`           | `#a6462e` | danger / suppression            |
| `--sage`           | `#7c8b5e` | accent tertiaire                |
| `--sage-pale`      | `#eef0e4` | fond accent tertiaire           |
| `--sage-line`      | `#c7cfae` | bordure accent tertiaire        |
| `--white`          | `#ffffff` | fond actif, texte sur `--stone` |

## Boutons (styles.css:395-441)

Une seule classe de base `.btn` + un modificateur pour la variante. Pas de `.btn-primary` — le
style de base EST le primaire.

| Variante  | Classes             | Fond               | Bordure         | Texte             | Exemple d'appelant |
| --------- | -------------------- | ------------------ | ---------------- | ------------------ | -------------------- |
| Primary   | `.btn`                | `--stone`           | `--stone`        | `--white`           | boutons d'enregistrement de modale |
| Outline   | `.btn.btn-ghost`      | transparent         | `--line`         | `--stone-dark`      | actions secondaires de modale |
| Danger    | `.btn.btn-danger`     | transparent         | `--rust`         | `--rust`            | suppression |
| Text      | `.btn.btn-text`       | transparent         | transparent      | `--stone-dark`      | [filters/panel.js](../js/views/filters/panel.js) « + Ajouter un niveau » |
| Small     | `+ .btn-small`        | (cumulable)         | —                | padding/font réduits | — |

Boutons hors de cette famille, non unifiés :

- `.toolbar-btn` (styles.css:458) — bouton de barre d'outils (fond `--paper-raised`, bordure
  `--line`), family à part avec son propre `.active`.
- `.icon-btn` (styles.css:2448) — bouton icône seule, carré, sans fond ni bordure au repos.
- boutons de carte (`.card-actions`, styles.css:921) — texte + icône, voir
  [cards/actions/](../js/views/cards/actions/).

## Interrupteur (`.switch-option`, styles.css:2643-2686)

Toggle façon iOS (piste + pastille), utilisé pour les filtres booléens (Hébergements, Favoris
uniquement dans la capture). Un seul style, pas de variante taille/couleur.

## Tags / pastilles

- `.tag-chip` (styles.css:3213) — chip de tag avec bouton de suppression, fond `--sage-pale`.
- `.pill-*` côté board (`tools/plan-board/pill-variants.js`) — six variantes de couleur
  (info/success/error/…), voir [pill-variants.js](../tools/plan-board/pill-variants.js) — vocabulaire
  séparé de celui de l'app travel, ne pas confondre.

## Cartes / panneaux

- `.card` (styles.css:752) — carte de grille (hébergement, voiture…), fond `--paper-raised`.
- `.map-side-panel` (styles.css:2475) — panneau flottant façon carte, même fond, `border-radius: 12px`.
- `.modal` (styles.css:954) / `.modal-sheet` (styles.css:975) — deux gabarits de modale, centrée vs
  panneau latéral plein écran sous 440px.

## Ce qui manque pour un vrai design system

- Pas de `.btn-secondary` distinct d'`.btn-ghost` — à trancher si un jour un besoin les distingue.
- `.toolbar-btn` et `.icon-btn` sont des familles de boutons à part entière, jamais rapprochées de
  `.btn` : à confronter si on unifie un jour.
- Aucune échelle de tailles de police / d'espacement nommée (tout est en px ad hoc).
