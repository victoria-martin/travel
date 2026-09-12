---
name: start-task
description: Démarrer la tâche du board qui a ouvert cette session — la relire dans PLAN.md, l'état des lieux, le design proposé, puis attendre le go. Utiliser quand l'utilisatrice dit « /start-task », « on démarre la tâche », ou quand la session s'ouvre sur ce prompt.
---

# Démarrer la tâche de la session

Le board ouvre une session par tâche, et son prompt d'ouverture est `/start-task` : le détail de la
tâche n'est pas dans la conversation, il est dans PLAN.md. Ce skill va le chercher.

L'invocation EST le go pour **lire** — pas pour écrire. La sortie est du texte : ce que la tâche
demande, l'état des lieux, le design proposé. Rien n'est modifié avant sa validation.

## 1. Retrouver la tâche

L'id de la session courante est le dernier segment du dossier de scratchpad de la session.

```sh
python3 -c "
import json, sys
tasks = json.load(open('.claude/plan-sessions.json'))['tasks']
print(next((id for id, t in tasks.items() if t['sessionId'] == sys.argv[1]), ''))" <session-id>
```

- Un id sort → sa puce est celle qui porte `<!--t:id-->` dans [PLAN.md](../../../PLAN.md).
- Rien ne sort (session lancée à la main) → demander de quelle tâche il s'agit, et attendre.

## 2. Lire la tâche entière

La puce, ses lignes de continuation, et la portée qui la tient — le `##` de la page et le `###` du
groupe. La portée dit de quel écran on parle ; la lire évite de concevoir à côté.

## 3. Rendre l'état des lieux

Lire le code concerné avant de proposer quoi que ce soit — un design repose sur des prémisses, et
une prémisse se vérifie. Puis, dans cet ordre :

```
ce que demande la tâche : UNE PHRASE

hypothèse 1 : TRÈS COURT RÉSUMÉ - validé
hypothèse 2 : TRÈS COURT RÉSUMÉ - validé

design proposé : QUELQUES LIGNES, les fichiers qui bougent

à tester après implem :
test 1
test 2

go ?
```

Puis s'arrêter. Ni fichier créé, ni fichier édité tant qu'elle n'a pas répondu.

## 4. Demander si le cadrage convient — les 5 premières fois

Ce prompt d'ouverture est neuf. Tant que le compteur est sous 5, finir par une question sur le
skill lui-même : est-ce que ce cadrage lui convient, qu'est-ce qui manque ou qui est de trop. Sa
réponse se consigne ici même, dans ce fichier.

```sh
python3 -c "
import json
store = json.load(open('.claude/plan-sessions.json'))
runs = store.setdefault('startTaskRuns', 0) + 1
store['startTaskRuns'] = runs
json.dump(store, open('.claude/plan-sessions.json', 'w'), indent=2, ensure_ascii=False)
print(runs)"
```

Le compteur atteint 5 → ne plus poser la question, et le dire une dernière fois.
