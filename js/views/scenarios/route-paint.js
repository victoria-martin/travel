/*
  Les quatre façons de peindre l'échelle, le temps de choisir celle qui se lit le mieux. Deux
  leviers : une texture sur les statuts qui attendent un geste, et deux teintes tirées vers le
  contraste — l'or de « à réserver » brille seul dès que « à l'étude » recule vers le taupe. La
  variante est une préférence d'affichage, elle vaut pour la bande de la liste comme pour le fil.
*/
const MUTED_COMPARING = '#9C8F7A';

const ROUTE_PAINTS = {
  base: { label: 'Couleurs d’origine' },
  stripes: { label: 'Rayures sur ce qui attend un geste', stripes: true },
  stripesMuted: {
    label: 'Rayures, « à l’étude » en taupe',
    stripes: true,
    colors: { comparing: MUTED_COMPARING },
  },
  brightAction: {
    label: 'Or vif, « à l’étude » en taupe',
    colors: { toBook: '#F0A500', comparing: MUTED_COMPARING },
  },
};

function routePaint() {
  return ROUTE_PAINTS[prefs.routePaint] || ROUTE_PAINTS.stripesMuted;
}

function setRoutePaint(key) {
  prefs.routePaint = key;
  persistPrefs();
  render();
}

// Le fond d'un segment : sa couleur, rayée quand la variante marque les gestes à faire.
function stepStatusBackground(key) {
  const paint = routePaint();
  const color = (paint.colors && paint.colors[key]) || stepStatusInfo(key).color;
  if (!paint.stripes || !stepStatusInfo(key).action) return color;
  return `repeating-linear-gradient(45deg, ${color} 0 3px, rgba(255,255,255,0.5) 3px 6px)`;
}

function routePaintOptions() {
  return /* HTML */ `<div class="filter-block">
    <p class="filter-title">Bande d’itinéraire</p>
    ${Object.entries(ROUTE_PAINTS)
      .map(
        ([key, paint]) =>
          /* HTML */ `<label class="filter-option">
            <input
              type="radio"
              name="route-paint"
              ${routePaint() === paint ? 'checked' : ''}
              onchange="setRoutePaint('${key}')"
            />
            ${paint.label}
          </label>`,
      )
      .join('')}
  </div>`;
}
