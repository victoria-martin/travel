# G3 — Composer un itinéraire

> Construire plusieurs trajets possibles.

Le cœur de l'app, avec [G4 Comparer](g4-comparer.md). Consomme tout ce que [G1](g1-rassembler.md)
a rassemblé.

## Flow

```
Scénarios
  → « Ajouter » (ou dupliquer un existant) → le scénario naît avec la voiture par défaut
  → Détail
      → date de départ
      → ajouter une étape
          ├─ bouton de l'en-tête → modale → en fin de liste
          └─ ＋ entre deux cartes → une étape vide d'une nuit, à cette place
      → sur la carte de l'étape : lieu (une ville OU un hébergement) + nuits (0 à 14)
      → réordonner à la poignée ⠿   → les dates se recalculent en cascade
      → attacher des attractions
          → ＋ au bout de la ligne de lieu (visible au survol)
          → menu ouvert sur un champ de recherche → Entrée prend la première
          → un nom sans correspondance se crée sur place, avec son seul nom
```

Les dates **ne se saisissent pas** : elles se déduisent du départ du scénario et des nuits qui
précèdent. Sans date de départ, aucune date ne s'affiche.

Le select de lieu mêle les deux tables en deux groupes, Villes puis Hébergements, chacun trié par
nom, les favoris en tête de leur groupe précédés d'une ★.

## Écrans

| Écran | Rôle |
| ----- | ---- |
| Scénarios 🧭 — liste | nom, nombre d'étapes, total des nuits, ⭐ · ouvrir, dupliquer, supprimer |
| Scénarios — **détail** | le seul écran composite de l'app |

```
┌──────────────────────────────┬─────────────────┐
│ en-tête : nom · date départ  │                 │
├──────────────────────────────┤   TRAJET        │
│ Étape A  [lieu ▾][nuits ▾] € │   (collant)     │
│   ↳ attractions              │                 │
│   ↳ options ○ ◉ ＋           │   pastilles A,  │
│ Étape B  …                   │   B, C… tracé   │
│ ＋                           │   routier réel  │
├──────────────────────────────┤                 │
│ Voiture  [▾]              €  │                 │
│ Dépenses rattachées       €  │                 │
├──────────────────────────────┤                 │
│ TOTAL GÉNÉRAL                │                 │
└──────────────────────────────┴─────────────────┘
```

Sous 1100 px, la carte repasse sous les étapes. Son affichage est retenu d'une session à l'autre.

## Données exigées par ce flow

- **Scénario** — nom, favori, choisi, date de départ, voiture (référence), charges (références),
  étapes ordonnées. L'ordre **est** le trajet.
- **Étape** — titre, région, notes, masquée, options. Appartient à un scénario.
- **Option d'étape** — lieu (ville **ou** hébergement, exclusifs), nuits, budget, retenue.

**Référencer, jamais recopier** : le scénario pointe la voiture et les charges, l'étape pointe sa
ville ou son hébergement, l'attraction pointe son hébergement. Une seule règle, quatre applications.

## Ouvert

- **Aucun transport dans un itinéraire.** Le scénario porte `transportIds`, mais rien ne rattache un
  trajet — ni entre deux étapes, ni en aller-retour du voyage. C'est le trou du flow : entre deux
  étapes, on se déplace, et l'app ne le sait pas. Donnée sans parcours → voir
  [la map](../map-user-flows.md#06--ce-que-la-map-met-à-nu).
- **Deux dates par étape.** La date calculée depuis le départ, et un champ libre « arrivée le »
  resté dans la modale, affiché à côté. Deux réponses à la même question.
- **Une attraction ne se rattache qu'à une étape**, jamais à une ville : un village qui est à la
  fois une étape et une visite se saisit deux fois.
