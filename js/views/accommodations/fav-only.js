/*
  Le favori se coche d'un bouton de la barre et non d'un niveau du panneau : c'est un geste qu'on
  fait vingt fois, pas un axe qu'on compose. Il vaut pour la liste ouverte, donc une globale.
*/
let favOnly = false;

function toggleFavOnly() {
  favOnly = !favOnly;
  render();
}

function keptByFavOnly(a) {
  return !favOnly || a.favorite;
}
