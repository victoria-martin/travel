# Architecture cible — catalogue, backend, fronts

Passer d'une app statique qui lit tout un Google Sheet à une **base commune** : un catalogue global
de lieux (hébergements, activités…), servi par un backend, que l'app travel consulte et dans lequel
elle pioche pour composer un voyage. Les autres fronts imaginés dans
[atelier/notes.json](../../atelier/notes.json) — agence, sites de niche, guide type Fooding, outil
vendu à des travel agents, un jour une app React Native — lisent la même base.

Remplace [catalogue-plan.md](../archivé/catalogue-plan.md) (Hasura Cloud, ajout au voyage par
copie), archivé le 2026-10-05.

## 1. Décisions actées (2026-10-05)

- **Backend : Rails, API GraphQL** (`graphql-ruby`), Postgres, tests rspec. Les évolutions visées
  sont de la logique métier et des tâches de fond (multi-tenant, import Booking/Google/Airbnb,
  scraping prix/dispo, suggestions), pas du CRUD : elles vivent dans des modèles, des services et
  des jobs testés, au même endroit. Rails plutôt qu'un autre langage parce que c'est la stack
  maîtrisée côté utilisatrice. Hasura et Supabase écartés : la logique y finirait éclatée entre
  règles SQL, fonctions serverless et console.
- **Un repo par app** (2026-10-06, remplace le monorepo pnpm) : le backend dans son propre repo,
  chaque front dans le sien — l'app travel reste dans ce repo, telle quelle (§ 2). Ils ne
  partagent que le contrat GraphQL, aucun package de code : la logique métier vit dans le backend
  et chaque front la reçoit par l'API. Un changement qui touche backend et front fait deux commits,
  un par repo.
- **L'app travel reste une SPA Vite + React.** Privée, interactive, pensée hors ligne : le rendu
  serveur ne lui apporte rien.
- **Next n'entre pas dans l'app travel.** Ce qu'il ajoute à React est surtout du serveur — rendu
  serveur, métadonnées de partage, Server Components, routes API — et rien de ça ne sert une app
  privée derrière un login.
- **Nuxt exclu** : Vue ne partage rien avec React ni React Native.
- **Types générés par codegen** : chaque front génère ses types TS depuis le schéma GraphQL du
  backend, dans son propre repo — jamais réécrits à la main.
- **Ajouter au voyage = référence** : le voyage pointe vers la fiche du catalogue, qui reste à
  jour (prix, dispo scrapés) et nourrit la base commune (§ 3). Pas de copie.
- **Toutes les données du voyage passent dans Postgres** : le Google Sheet disparaît. Une seule
  source, une requête par voyage ouvert, multi-tenant possible.
- **Back office : Administrate, dans le repo backend** (2026-10-09) : la liste et les fiches des
  lieux du catalogue sont générées depuis les modèles Rails ; les vues (ERB) et le CSS sont copiés
  dans le repo et se modifient comme n'importe quelle vue. Son style est le sien, distinct de
  l'app travel. Un front React pourra prendre le relais sur la même API GraphQL si le back office
  devient une app riche (carte, édition en ligne, glisser-déposer).
- **Notes d'inspecteur** (2026-10-09) : un hébergement du catalogue porte des notes par critère,
  saisies dans le back office. Elles ne sont jamais servies à l'app du voyageur : le backend s'en
  sert pour conditionner l'affichage (carte, Découvrir…) et ne renvoie que le résultat filtré.
  - Critères de départ : qualité, intimité, déco, propreté, calme, vue, accueil, emplacement. La
    liste se modifie depuis le back office.
  - Chaque critère se note de 0 à 10 et porte un poids ; la note globale est la moyenne pondérée.
  - Pas de note publique (Booking/Google) pour l'instant.

Piste, pas une certitude :

- **Next pour les fronts publics.** Next sert les pages qu'un inconnu
  doit trouver et ouvrir sans compte — un guide indexé par Google, un lien partagé qui affiche son
  aperçu. L'app travel n'en a aucune ; les sites publics (guide, sites de niche) si. Aucun n'est
  planifié : chacun serait son propre repo, et le choix se refera quand l'un d'eux démarrera.

