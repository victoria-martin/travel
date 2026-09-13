---
name: plan-tool-close-sessions
description: Trier les sessions ouvertes du board — pour chaque tâche qui en porte une, dire si son travail est déjà commité, la passer à ✅ fait et fermer sa session. Utiliser quand l'utilisatrice dit « /plan-tool-close-sessions », « fais le tri dans les sessions », « qu'est-ce qui traîne encore dans les sessions ».
---

# Fermer les sessions dont le travail est fait

Une tâche entre dans la liste des sessions quand on la lance, et n'en sort jamais d'elle-même : la
liste finit par tenir des tâches closes et des tâches disparues de PLAN.md. Ce skill la relit, juge
chaque tâche sur le code, et ferme celles qui sont finies.

L'invocation EST le go pour écrire — le statut dans PLAN.md, la fermeture côté board. Ne rien
redemander.

Tout passe par le board (`pnpm plan`), seul écrivain de
[.claude/plan-sessions.json](../../plan-sessions.json) et de [PLAN.md](../../../PLAN.md). Connexion
refusée → le dire et s'arrêter.

## 1. Lister les sessions actives

Une session fermée porte `closedAt` et ne se rejuge pas. Une session sans tâche dans PLAN.md est
orpheline : la tâche a été supprimée sous elle.

`startLine + 1` est la ligne de la puce dans PLAN.md. C'est par là qu'une tâche se nomme d'un bout
à l'autre du rendu — l'id sert à l'appeler, jamais à la désigner.

```sh
python3 - <<'PY'
import json, urllib.request
store = json.load(open('.claude/plan-sessions.json'))['tasks']
board = json.load(urllib.request.urlopen('http://localhost:4321/api/tasks'))
tasks = {task['id']: task for task in board['tasks']}
for id, session in store.items():
    if session.get('closedAt'):
        continue
    task = tasks.get(id)
    said = f"PLAN.md:{task['startLine'] + 1} {task['status']} · {task['title']}" if task else 'ORPHELINE'
    print(id, session['createdAt'][:16], said)
PY
```

## 2. Juger chaque tâche

Deux cas se tranchent sans lire le code : une tâche **orpheline** n'a plus rien à juger, une tâche
déjà **✅ fait** ou **🚫 abandonné** est close. Les deux se ferment.

Pour les autres, dans cet ordre :

- **sa puce entière** dans PLAN.md — le corps dit ce qui est demandé, le titre le résume mal ;
- `git log --since='<createdAt>' --format='%h %s' -- <les fichiers du domaine>` ;
- `git status --short` et `git diff` — un travail en cours n'est pas commité.

Le verdict se lit dans le code, jamais dans le sujet d'un commit : aucun commit ne porte l'id d'une
tâche, et un sujet qui nomme le sujet ne dit pas que la puce est honorée. Ouvrir les fichiers que
la tâche vise et vérifier que ce qu'elle demande y est.

Trois verdicts, rien d'autre :

- **fait et commité** — tout ce que la puce demande se lit dans le code.
- **entamé** — une partie seulement : nommer ce qui reste, la tâche ne se ferme pas.
- **rien** — la session a été ouverte, le travail n'a pas commencé. Elle se ferme quand même :
  une tâche jamais entamée n'a pas de conversation à reprendre. Son statut, lui, ne bouge pas — elle
  reste dans le backlog telle quelle.

Une puce qui demande plusieurs choses ne se ferme que si elles y sont toutes : dans le doute, c'est
*entamé*.

## 3. Fermer ce qui est fait

Fermer une session ne dit pas que la tâche est faite : ce sont deux gestes, et deux listes.

- `IDS_DONE` — le travail est fait et commité : ✅ fait, puis fermeture.
- `IDS_CLOSE` — rien à retenir de la conversation : fermeture seule, le statut reste ce qu'il est.
  Les orphelines et les tâches jamais entamées vont là, les déjà ✅ fait aussi.

Une tâche dont le statut ne change pas ne se réécrit jamais : un `PATCH` renvoie la puce entière au
board, qui la reformate, et un corps qui n'est pas de la prose — du code collé, une liste indentée —
n'y survit pas.

```sh
python3 - <<'PY'
IDS_DONE = ['abcd']
IDS_CLOSE = ['efgh']

import json, urllib.request
API = 'http://localhost:4321/api/tasks'

def call(url, method, body=None):
    request = urllib.request.Request(
        url,
        method=method,
        data=json.dumps(body).encode() if body else None,
        headers={'content-type': 'application/json'},
    )
    return json.load(urllib.request.urlopen(request))

tasks = {task['id']: task for task in call(API, 'GET')['tasks']}
for id in IDS_DONE + IDS_CLOSE:
    task = tasks.get(id)
    wrote = id in IDS_DONE and task and task['status'] != 'fait'
    if wrote:
        call(f'{API}/{id}', 'PATCH', {**task, 'status': 'fait'})
    call(f'{API}/{id}/session', 'DELETE')
    print(id, '✅ fait + fermée' if wrote else 'fermée' if task else 'fermée (orpheline)')
PY
```

La session garde son `sessionId` : le ▶ de la tâche rouvre la même conversation, et la rouvrir la
remet dans la liste.

## 4. Livrer

Un tableau, une ligne par session active au départ : la tâche, le verdict, ce qui a été écrit. Pour
celles qui restent ouvertes, ce qui reste à faire — une ligne, pas un récit.

Une tâche se nomme par un lien vers sa puce, `[<titre>](PLAN.md#L<ligne>)`, et jamais par son id :
il faut pouvoir sauter dans PLAN.md depuis le tableau. Une orpheline n'a plus de ligne — elle se
nomme par son id, faute de mieux.

Finir par l'état de PLAN.md : les statuts changés ne sont pas commités.
