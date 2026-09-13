# G8 — Gérer plusieurs voyages

> Un carnet par voyage, sans mélange.

Transverse : le voyage ouvert filtre tous les autres écrans.

## Flow

```
Bouton emoji + nom + sous-titre, en tête de la barre latérale
  → menu : les autres voyages · Modifier ce voyage · Nouveau voyage
  → les deux derniers ouvrent la même modale
  → créer un voyage l'ouvre aussitôt
  → ouvrir un voyage : tous les écrans ne montrent plus que ses données
      → sa couleur d'accent remplace les verts du thème
      → son emoji passe en favicon, son nom en titre d'onglet
```

Tant qu'il n'y a aucun voyage, le bouton affiche « Aucun voyage » et le menu ne propose que la
création.

## Écrans

Aucune page — un bouton de barre latérale et une modale. La modale n'a de champ ni pour le nom ni
pour l'emoji : le titre de l'en-tête s'édite en place, et la pastille ouvre un menu de suggestions
doublé d'un champ de collage.

Détail qui n'est pas de la décoration : ouverte en local (fichier, `localhost`, `127.0.0.1`), la
favicon porte une **pastille orange cerclée de blanc** — d'un coup d'œil dans la liste des onglets,
on sait si on regarde sa copie de travail ou la prod.

## Données exigées par ce flow

- **Voyage** — nom, emoji, image, description, statut, dates de début et de fin, destination
  (pays / région), couleur d'accent, voyageurs.
- Le **`travelId` porté par chaque entrée** de toutes les autres tables. C'est ce flow qui l'exige,
  et [G7](g7-a-deux.md) qui décide de sa place dans le Sheet.

**Tous les voyages tiennent dans le même Sheet.** Un classeur par voyage a été écarté : l'Apps
Script travaille sur `getActiveSpreadsheet()`, il aurait fallu dupliquer le classeur et redéployer
le script à la main à chaque nouveau voyage.

Pas de compte, pas de rôle : deux à quelques personnes, toutes avec les mêmes droits, chacune sur
son navigateur.

## Ouvert

- **Pas de page Voyages.** Le seul geste possible est d'en ouvrir un autre : ni duplication, ni
  suppression, ni vue d'ensemble. Un voyage créé par erreur ne s'efface pas.