## 2. Les repos

```
travel-backend/      nouveau repo (lot 1) : Rails — API GraphQL, back office Administrate, modèles, jobs, rspec
travel/              ce repo, inchangé : l'app (index.html, js/, src/, styles/), tools/, apps-script/
site/, agence/…      plus tard, un repo chacun (fronts publics, outil pour agences)

chaque front ──GraphQL──▶ travel-backend ──▶ Postgres
```

- **Le contrat** : le backend publie son schéma GraphQL ; chaque front le récupère et lance son
  codegen (types, opérations, client Apollo) dans son propre repo.
- **Pas de code partagé entre repos** : un calcul métier dont deux fronts ont besoin passe dans le
  backend et s'expose dans le schéma, au lieu d'un paquet npm commun.
- `apps-script/` disparaît de ce repo une fois ses scrapers portés dans le backend (§ 5, lot 6) et
  le Sheet abandonné (§ 1).

## 3. Modèle cible : le catalogue possède le lieu, le voyage le référence

```
catalogue (global)                 voyage (par travelId)
┌──────────────────────┐           ┌──────────────────────────┐
│ place                │◄──────────│ travel_place             │
│  name, type          │  placeId  │  travelId, placeId       │
│  address, lat/lng    │           │  status, favorite, notes │
│  links, photos       │           │  price, dates, dispo     │
│  hours, phone        │           │  tags perso              │
└──────────────────────┘           └──────────────────────────┘
```

- **Découvrir** parcourt les `place` ; « Ajouter au voyage » crée un `travel_place`.
- **Hébergements / Lieux & activités** listent les `travel_place` du voyage ouvert, joints à leur
  `place`.
- **Créer un lieu depuis l'app** (saisie, import collé —
  [paste-import.js](../../js/views/accommodations/modal/paste-import.js)) crée le `place` au
  catalogue s'il n'existe pas, puis la référence.
