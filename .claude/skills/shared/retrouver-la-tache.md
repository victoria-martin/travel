# Retrouver la tâche de la session

Le board lance une session par tâche et garde le lien dans
[.claude/plan-sessions.json](../../plan-sessions.json). L'id de la session courante est le dernier
segment du dossier de scratchpad de la session.

```sh
python3 -c "
import json, sys
tasks = json.load(open('.claude/plan-sessions.json'))['tasks']
print(next((id for id, t in tasks.items() if t['sessionId'] == sys.argv[1]), ''))" <session-id>
```

Un id sort → c'est la tâche, sa puce porte `<!--t:id-->` dans [PLAN.md](../../../PLAN.md).

Rien ne sort → la conversation a été ouverte à la main. Elle a peut-être quand même une tâche : la
chercher avant de demander.

## Rattacher une conversation ouverte à la main

1. **Proposer les candidates.** Croiser le sujet de la conversation et `git status --short` avec les
   puces de PLAN.md, et rendre les plus proches — titre, id, portée, statut — plus « aucune ».
   Ne pas en choisir une seule : c'est elle qui tranche.

2. **Écrire le lien**, une fois la tâche nommée. Le serveur est le seul écrivain de
   `plan-sessions.json`, et le seul endroit où un statut se décide : il passe la tâche à
   `🚧 en cours` au passage, comme un lancement depuis le board.

   ```sh
   curl -fsS -X PUT localhost:4321/api/tasks/<id>/session \
     -H 'content-type: application/json' \
     -d '{"sessionId":"<session-id>"}'
   ```

   - `409` → la tâche porte déjà une session, qui pointe vers une autre conversation : le dire et
     attendre, ne pas forcer.
   - Connexion refusée → le board ne tourne pas (`pnpm plan`) : le dire et attendre.

3. **Reprendre le cours du skill** avec la tâche rattachée.

Elle répond « aucune » → s'arrêter là et attendre.
