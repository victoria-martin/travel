# Back office du catalogue — plan

L'outil où une agence (ou toi) crée et tient à jour les entités du catalogue — hébergements,
attractions, puis les entités à venir — et où se saisissent les notes d'inspecteur. Lot 2b de
[architecture-plan.md](architecture-plan.md), qui fixe le reste : backend Rails + GraphQL, une table
par entité (§ 3), notes d'inspecteur privées (§ 1).

## 1. Décisions (2026-10-09)

- **Front React**, pas Administrate : l'écran validé (§ 2) sort du CRUD généré — fiche en panneau
  éditée en place, bascule carte, notes qui se recalculent en direct, palette ⌘K.
- **Son propre style**, distinct de l'app travel : aucun `styles.css` ni composant de l'app réutilisé.
- **Il ne parle qu'à l'API GraphQL** de `travel-backend`, comme tout front (§ 6 du plan
  d'architecture), avec ses types générés par codegen.
- **Les notes d'inspecteur ne quittent jamais le back office** : le rôle admin est le seul à lire
  les notes par critère ; la note globale pondérée est calculée par le backend.

## 2. L'écran

Maquette validée : <https://claude.ai/artifact/Epys3c8q83VYciAKRJRbkz> (privée).

```
┌────────────┬─────────────────────────────────────────┬──────────────────────┐
│ ⌘K Cherch… │ Hébergements · 248     [Tableau|Carte]  │ Villa Lucia      ✕   │
│            │ [Toscane ✕] [Note ≥ 7 ✕] [+ Filtre]     │ photos               │
│ Hébergem.  │ Importer [colle un lien…] [Créer]       │ Note globale  8,4    │
│ Attractions│─────────────────────────────────────────│ qualité   ━━━━━━━○ 9 │
│ Restaurants│ ● Villa Lucia     Sienne      8,4  ▮▮▮▯ │ …                    │
│ …          │ ● Agriturismo…    Pienza      7,1  ▮▮▯▯ │ sections de la fiche │
│ Réglages   │ ○ Casa Bella      Lucca       —    ▯▯▯▯ │ (§ 3)                │
└────────────┴─────────────────────────────────────────┴──────────────────────┘
```

- **Barre latérale** : une entrée par entité, compteur ; Réglages (critères et poids, vocabulaires,
  équipe).
- **Liste** : tableau dense, sélecteur de colonnes (les entités ont beaucoup de champs, § 3),
  filtres en pastilles, pagination et filtres exécutés par le backend, jauge de complétude par
  ligne ; bascule **Carte** sur la même sélection.
- **Fiche en panneau** à droite, éditée en place, enregistrée automatiquement (une mutation par
  champ modifié, état « Enregistré » visible) ; **plein écran** pour une saisie longue.
- **Notes d'inspecteur** : un curseur 0–10 par critère, poids affichables, note globale en grand.
- **Créer** : « Nouvelle fiche » vide, ou **import par lien** Booking / Airbnb / Google Maps qui
  pré-remplit la fiche (lot 6 du plan d'architecture).
- **⌘K** : sauter à n'importe quelle fiche, toutes entités confondues.

Jetons de style de la maquette : fond `#F7F7F5`, panneaux `#FFFFFF`, encre `#18181B`, texte
secondaire `#5F6368`, accent `#2F4FD8`, succès `#2D7A46`, filets `#E6E6E1` ; typo Geist et
Geist Mono (chiffres) ; rayons 8 / 10 / 14 px.

## 3. Les champs de la fiche

Inventaire de ce que l'app travel gère aujourd'hui
([store/types.ts](../../src/store/types.ts) `Accommodation` / `Attraction`, colonnes de
[accommodations/table/columns.js](../../js/views/accommodations/table/columns.js) et
[attractions/columns.js](../../js/views/attractions/columns.js)), réparti selon le § 3 du plan
d'architecture : le back office ne montre que ce qui décrit l'entité du catalogue ; ce qui décrit
le voyage d'un voyageur reste dans l'app travel.

### Hébergement — sections de la fiche

| Section              | Champs                                                                      |
| -------------------- | --------------------------------------------------------------------------- |
| Identité             | nom, type (vocabulaire)                                                     |
| Localisation         | adresse, ville, province, région, pays, coordonnées (mini-carte), lien Maps |
| Réservation et liens | lien, lien Booking                                                          |
| Photos               | galerie, glisser-déposer (nouveau)                                          |
| Notes d'inspecteur   | un curseur par critère, note globale pondérée                               |
| Notes internes       | texte libre de l'équipe (nouveau)                                           |
| Suivi                | créé le, modifié le, complétude                                             |

Restent dans le voyage, hors back office : statut, favori, dates, disponible du / au, date de
recherche, notes du voyageur, étape choisie. **À trancher** (question 2 du plan d'architecture) :
prix, tags, heure d'arrivée.

### Attraction — sections de la fiche

| Section         | Champs                                                                      |
| --------------- | --------------------------------------------------------------------------- |
| Identité        | nom, type (vocabulaire), description                                        |
| Localisation    | adresse, ville, province, région, pays, coordonnées (mini-carte), lien Maps |
| Infos pratiques | horaires, téléphone, lien                                                   |
| Photos          | galerie (nouveau)                                                           |
| Notes internes  | texte libre de l'équipe (nouveau)                                           |
| Suivi           | créé le, modifié le, complétude                                             |

Restent dans le voyage : statut, favori, hébergement rattaché, budget. **À trancher** : prix
mini / maxi, tags.

La fiche se lit par sections repliables avec un sommaire ancré en tête, pour qu'une fiche
complète reste lisible dans le panneau ; le plein écran les dispose sur deux colonnes.

## 4. Lots

Chaque lot a sa part backend (types, queries et mutations GraphQL réservés à l'admin) et sa part
front.

| Lot  | Livrable                                                                                               | Dépend de                       |
| ---- | ------------------------------------------------------------------------------------------------------ | ------------------------------- |
| BO-0 | Le projet : Vite + React + TypeScript, client Apollo + codegen sur le schéma, routage, connexion admin | lot 1 (backend), Q4, question 1 |
| BO-1 | La coquille (barre latérale, ⌘K) et la liste des hébergements : colonnes, filtres, pagination backend  | BO-0, lot 2 (modèles)           |
| BO-2 | La fiche hébergement : sections, édition en place, enregistrement auto, création, plein écran          | BO-1, question 2                |
| BO-3 | Notes d'inspecteur : critères et poids en Réglages, curseurs, note globale calculée par le backend     | BO-2                            |
| BO-4 | La carte et les filtres par note                                                                       | BO-3                            |
| BO-5 | Les attractions, sur les mêmes briques                                                                 | BO-2                            |
| BO-6 | Les photos                                                                                             | BO-2, question 3                |
| BO-7 | L'import par lien                                                                                      | BO-2, lot 6 (scrapers)          |

## 5. Questions ouvertes

1. **Où vit le back office ?** Recommandation : son propre repo, `travel-backoffice` — cohérent
   avec « un repo par app » et avec un style à lui, qui retire l'intérêt de réutiliser les
   composants de l'app travel. Alternative : une section de l'app travel réservée à l'admin.
   Bloque : BO-0.
2. **Prix, tags, heure d'arrivée, prix mini / maxi** : décrivent-ils l'entité du catalogue ou le
   voyage ? (question 2 du plan d'architecture). Bloque : BO-2.
3. **Stockage des photos** : Active Storage sur quel service (S3, R2…) ? Bloque : BO-6.
