/*
  La couleur du voyage remplace les deux verts structurants du thème — barre latérale, boutons,
  états actifs — pour qu'on voie d'un coup d'œil dans quel voyage on est. La nuance foncée se
  calcule, le voyage ne stocke qu'une couleur.
*/
function applyTravelAccent() {
  const travel = currentTravel();
  const color = travel && travel.accentColor;
  const root = document.documentElement.style;
  if (!color) {
    root.removeProperty('--stone');
    root.removeProperty('--stone-dark');
    return;
  }
  root.setProperty('--stone', color);
  root.setProperty('--stone-dark', `color-mix(in srgb, ${color} 76%, #000)`);
}