- **On ne charge plus tout** : une requête pour le voyage ouvert, le catalogue paginé et filtré
  côté serveur. Aujourd'hui un seul `sheetGet()` ramène tous les voyages
  ([sync.js:215](../../js/sync.js#L215)), filtrés ensuite dans le navigateur
  ([current-travel.js](../../js/current-travel.js)).

Partage proposé des champs actuels
([accommodations/modal/form.js](../../js/views/accommodations/modal/form.js),
[attractions/modal/form.js](../../js/views/attractions/modal/form.js)) — à valider, question 2 :

| Entité      | → `place` (catalogue)                                                                                         | → `travel_place` (voyage)                                                                     | ambigu                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Hébergement | `name`, `type`, `address`, niveaux de lieu, `lat`, `lng`, `link`, `bookingLink`, `mapsLink`                   | `status`, `price`, `dates`, `availableFrom`, `availableTo`, `searchDate`, `notes`, `favorite` | `checkInTime`, `tags`                     |
| Attraction  | `name`, `type`, `description`, `address`, niveaux de lieu, `lat`, `lng`, `mapsLink`, `link`, `hours`, `phone` | `status`, `accommodationId` (→ un `travel_place`), `favorite`                                 | `budget`, `amountMin`/`amountMax`, `tags` |

## 4. Questions ouvertes

Chacune porte ma recommandation ; rien n'est codé tant qu'elle n'est pas tranchée.

1. **Quelles entités vont au catalogue ?** Hébergements et attractions, oui. À trancher : la
   collection `villes`, les modèles de voiture (le catalogue ADEME de
   [consumption-db.js](../../js/views/car-models/consumption-db.js) est déjà global de fait), les
   loueurs (`providers`). Bloque : lot 2 pour le schéma initial, ou extension plus tard.
2. **Champs ambigus** (colonne « ambigu » du § 3) : décrivent-ils le lieu ou le voyage ? Bloque :
   lot 2.
3. **Hors ligne** : on garde l'exigence « tout continue sans réseau » (cache Apollo persistant +
   file d'écritures rejouée), ou elle tombe avec le Sheet ? Aujourd'hui, localStorage sert de cache entre deux synchros. Bloque : lot 4.
4. **Authentification** : dans Rails (Devise/Rodauth + JWT) ou fournisseur externe ? Bloque :
   lot 5, et la lecture publique du catalogue en attendant.
5. **Hébergement du backend** (Render, Fly.io…) et de l'app travel (Netlify, déjà visé par la tâche « Passer le repo en
   privé et héberger sur Netlify » de [PLAN.md](../../PLAN.md)). Bloque : lot 1.
6. ~~**La note d'un lieu**~~ — tranchée le 2026-10-09 : notes d'inspecteur par critère, de 0 à 10,
   note globale pondérée, critères modifiables au back office, pas de note publique pour l'instant
   (§ 1).

## 5. Lots

| Lot | Livrable                                                                                                                                                                                                          | Dépend de            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 0   | ~~Monorepo~~ — abandonné le 2026-10-06, remplacé par un repo par app (§ 1) : l'app travel ne bouge pas                                                                                                            | —                    |
| 1   | Repo `travel-backend` : Rails, Postgres, `graphql-ruby`, rspec, déployé. Pas en mode API only : ce mode retire les sessions, les cookies et le flash dont le back office HTML a besoin                            | Q5                   |
| 2   | Catalogue : modèle `Place`, query paginée, codegen + client Apollo dans l'app travel, page **Découvrir** en lecture seule ; filtres et tri (dont la note) exécutés par le backend, pas dans le navigateur         | Q1, Q2               |
| 2b  | Back office Administrate : liste et fiche des hébergements du catalogue, notes d'inspecteur par critère et leurs poids, liste des critères, style propre ; accès réservé à l'admin                              | lot 2, Q4            |
| 3   | « Ajouter au voyage » depuis Découvrir ; le lieu apparaît dans la page Hébergements du voyage                                                                                                                     | lot 4 (hébergements) |
| 4   | Données du voyage dans Postgres : modèles, import unique depuis le Sheet, l'adaptateur de [src/store/sync.ts](../../src/store/sync.ts) passe sur GraphQL, Hébergements et Lieux & activités lisent `travel_place` | Q3                   |
| 5   | Auth + multi-tenant                                                                                                                                                                                               | Q4                   |
| 6   | Imports et scrapers portés d'[apps-script/](../../apps-script/) (Booking, HomeExchange, Airbnb, Google Maps) vers des services et jobs du backend ; scraping prix/dispo récurrent                                 | lot 2                |
| —   | Front public (Next, piste), dans son propre repo                                                                                                                                                                  | hors scope           |

L'adaptateur de [src/store/sync.ts](../../src/store/sync.ts) a été pensé pour qu'on change de
source sans toucher aux hooks ni aux composants. Il ne suffira pas au lot 4 : la forme des données
change elle-même (un hébergement devient `place` + `travel_place`), donc les lecteurs
d'Hébergements et de Lieux & activités changent aussi.

## 6. L'app travel ne connaît que le contrat GraphQL

L'app travel ne dépend jamais du code du backend : seulement de son schéma GraphQL, dont elle
génère ses types. Le backend étant en Ruby et dans un autre repo, aucun import direct n'est
d'ailleurs possible. Changer de backend revient à servir le même schéma.

## 7. Lien avec la migration React

Partage acté le 2026-10-05 avec [react-migration-plan.md](../archivé/react-migration-plan.md) :

- **L'affichage** reste à la migration React : les morceaux legacy encore rendus (§ 10 de ce
  plan-là) se finissent en parallèle, dans n'importe quel ordre — ils ne dépendent pas du backend.
- **Les données** passent à ce plan-ci : `window.state`, les mutations legacy (`upsertX`,
  `saveNow`), la synchro Sheet ([sync.js](../../js/sync.js)) ne sont **pas** portées sur Zustand.
  Le lot 4 les remplace directement par GraphQL ; les porter d'abord ferait refaire le même
  travail une fois le Sheet abandonné.
- **Ordre de démarrage** : lots 1 → 2 → 2b. Ils ne touchent pas au legacy — Découvrir est un
  écran neuf branché sur GraphQL, le back office vit dans le repo backend.
