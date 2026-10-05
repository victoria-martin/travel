# Migration React — à tester (lots du 2026-10-05)

Ce que les commits `53e45cc` → `b55fc37` ont porté, à vérifier à l'écran. Rien de tout ça n'a été
vu dans un navigateur : seul le typecheck est passé. Cocher au fur et à mesure ; noter en dessous de
la ligne ce qui ne va pas.

## Dépenses — tri

- [ ] Page **Dépenses** → bouton **Trier** dans l'en-tête → le panneau s'ouvre avec les niveaux de
      tri des charges.
- [ ] Ajouter un niveau, changer la colonne, le sens → la table **Budget prévu** se réordonne.
- [ ] Recharger la page → le tri est conservé.

## Phrases clé — en-tête

- [ ] Page **Phrases clé** → bouton **＋ Phrase** → la modale d'ajout s'ouvre.
- [ ] Bascule Tableau / Cartes → la liste change de présentation ; recharger → le mode est gardé.
- [ ] Menu **⋮** → section **Phrases** → **Style des phrases** : changer de style → les phrases se
      repeignent dans le nouveau style.
- [ ] Même réglage depuis la modale Réglages (sidebar) → section de la page Phrases présente.

## Questions par-dessus une modale

- [ ] **Lieux & activités** → cellule Type d'une ligne → **＋ Ajouter un type** → la petite boîte
      s'ouvre, le champ libellé a le focus.
- [ ] Taper un libellé, choisir emoji/couleur, **Entrée** → le type est créé et posé sur la ligne.
- [ ] Rouvrir, **Échap** → la boîte se ferme sans rien créer. Clic hors de la boîte → idem.
- [ ] Même chose avec **＋ Ajouter un statut**.
- [ ] Ouvrir la modale d'un lieu → champ Type → **＋ Ajouter…** → la boîte passe **au-dessus** de
      la modale, ses boutons sont cliquables, la modale reste ouverte derrière.
- [ ] Modale d'un trajet (Transports) → champ compagnie → **＋ Ajouter une compagnie** → créer →
      la compagnie est sélectionnée dans le champ, les autres champs de la modale n'ont rien perdu.

## Carte

- [ ] Page **Carte** → bouton **Itinéraire** → le panneau « Itinéraire » apparaît dans la colonne de
      gauche avec « Clique des points sur la carte. »
- [ ] Cliquer 3 marqueurs → 3 lignes numérotées ; au 2ᵉ point, le résumé « x km · y min » apparaît
      sous la liste et le tracé se dessine.
- [ ] Glisser une ligne par sa poignée ⠿ → l'ordre change, le tracé et le résumé suivent.
- [ ] **✕** sur une ligne → le point part. **Effacer** → la liste se vide.
- [ ] Avec des lieux uniquement : **Ajouter à un scénario** → choisir une étape → toast « Ajouté à
      l'étape », le lieu est dans les activités de l'étape.
- [ ] **Ajouter au plan** → chaque lieu rejoint l'étape la plus proche du scénario choisi.
- [ ] Avec un **hébergement** dans l'itinéraire → **Ajouter à un scénario** → la question « Un
      hébergement dans l'itinéraire » s'ouvre :
  - [ ] **Créer une nouvelle étape** → Valider → étape créée dans le scénario.
  - [ ] **Remplacer l'hébergement de « … »** (proposé seulement avec un seul hébergement et une
        étape choisie) → l'étape prend cet hébergement.
  - [ ] **Créer un nouveau scénario** → le select « À partir de » apparaît ; « Scénario vierge » et
        « Dupliquer « … » » créent chacun un scénario avec l'étape.
  - [ ] **Annuler**, **Échap**, clic dehors → rien n'est créé.
- [ ] Bouton **＋ Ville** → taper « sienne » → **Localiser** (ou Entrée) → liste de résultats →
      cliquer « Siena… » → statut « 📍 Siena ajoutée », pastille posée sur la carte.
