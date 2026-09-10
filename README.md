# Voyage Toscane — app de préparation de voyage

## Déployer sur GitHub Pages (une fois)

1. Va sur [github.com/new](https://github.com/new) et crée un repo (ex: `voyage-toscane`). Peut être privé ou public.
2. Ajoute les 2 fichiers de ce dossier à la racine du repo : `index.html` et `data.json`.
   - Via l'interface web GitHub : bouton "Add file" → "Upload files", glisse les deux fichiers, commit.
3. Va dans **Settings** (du repo) → **Pages** (menu de gauche).
4. Sous "Build and deployment" → Source : **Deploy from a branch**. Branch : **main**, dossier : **/ (root)**. Sauvegarde.
5. Attends 1–2 minutes, puis ton site est en ligne à :
   `https://TON-PSEUDO-GITHUB.github.io/voyage-toscane/`

Envoie ce lien à qui tu veux.

## Comment ça marche

- **`data.json`** = ta base de données (hébergements, voitures, charges, scénarios). C'est le fichier "officiel", celui que tout le monde voit en ouvrant le site pour la première fois.
- Quand tu utilises l'app dans ton navigateur, tes modifications sont sauvegardées **automatiquement dans ce navigateur** (localStorage) — pratique pour ne rien perdre en travaillant, mais **ça ne modifie pas encore `data.json` sur GitHub**, et ça ne se voit pas depuis un autre appareil ou par quelqu'un d'autre.
- Pour rendre tes changements "officiels" et visibles par tout le monde : clique sur **"📥 Exporter data.json"** dans la barre latérale de l'app, ça télécharge le fichier à jour → remplace l'ancien `data.json` dans ton repo GitHub (upload + commit) → le site se met à jour en 1–2 minutes.
- **"↺ Revenir à data.json"** : efface tes modifs locales non exportées et recharge la version officielle du fichier.
- **"📤 Importer un data.json"** : charge un fichier `data.json` que tu as ailleurs (ex: récupéré depuis GitHub, ou modifié à la main).

## Éditer `data.json` directement

C'est un fichier texte JSON classique — éditable :

- Directement dans GitHub (clique sur le fichier → crayon "Edit")
- Dans VS Code, Notepad++, etc.
- En le convertissant en tableau (voir ci-dessous)

## Convertir en Excel / CSV si tu préfères éditer en tableur

Le plus simple : utilise le bouton **"📋 Importer depuis un tableau"** dans l'app (colle tes lignes copiées depuis Excel/Sheets), ça alimente directement `data.json` sans conversion manuelle.

## Travailler à plusieurs en même temps

Cette version ne synchronise pas en temps réel entre plusieurs personnes (chacun a ses modifs locales tant que `data.json` n'est pas réexporté et recommité). Si tu veux du vrai temps réel partagé (ex: toi et quelqu'un d'autre modifient en même temps et voient les changements de l'autre), il faut un petit backend en plus (Google Sheets connecté via script, Firebase, Supabase...) — possible, mais c'est un chantier à part. Demande si tu veux que je le mette en place.
