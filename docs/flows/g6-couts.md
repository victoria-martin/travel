# G6 — Savoir ce que le voyage coûte

> Un total qui agrège ce qui est réservé.

Lit ce que [G5](g5-decider.md) a figé. À ne pas confondre avec [G4](g4-comparer.md) : comparer,
c'est chiffrer des **hypothèses** ; ici on chiffre ce qui est **décidé**.

## Flow

```
Dépenses
  ├─ Calculé — lu ailleurs, jamais édité ici
  │     Hébergements réservés 🔒 · Voiture par défaut ◉ · Transports réservés 🔒 · À faire Go ✅
  │     → le titre du groupe mène à la page où corriger
  └─ Saisi — les charges fixes, qui n'ont pas d'autre page
        → ajouter / modifier en modale, supprimer confirmé, tri et colonnes configurables
  → récap : les deux sous-totaux et leur somme
```

**Une dépense se corrige à sa source.** D'où les deux blocs plutôt qu'une liste unique où l'origine
d'une ligne serait invisible.

Un montant qui n'est pas ferme reste **hors du total** et s'affiche tel quel : « 120 € / nuit »
garde son unité tant que rien ne dit sur combien le multiplier, et une fourchette dont les bornes
diffèrent s'affiche en fourchette. Une source sans aucune ligne ne s'affiche pas.

## Écrans

**Dépenses** 💶, en deux blocs et un récap. Le bloc Saisi est une liste ordinaire (tableau ou
cartes), le bloc Calculé n'est éditable nulle part.

## Données exigées par ce flow

- **Charge fixe** — libellé, montant, catégorie, récurrence, notes. La seule entité que ce flow
  fait naître, et elle existe **parce qu'elle n'a pas d'autre page**.
- Tout le reste est lu : le prix des hébergements réservés, de la voiture par défaut, des transports
  réservés, des attractions validées.

Un montant est ferme s'il a une seule borne, deux bornes égales, ou un budget à défaut. **Budget et
prix** sont deux notions distinctes, jamais départagées par un champ `type` : le budget est
l'enveloppe qu'on se donne, le prix est la fourchette `mini`/`maxi` de ce que ça coûte vraiment, et
la fourchette gagne dès qu'un de ses montants est saisi. Implémenté sur les transports et les
attractions ; les charges, les hébergements et les voitures gardent un champ de prix unique.

## Ouvert

**Ce flow est cassé par construction, et c'est le défaut le plus sérieux de la map.**

La page Dépenses ne connaît **aucun scénario**, donc aucun nombre de nuits. Un hébergement à
120 € / nuit et une voiture à 40 € / jour restent donc hors du total, alors que ce sont les deux
plus gros postes du voyage. Le parcours traverse deux écrans qui ne se parlent pas.

Deux voies, à trancher :

- **G6 lit le scénario choisi** — il porte les nuits et la voiture, et il est déjà l'entité que
  lisent les écrans transverses. Le total devient complet, au prix d'un couplage Dépenses → Scénario.
- **G6 assume de ne totaliser que le ferme** — et dit alors explicitement que les prix unitaires ne
  sont pas comptés, plutôt que de les laisser à l'écran sans être dans la somme.
