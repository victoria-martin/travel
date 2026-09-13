---
name: commit-task
description: Clore la tâche du board ouverte dans cette session — la passer à ✅ fait dans PLAN.md, stager le travail, commiter et pousser. Utiliser quand l'utilisatrice dit « /commit-task », « commit et résous la tâche », « on clôt la tâche ».
---

# Clore la tâche de la session

Une session de travail vient d'une tâche du board : la clore, c'est le même geste que commiter.
L'invocation de ce skill EST le go pour écrire dans PLAN.md, stager, commiter et pousser — ne rien
redemander.

## 1. Retrouver la tâche

[retrouver-la-tache.md](../shared/retrouver-la-tache.md) : le lien session ↔ tâche, et le
rattachement quand la conversation a été ouverte à la main.

## 2. Lire ce qui a été fait

Le diff, jamais la mémoire de la conversation :

```sh
git status --short
git diff
git diff --cached
```

## 3. Passer la tâche à ✅ fait

Le statut est le dernier morceau de la liste `·` de la puce, avant le `:` du détail :

```
- **Titre** <!--t:abcd--> — 🧩 ui · ✅ fait : le détail, s'il y en a un
```

Ne jamais toucher au marqueur `<!--t:id-->`, c'est le lien vers la session.

Le diff ne fait qu'une partie de ce que la tâche demande → ne pas la clore : la réécrire sur ce qui
reste, statut inchangé, et le dire.

## 4. Commiter et pousser

Invoquer `commit`. Il fait suivre le reste des docs — les skills `update-plan-*` du dépôt, qu'il
liste lui-même —, rédige le message, stage, commit et pousse. Répondre « j'ajoute tout » à sa
question de périmètre : le travail de la tâche part en entier.

## 5. Livrer

Le titre de la tâche close, le sujet du commit et son sha. Rien de plus.
