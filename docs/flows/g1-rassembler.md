# G1 — Rassembler les candidats

> Poser dans l'app tout ce qu'on a trouvé ailleurs.

Alimente [G3 Composer](g3-composer.md) et [G2 Situer](g2-situer.md) : sans candidats, aucun
itinéraire à construire.

## Flow

```
J'ai un lien / une adresse
  → page de la table concernée (Hébergements · Villes · À faire · Transports · Voitures)
  → « Ajouter »
  → modale
      ├─ coller un lien HomeExchange / Booking → champs vides pré-remplis
      ├─ saisir l'adresse → « Localiser » → choisir un résultat → ville/province/région/coords
      └─ saisir le reste (prix, tags, notes)
  → Enregistrer
  → la ligne est dans la table, statut de départ « à voir »
```

Variante de masse, à la première saisie seulement : coller des lignes d'un tableur crée les
hébergements en lot. Le bouton disparaît dès qu'un Sheet est connecté — la synchro devient alors
la voie d'entrée des lignes.

## Écrans

| Écran | Forme |
| ----- | ----- |
| Hébergements 🏠 | tableau **ou** cartes · tri, filtres, colonnes · édition en ligne |
| Villes 📍 | tableau simple |
| À faire 🏛️ | tableau seul |
| Transports ✈️ | tableau seul |
| Voitures 🚗 | tableau **ou** cartes |

Cinq écrans, une seule grammaire : la barre d'outils est la même partout (Trier · Filtrer ·
Colonnes · filtres propres · bascule tableau/cartes · Ajouter · ⋮). C'est ce qui fait qu'un écran
neuf ne se réapprend pas.

## Données exigées par ce flow

**Ce qui décide la table, c'est la forme temporelle** — dormir se compte en nuits, disposer d'un
bien loué en jours, se déplacer va d'un point à un autre, faire occupe un créneau, payer n'occupe
rien. Une chose neuve n'ouvre une table que si sa forme n'existe pas encore, sinon c'est un type :
d'où le restaurant, qui est un type d'« À faire » et pas une entité.

- **Hébergement** — type, statut, lieu géocodé, prix/nuit, liens, tags, favori
- **Ville** — nom, lieu géocodé, notes
- **Attraction** — nom, type, statut, lieu, hébergement référencé, horaires, tél., budget/prix, tags
- **Transport** — mode, statut, départ/arrivée (ville + précision libre), dates, compagnie **ou**
  voiture référencée, budget/prix
- **Voiture** — loueur, modèle, prix/jour, statut

Le géocodage n'est **jamais automatique** — le service limite à une requête par seconde — et jamais
bloquant : les coordonnées restent saisissables à la main.

## Ouvert

Rien. Le parcours est complet sur les cinq tables.
