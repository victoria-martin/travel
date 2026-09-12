---
name: update-plan-tool
description: Passer à ✅ fait les tâches de la section plan-tool de PLAN.md que le diff courant termine. Utiliser quand l'utilisatrice dit « /update-plan-tool », ou avant tout commit qui touche tools/plan-board.
---

# Mettre la section plan-tool de PLAN.md à jour

Le board est son propre backlog : une tâche de `## 💻 plan-tool` ne sort pas du fichier quand elle
est faite, elle passe à `✅ fait` et reste lisible à l'écran. C'est la différence avec
`update-plan-spec`, qui vide le backlog du voyage et décrit la feature dans la spec —
[tools/plan-board/](../../../tools/plan-board) est un outil de dev, il n'entre pas dans
[docs/spec-voyage-toscane.md](../../../docs/spec-voyage-toscane.md).

## 1. Cerner ce qui vient d'être fait

Lire le diff, jamais la mémoire de la conversation :

```sh
git diff --cached -- tools/plan-board
git diff -- tools/plan-board
```

Si le diff ne touche pas `tools/plan-board`, il n'y a rien à faire : le dire et s'arrêter.

## 2. Apparier le diff aux tâches

Les tâches candidates sont les puces de `## 💻 plan-tool` dans [PLAN.md](../../../PLAN.md), chacune
identifiée par son marqueur `<!--t:id-->`. Une tâche ne bouge que si le diff fait **tout** ce
qu'elle demande.

- Le diff couvre la tâche entière → `✅ fait`.
- Le diff n'en fait qu'une partie → la réécrire sur ce qui reste, statut inchangé.
- Le diff fait quelque chose qu'aucune tâche ne demandait → ne rien inventer ; l'écrire comme tâche
  neuve seulement si elle a demandé de la garder au backlog.

Ne jamais toucher au marqueur `<!--t:id-->` : c'est le lien vers la session Claude de la tâche.

## 3. Écrire le statut

Le statut est le dernier morceau de la liste `·` de la puce, avant le `:` du détail :

```
- **Titre** <!--t:abcd--> — 🧩 layout · ✅ fait : le détail, s'il y en a un
```

Les statuts sont une liste figée — ⏳ à faire, 💡 idée, 🚧 en cours, ⏸️ en attente, 🌙 plus tard,
✅ fait, 🚫 abandonné, 📓 à planifier, 🔍 à étudier — qui vit dans
[statuses.js](../../../tools/plan-board/statuses.js). En inventer un ici casse la lecture du board.

## 4. Livrer

Une ligne par tâche touchée : son titre et son nouveau statut. Ne pas commiter — l'appelant le fait.
