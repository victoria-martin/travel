---
name: plan-tool-commit-task
description: Clore la tâche du board ouverte dans cette session — la passer à ✅ fait dans PLAN.md, stager le travail, commiter et pousser. Utiliser quand l'utilisatrice dit « /plan-tool-commit-task », « commit et résous la tâche », « on clôt la tâche ».
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

Invoquer `plan-commit`. Il fait suivre le reste des docs — les skills du dépôt dont le nom porte
`update-plan`, qu'il liste lui-même — puis passe la main à `commit`, qui rédige le message, stage,
commit et pousse.

Le périmètre est **le travail de cette tâche**, nommé fichier par fichier — jamais « tout ». Le
board ouvre une session par tâche dans le même dossier : ce que le worktree porte en plus appartient
à une conversation voisine, en cours d'écriture, et l'emporter la prive de son commit. Donc
`git add <chemins>` puis `git commit <chemins>`, jamais `git add -A` ni un `git commit` qui prend
l'index tel quel.

Le voisin commite pendant qu'on travaille : relire `git log` et `git status` juste avant de
commiter, et si le travail de la tâche est déjà parti dans son commit, le dire plutôt que de le
recommiter.

## 5. Livrer

Le titre de la tâche close, le sujet du commit et son sha. Rien de plus.
