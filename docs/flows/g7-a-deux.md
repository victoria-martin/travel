# G7 — Travailler à deux

> Que l'autre voie mes saisies sans rien installer.

Transverse : porte tous les autres objectifs, n'a d'écran qu'une modale.

## Flow

```
⚙︎ Synchro → coller l'URL du Sheet → connecté
  → toute écriture part au Sheet en quelques secondes
  → deux entrées différentes éditées en même temps : les deux sont gardées
  → la même entrée : la dernière personne qui enregistre gagne
  → se déconnecter garde l'adresse en suggestion, pour se reconnecter sans la recoller
```

Voie parallèle, assumée : **le Sheet reste éditable à la main** comme un tableur — un onglet par
table, une ligne par entrée. Ne pas toucher aux colonnes `id` ni aux en-têtes.

## Écrans

La modale de synchro, et l'état de connexion en pied de barre latérale. C'est tout.

## Données exigées par ce flow

- **`travelId` en première colonne de chaque onglet**, y compris `steps` où il est recopié depuis le
  scénario parent — pour trier et filtrer le Sheet d'un coup d'œil.
- **La partition données / préférences.** Voyage ouvert, colonnes masquées, tri, panneaux ouverts,
  carte dépliée, libellés des boutons : propres à chaque navigateur, jamais partagés. Tout le reste
  part au Sheet.

Deux contraintes que la synchro impose au reste du modèle :

- **Une reprise de format ne fabrique jamais d'identifiant neuf.** Elle se rejoue à chaque lecture,
  des deux côtés : l'option reconstituée d'une étape d'avant les options porte l'identifiant de son
  étape. La synchro comparant des **empreintes d'état**, un identifiant tiré au hasard ferait
  refuser tout envoi en conflit, indéfiniment.
- **Aucune reprise des entrées orphelines.** Une entrée sans `travelId`, ou avec un `travelId`
  inconnu, n'apparaît dans aucun voyage. L'app n'invente jamais de voyage pour les accueillir —
  sinon une réponse incomplète du Sheet créerait un voyage fantôme qui repartirait dans la synchro.

L'app démarre vide et **marche sans synchro** : le `localStorage` tient l'état complet, la connexion
peut arriver plus tard.

## Ouvert

Rien de structurant. Le [protocole détaillé](../protocole-sync-sheet.md) tient les cas de conflit.
