# G2 — Situer

> Voir sur une carte ce qui est proche de quoi.

Lit [G1](g1-rassembler.md) et [G3](g3-composer.md), n'écrit presque rien.

## Flow

```
Carte
  → tous les hébergements géolocalisés, couleur par type
  → filtrer (type · province · ⭐)
  → filtrer par scénario → trace son trajet, ne garde que ses hébergements
  → popup d'un marqueur → prix éditable en place
```

## Écrans

Un seul, **Carte** 🗺️, pleine page. Le bloc « Trajet » du détail d'un scénario est le même
composant, en colonne collante.

## Données exigées par ce flow

Aucune entité propre — c'est le seul écran de l'app dans ce cas. Il lit :

| Entité      | Champs lus                                   |
| ----------- | -------------------------------------------- |
| Hébergement | coordonnées, type, province, favori          |
| Scénario    | étapes (choisi en filtre, il donne le tracé) |

Sans coordonnées, pas de marqueur. Le tracé routier réel vient d'OSRM, mis en cache par liste de
points — il ne se recalcule que si une étape bouge.

## Ouvert

- **Les attractions ne sont pas sur la carte.** Elles portent pourtant des coordonnées, saisies par
  le même bloc de localisation que les hébergements et les villes. Le flow « situer » s'arrête aux
  hébergements sans raison lisible.
