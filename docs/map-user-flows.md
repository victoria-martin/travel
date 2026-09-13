# Map — Carnet de voyages, lu en User Flow First

L'app existante relue dans l'ordre **problème → objectifs → flows → écrans → données**. Ce document
ne décrit pas ce qu'il faut faire : il vérifie que chaque écran sert un parcours et que chaque
donnée est justifiée par un flow. Ce qui ne l'est pas est listé en §06.

**Deux échelles, deux endroits.** Ce fichier tient ce qui est à l'échelle du projet — le problème,
les objectifs, le modèle, la tech. Les flows et les écrans sont à l'échelle d'un objectif : ils
vivent dans [docs/flows/](flows/), un fichier par objectif, chacun tenant sa boucle
`flow ↔ écrans ↔ données` et ce qui lui reste ouvert.

Documents liés : [spec produit](spec-voyage-toscane.md) (ce qui existe, écran par écran) ·
[PLAN.md](../PLAN.md) (ce qui reste) · [protocole de synchro](protocole-sync-sheet.md)

---

## 01 — PROBLEM

Préparer un voyage à plusieurs, c'est accumuler des candidats — des annonces d'hébergement, des
villages à voir, des vols, une location — dans des onglets, des captures et un tableur partagé.
Le stockage n'est pas le problème : **décider** l'est.

> Dormir où, combien de nuits, dans quel ordre, pour combien — et se mettre d'accord à deux.

Deux choses manquent à un tableur : **situer** les candidats les uns par rapport aux autres, et
**comparer plusieurs trajets complets et chiffrés** avant de réserver quoi que ce soit.

Hors périmètre, assumé : ni moteur de réservation, ni agrégateur d'offres. Tout est saisi ou collé
à la main, les liens externes restent des liens.

---

## 02 — USER GOALS

| # | Objectif | En une phrase | État |
| - | -------- | ------------- | ---- |
| **G1** | [Rassembler les candidats](flows/g1-rassembler.md) | Poser dans l'app tout ce qu'on a trouvé ailleurs | complet |
| **G2** | [Situer](flows/g2-situer.md) | Voir sur une carte ce qui est proche de quoi | complet, sauf les attractions |
| **G3** | [Composer des itinéraires](flows/g3-composer.md) | Construire plusieurs trajets possibles | **trou : les transports** |
| **G4** | [Comparer chiffré](flows/g4-comparer.md) | Savoir lequel coûte quoi, et pour combien de nuits | complet, aux transports près |
| **G5** | [Décider et figer](flows/g5-decider.md) | Trancher : ce scénario, cet hébergement, cette voiture | complet |
| **G6** | [Savoir ce que ça coûte](flows/g6-couts.md) | Un total qui agrège ce qui est réservé | **cassé par construction** |
| **G7** | [Travailler à deux](flows/g7-a-deux.md) | Que l'autre voie mes saisies sans rien installer | complet |
| **G8** | [Gérer plusieurs voyages](flows/g8-voyages.md) | Un carnet par voyage, sans mélange | **sans écran** |

```
G1 rassembler ──┬──► G2 situer
                │
                └──► G3 composer ──► G4 comparer ──► G5 décider ──► G6 coûter

G7 travailler à deux  ─── porte tout ───
G8 plusieurs voyages  ─── filtre tout ───
```

G3 et G4 sont le cœur : c'est pour eux que l'app existe. G7 et G8 ne sont pas des fonctionnalités
mais des contraintes portées par tout le reste — d'où leurs empreintes dans le modèle
(`travelId`, la partition données / préférences).

---

## 03 — FLOWS · 04 — SCREENS

À l'échelle d'un objectif, donc dans [docs/flows/](flows/) — un fichier par objectif :
flow en ASCII, écrans touchés, données que le flow exige, ce qui reste ouvert.

Les écrans, vus de haut : dix, une barre latérale.

| Écran | Sert | Forme |
| ----- | ---- | ----- |
| **Hébergements** 🏠 | G1 · G5 | tableau **ou** cartes · tri, filtres, colonnes · édition en ligne |
| **Villes** 📍 | G1 | tableau simple |
| **À faire** 🏛️ | G1 · G5 | tableau seul |
| **Transports** ✈️ | G1 · G5 | tableau seul |
| **Voitures** 🚗 | G1 · G5 | tableau **ou** cartes |
| **Dépenses** 💶 | G6 | deux blocs (Calculé / Saisi) + récap |
| **Scénarios** 🧭 | G3 · G4 | liste → **détail**, le seul écran composite |
| **Carte** 🗺️ | G2 | pleine page, filtres dont scénario |
| **Notes** 📝 | — | une zone de texte partagée |
| **Modale Voyage** | G8 | ouverte depuis la barre latérale |

**L'invariant de barre d'outils** — mêmes contrôles, même ordre, en haut à droite de chaque
écran : Trier · Filtrer · Colonnes · filtres propres à l'écran · bascule tableau/cartes ·
Ajouter · menu ⋮. C'est ce qui fait qu'un écran neuf ne se réapprend pas.

---

## 05 — DATA

Chaque entité, et **le flow qui la justifie** :