- [ ] Ville introuvable → message « ⚠️ Introuvable — ajoute-la depuis la page Lieux. »
- [ ] Visuel : le panneau Itinéraire et le menu ＋ Ville ont la même tête que le reste de la colonne
      et des menus d'en-tête.

## À faire

- [ ] Page **À faire** → le constructeur en haut : choisir une ressource → le second select propose
      ses colonnes filtrables, les pastilles de valeurs suivent.
- [ ] Changer de ressource ou de colonne → les pastilles cochées se vident.
- [ ] Cocher des valeurs → **Ajouter la liste** s'active → clic → toast « Liste créée », la carte de
      liste apparaît dessous.
- [ ] Pour chacune des 5 ressources (Hébergements, Lieux & activités, Transports, Offres de voiture,
      Dépenses) : la table de la liste a les **mêmes colonnes et cellules** que sa page.
- [ ] Clic sur une ligne d'hébergement / de lieu / d'offre → la fiche s'ouvre en panneau.
- [ ] Colonnes masquées sur la page d'origine → masquées aussi dans la liste.
- [ ] Clic sur une pastille d'une liste existante → la valeur s'ajoute / se retire, la table suit.
- [ ] **✕** de la liste → elle disparaît.
- [ ] Champ **Rechercher** de l'en-tête → filtre les tâches libres et les lignes des listes.
- [ ] Tâches libres : ajouter (Entrée), cocher, changer le statut, supprimer — inchangé.

## Journal

- [ ] Page **Journal** → choisir un scénario → un jour → l'éditeur s'affiche avec le texte déjà
      écrit ce jour-là.
- [ ] Taper du texte → l'aperçu à droite suit à chaque frappe ; changer de jour et revenir → le
      texte est enregistré.
- [ ] Boutons Titre / Gras / Italique / Lien : avec une sélection → elle est entourée et reste
      sélectionnée ; Titre → `## ` en début de ligne, caret conservé.
- [ ] Taper `{` → le menu de lieux s'ouvre sous le champ ; taper quelques lettres → il filtre ;
      cliquer un lieu → `{Nom}` inséré, caret après l'accolade fermante, menu fermé.
- [ ] Sélectionner un mot puis taper `{` → le mot est entouré `{mot}` et le menu s'ouvre filtré.
- [ ] Pastilles **Planifiés :** au-dessus de l'éditeur → clic → `{Nom}` inséré à l'endroit du caret.
- [ ] Aperçu : `## titre`, `**gras**`, `*italique*`, `[lien](https://…)` rendus ; `{Lieu connu}` →
      bouton qui ouvre la fiche ; `{inconnu}` → texte grisé.
- [ ] Un lieu cité mais pas planifié ce jour → ligne « … n'est pas encore dans ce scénario ce
      jour-là » + **Ajouter au scénario** → il rejoint l'étape, la ligne disparaît.
- [ ] Photo (synchro active) → bouton appareil photo → la vignette apparaît ; **✕** la retire.
- [ ] Bouton **Carte** de l'en-tête → la carte du jour s'ouvre à droite avec l'hébergement, les
      activités planifiées et les lieux cités ; reclic → elle se ferme.
- [ ] Sous 640px, le même bouton ouvre la carte en sheet.
- [ ] Visuel : menu `{}` bien sous le champ, pas rogné ; aperçu et éditeur côte à côte comme avant.

## Toutes les modales

- [ ] Ouvrir 3 ou 4 modales au hasard (hébergement, étape, offre, réglages) → corps affiché
      normalement : le repli HTML de `ModalHost` a été retiré, aucune ne devrait s'ouvrir vide.

## Connu, pas corrigé

- Carte, panneau Filtres : pas de filtre par valeur de colonne (seulement les interrupteurs et
  Favoris) — voir [react-migration-plan.md § 10](react-migration-plan.md).
