/*
  The travel colour replaces the two structural greens of the theme — sidebar, buttons, active
  states — so the open travel is obvious at a glance. The darker shade is computed, so a travel
  stores a single colour.
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
