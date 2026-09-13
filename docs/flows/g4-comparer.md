# G4 — Comparer

> Savoir lequel coûte quoi, et pour combien de nuits.

L'objectif qui justifie l'app. C'est le seul à avoir fait naître une entité —
l'**option d'étape** — qui n'existe pas dans le monde réel.

## Flow

Trois niveaux de comparaison, du plus fin au plus large :

```
Comparer DEUX LIEUX pour une étape        Comparer DEUX TRAJETS
----------------------------------        ---------------------------------
Détail d'un scénario                      Scénarios
  → ＋ sur la rangée d'options              → dupliquer un scénario
  → l'option reprend lieu et nuits           → modifier ce qui change
    de celle qui est retenue                 → lire les deux totaux généraux
  → on n'en change qu'un bout                → ◉ « choisi » sur le gagnant
  → ◉ retient celle qui compte
  → dates, totaux, carte, récap suivent
```

```
Mettre une variante DE CÔTÉ
---------------------------
case en haut de la carte d'étape
  → grisé-pointillé, titre barré, dates disparues
  → l'étape sort de tout : dates, nuits, totaux, carte, récap, nombre d'étapes
  → seule la liste du détail la montre encore
```

À une seule option, l'étape se lit comme la ligne qu'elle a toujours été. À partir de deux, les
options se comparent en cards côte à côte, la retenue détachée par sa bordure. La dernière ne se
retire pas.

## Écrans

Un seul : le **détail d'un scénario**, et sa liste pour le niveau trajet. Voir
[G3](g3-composer.md#écrans) pour la disposition.

Le **Total général** est le seul bloc de chiffres de l'écran : une ligne par poste (hébergements,
hébergements en GP, voiture, dépenses rattachées), puis le total des nuits et le montant. Le détail
des hébergements se déplie au chevron, **dans l'ordre du trajet** — un lieu revisité tient sur une
seule ligne, ses nuits additionnées, placée à sa première date.

## Données exigées par ce flow

**L'option d'étape n'existe que pour ce parcours.** Sans le besoin de comparer deux lieux pour une
même nuit, l'étape porterait son lieu et ses nuits directement. Quatre décisions en découlent :

- **Le contenu vit dans l'option, jamais sur l'étape** — lieu, nuits, budget. Toute étape en porte
  au moins une : il n'y a donc pas deux formes d'étape à réconcilier, une étape ordinaire est une
  étape à une option.
- **Un drapeau `retenue` par option**, pas un identifiant sur l'étape : la colonne se lit à l'œil
  dans le Sheet, là où un identifiant renverrait à un autre onglet. Recliquer n'en laisse aucune —
  l'étape ne compte alors ni nuit, ni lieu, ni coût.
- **Le rang d'une étape est son rang parmi les visibles.** Masquer la deuxième fait passer C en B et
  décale toutes les dates.
- **Les GuestPoints ne s'additionnent jamais aux euros.** Ils ont leur propre ligne de total. Un
  budget saisi sur une étape reste en euros même sur une étape en GuestPoints.

Coût d'une étape = prix/nuit de l'hébergement × nuits, qu'un budget saisi remplace. Rien ne
s'affiche sur une étape rattachée à une ville : seul un hébergement porte un prix.

## Ouvert

- **Les transports ne sont dans aucun total.** Deux trajets qui se comparent à l'hébergement près
  ignorent ce que coûte d'aller de l'un à l'autre. Même cause que le trou de
  [G3](g3-composer.md#ouvert).
