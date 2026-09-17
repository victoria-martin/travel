# G5 — Décider et figer

> Trancher : ce scénario, cet hébergement, cette voiture.

Sort de [G4](g4-comparer.md), alimente [G6](g6-couts.md) — qui ne lit que ce qui est figé.

## Flow

```
Une entité   → son statut avance dans son workflow (À voir 👀 → Go ✅ → Réservé 🔒)
Un scénario  → ◉ choisi          un seul par voyage
Une étape    → ◉ option retenue  une seule
Une voiture  → ◉ par défaut      une seule
```

Quatre gestes, un même dessin : **une pastille ◉ qui démarque les autres, et que recliquer n'en
laisse aucune.**

Type, statut, prix et notes s'éditent **depuis la ligne** — figer ne demande pas d'ouvrir une fiche.

## Écrans

Aucun écran propre : le geste vit dans les lignes et les cartes de
[G1](g1-rassembler.md#écrans) et dans le détail de [G3](g3-composer.md#écrans).

## Données exigées par ce flow

Un statut par table, ordonné par le workflow — et cet ordre **est** l'ordre de tri :

| Table       | Statuts                                                                                                           |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Voyage      | Idée 💭 · En préparation 🧭 · Réservé 🔒 · En cours ✈️ · Passé 📦                                                 |
| Hébergement | Réservé 🔒 · Contacté ✉️ · Attente ⏳ · À booker 💳 · Go ✅ · Intéressé 👍 · À voir 👀 · Pas dispo 🚫 · Écarté 👎 |
| Transport   | Réservé 🔒 · À réserver 💳 · Go ✅ · À voir 👀 · Écarté 👎                                                        |
| Voiture     | Réservé 🔒 · À réserver 💳 · Go ✅ · À voir 👀 · Écarté 👎                                                        |
| Attraction  | À voir 👀 · Go ✅ · Vu ☑️ · Écarté 👎                                                                             |

Les statuts d'hébergement ne s'appliquent pas à une attraction : **on ne réserve pas un point de
vue**. « Non renseigné ❔ » est un état à part entière, affiché tel quel et trié après tout le reste.

Les quatre drapeaux exclusifs — `choisi`, `retenue`, `par défaut`, et le favori ⭐ qui n'est pas
exclusif — sont des booléens portés par l'entité, jamais un identifiant sur le parent.

## Ouvert

Rien. Le parcours est complet, et c'est le plus homogène de l'app.
