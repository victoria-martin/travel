# Catalogue d'hébergements — page Découvrir

Faire vivre un catalogue global d'hébergements (indépendant d'un voyage) dans une vraie base
relationnelle, consultable dans une nouvelle page **Découvrir**, avec un bouton pour copier une
entrée dans le voyage ouvert. Premier pas du besoin noté dans
[atelier/notes.json](../atelier/notes.json) (catalogue partagé multi-client) — démarré ici à scope
réduit, avant que le multi-tenant réel soit tranché (voir
[react-migration-plan.md § 9](react-migration-plan.md)).

Décisions actées :

- **Backend** : Hasura Cloud, Postgres inclus — API GraphQL générée depuis le schéma, pas de
  backend applicatif à écrire pour le CRUD.
- **Front** : Apollo Client. La page se construit directement en React
  (`src/domains/decouvrir/`), pas en legacy — c'est un écran neuf et non un portage, et c'est le
  seul qui a besoin d'un client GraphQL.
- **Scope actuel** : catalogue en lecture seule depuis l'app. L'écriture (remplissage, futur
  import/scraping — notes.json, tâches 2 à 4) passe par la console Hasura, pas par une UI.
- **Ajout au voyage = copie**, pas de référence vivante : le bouton crée une ligne dans la
  collection `accommodations` existante du voyage (mécanisme Sheet inchangé), champs copiés depuis
  le catalogue.
- **Pas d'auth/multi-tenant** : le catalogue est public en lecture, « mon voyage » reste le voyage
  ouvert dans l'app. Le multi-tenant réel (comptes, catalogue par client) reste hors scope — c'est
  le point que l'adaptateur sync ([react-migration-plan.md § 2](react-migration-plan.md)) garde
  ouvert pour plus tard.
- **Page à part** : « Découvrir » n'est pas un onglet d'Hébergements — donnée de nature différente
  (catalogue global vs données du voyage), même critère que les autres domaines de l'app
  ([CLAUDE.md](../CLAUDE.md), « un dossier = un domaine »).

## 1. Schéma Postgres

```sql
create table accommodations_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,              -- vocabulaire ACCOMMODATION_TYPES existant (js/accommodation-statuses.js)
  address text,
  lat double precision,
  lng double precision,
  city text,
  photos jsonb default '[]',
  booking_url text,
  homeexchange_url text,
  tags jsonb default '[]',
  source text,             -- 'manuel' | 'booking' | 'homeexchange'
  created_at timestamptz default now()
);
```

Lecture publique (rôle `anon` autorisé en `select`), écriture réservée au rôle admin Hasura.

## 2. Flux d'ajout au voyage

Le bouton « Ajouter à mon voyage » sur une ligne du catalogue ne passe pas par GraphQL en
écriture : il appelle la création d'hébergement existante côté legacy (`data.accommodations` du
voyage courant), avec les champs copiés depuis l'entrée catalogue. Un champ `catalogId` est ajouté
à l'entité Accommodation du voyage pour tracer l'origine — sans lien vivant, une entrée copiée ne
se remet pas à jour si le catalogue change ensuite.

## 3. Côté front

- `@apollo/client` + `graphql` ajoutés aux deps (`package.json`), client posé dans un fichier dédié
  (ex. `src/store/catalogClient.ts`), pointant sur l'endpoint Hasura Cloud.
- `REACT_VIEWS.decouvrir` ([main.tsx](../src/main.tsx)) monte `DecouvrirView` — nouvelle entrée
  dans `NAV_ITEMS` ([nav-items.js](../js/views/nav-items.js)).
- Un hook `useAccommodationsCatalog()` dans `src/domains/decouvrir/` fait la query de liste (nom,
  type, ville, photo) ; pas de filtre serveur pour la première version, le filtrage se fait côté
  client comme les autres listes de l'app.

## 4. Phases

| Phase | Livrable |
| --- | --- |
| 0 | Projet Hasura Cloud créé, table `accommodations_catalog`, quelques lignes à la main |
| 1 | `@apollo/client` posé, query de liste, page Découvrir en lecture seule |
| 2 | Bouton « Ajouter à mon voyage » → copie dans `data.accommodations`, champ `catalogId` |
| 3 | Plus tard : écriture catalogue (import Booking/Google/Airbnb, scraping prix/dispo) — notes.json, tâches 2 à 4 |