| Entité | Justifiée par | Porte, pour l'essentiel |
| ------ | ------------- | ----------------------- |
| **Voyage** | G8 | nom, emoji, image, dates, destination, statut, accent, voyageurs |
| **Hébergement** | G1 → G3 | type, statut, lieu géocodé, **prix/nuit**, liens, tags, favori |
| **Ville** | G1 → G3 | nom, lieu géocodé, notes |
| **Attraction** | G1 → G3 | nom, type, statut, lieu, hébergement, horaires, tél., budget/prix, tags |
| **Transport** | G1 | mode, statut, départ/arrivée, dates, compagnie **ou** voiture, budget/prix |
| **Voiture** | G1 · G6 | loueur, modèle, prix/jour, statut, **par défaut** |
| **Charge fixe** | G6 | libellé, montant, catégorie, récurrence |
| **Scénario** | G3 · G4 | nom, favori, **choisi**, date de départ, voiture, charges, étapes |
| **Étape** | G3 | titre, région, notes, masquée, **options** |
| **Option d'étape** | **G4** | nom, lieu (ville **ou** hébergement), nuits, budget, **retenue** |
| **Notes de voyage** | — | texte libre |

### Ce que la relecture par les flows éclaire

- **L'option d'étape n'existe que pour G4.** Sans le besoin de comparer deux lieux pour une même
  nuit, l'étape porterait son lieu et ses nuits directement. C'est le seul endroit du modèle où une
  entité est née d'un parcours et non d'une chose du monde réel.
- **Ce qui décide table ou type, c'est la forme temporelle.** Dormir se compte en nuits, disposer
  d'un bien loué en jours, se déplacer va d'un point à un autre, faire occupe un créneau, payer
  n'occupe rien. Une chose neuve n'ouvre une table que si sa forme n'existe pas encore — d'où le
  restaurant, qui est un type d'« À faire ».
- **Référencer, jamais recopier** : un scénario pointe la voiture et les charges, une attraction
  pointe son hébergement, un transport en mode voiture pointe sa location. Une règle, quatre
  applications.
- **Le prix a deux formes** : un champ unique (hébergements, voitures, charges) ou le couple
  budget / fourchette mini-maxi (transports, attractions). La seconde est la règle transverse
  visée ; les autres ne l'ont pas encore.

### Tech

```
Navigateur                          Google Sheet
┌──────────────────────────┐        ┌──────────────────┐
│ index.html               │        │ un onglet/table  │
│ scripts globaux, onclick │◄──────►│ colonne travelId │
│ pas de build, pas d'ES   │ Apps   │ éditable à la    │
│                          │ Script │ main             │
│ localStorage :           │        └──────────────────┘
│  état complet + préfs    │        Nominatim (géocodage, sur clic)
└──────────────────────────┘        OSRM (tracé routier, en cache)
```

- Le **`localStorage`** tient l'état complet : l'app marche hors synchro, la page se rouvre pleine.
- La **synchro compare des empreintes** d'état : une reprise de format ne doit donc jamais fabriquer
  d'identifiant neuf, sinon tout envoi se verrait refuser en conflit indéfiniment.
- **Tous les voyages dans un seul Sheet**, chaque ligne portant `travelId` en première colonne.
- **Préférences ≠ données** : voyage ouvert, colonnes, tri, panneaux, carte dépliée restent locales.

---

## 06 — Ce que la map met à nu

La règle « pas de donnée sans flow qui la justifie », appliquée à l'existant. Ces points sont déjà
listés au §6 de la [spec](spec-voyage-toscane.md) ; la map dit **quel parcours ils cassent**, et
chacun vit désormais dans le fichier de son objectif.

| Constat | Objectif touché |
| ------- | --------------- |
| **`transportIds` — donnée sans flow.** Le champ existe, aucun écran ne rattache un trajet, aucun total ne le compte. Exactement la donnée conçue « parce qu'elle pourrait être utile ». Le parcours manquant : entre deux étapes, on se déplace. | [G3](flows/g3-composer.md#ouvert) · [G4](flows/g4-comparer.md#ouvert) |
| **Le total des dépenses est cassé par construction.** La page Dépenses ne connaît aucun scénario, donc aucune nuit : les deux plus gros postes du voyage restent hors de la somme. Deux voies à trancher. | [G6](flows/g6-couts.md#ouvert) |
| **Deux dates par étape.** Celle calculée depuis le départ, et un champ libre resté dans la modale. Deux réponses à la même question, affichées côte à côte. | [G3](flows/g3-composer.md#ouvert) |
| **Une attraction ne se rattache qu'à une étape**, jamais à une ville : un village qui est les deux se saisit deux fois. | [G3](flows/g3-composer.md#ouvert) |
| **Les attractions ne sont pas sur la carte**, alors qu'elles portent des coordonnées saisies par le même bloc que les hébergements. | [G2](flows/g2-situer.md#ouvert) |
| **G8 n'a pas d'écran.** Pas de page Voyages : ni duplication, ni suppression, ni vue d'ensemble. | [G8](flows/g8-voyages.md#ouvert) |

**Notes de voyage** ne sert aucun objectif énoncé. Ce n'est pas un défaut : c'est le débord assumé
de tout ce que la structure n'accueille pas.
