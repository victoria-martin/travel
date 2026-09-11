---
name: update-plan-spec
description: Faire suivre PLAN.md et docs/spec-voyage-toscane.md après un travail terminé — l'item fait sort du backlog, la feature est décrite dans la spec. Utiliser quand l'utilisatrice dit « /update-plan-spec », « mets à jour le plan et la spec », ou quand le pre-push refuse un push faute de changement dans PLAN.md ou docs/.
---

# Mettre PLAN.md et la spec à jour

Le backlog ne garde que ce qui reste à faire ; la spec décrit ce qui existe. Un travail n'est
fini que quand les deux ont suivi.

## 1. Cerner ce qui vient d'être fait

Lire le diff, jamais la mémoire de la conversation :

```sh
git diff --cached
git log --oneline origin/main..HEAD
```

Le périmètre est ce que ce diff change **pour l'utilisatrice**. Un refactor, un fix de régression
ou un renommage ne sont pas des items de backlog : voir §5.

## 2. Sortir les items faits de PLAN.md

- Un item terminé **disparaît** de [PLAN.md](../../../PLAN.md) — il ne se marque pas « ✅ », git
  archive le reste.
- Un item **partiellement** fait est réécrit sur ce qui reste, pas laissé tel quel. Formuler ce qui
  manque, pas ce qui a été fait (« la couleur se choisit déjà, rien ne la lit » → « brancher la
  couleur aux variables CSS »).
- Une section vidée de tous ses items disparaît avec eux.
- Si le travail a révélé une suite nécessaire (une suppression manquante, un cas non couvert), elle
  entre au backlog dans le même tour.

## 3. Décrire la feature dans la spec

Dans [docs/spec-voyage-toscane.md](../../../docs/spec-voyage-toscane.md), au bon endroit :

| Ce qui a été fait               | Où ça s'écrit                     |
| ------------------------------- | --------------------------------- |
| un arbitrage de fond tranché    | « Décisions actées »              |
| une entité, un champ            | le tableau du « Modèle »          |
| un écran, un geste, une modale  | le bloc d'écran de « Les écrans » |
| une règle qui vaut partout      | « Règles transverses »            |
| un manque structurant qui reste | « Ce qui reste ouvert »           |

La spec décrit l'app **au présent**, pour quelqu'un qui ne connaît ni la branche ni la
conversation : pas de « désormais », pas de « contrairement à avant ».

## 4. Relire dans l'autre sens

Un item ajouté au backlog contredit peut-être une décision actée ou un bloc d'écran. Le signaler
dans le même tour.

## 5. Quand il n'y a rien à écrire

Un fix de régression, un refactor interne, un changement d'outillage ne sortent aucun item et ne
décrivent aucune feature. Ne rien inventer pour satisfaire le [pre-push](../../../.githooks/pre-push) :
le dire, et donner l'échappatoire.

```sh
SKIP_DOCS_CHECK=1 git push origin "$(git rev-parse --abbrev-ref HEAD)"
```

## 6. Livrer

Le diff des deux fichiers, et une ligne par item sorti du backlog. Ne pas commiter : c'est elle qui
commit.
