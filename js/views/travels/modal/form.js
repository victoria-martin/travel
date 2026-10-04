function emptyTravel() {
  return {
    id: null,
    name: '',
    emoji: '🧳',
    image: '',
    description: '',
    status: DEFAULT_TRAVEL_STATUS,
    startDate: '',
    endDate: '',
    countries: [],
    region: '',
    accentColor: '',
    travelers: 0,
    fuelPrice: '',
    tollRate: '',
  };
}

// body : React (src/domains/travels/modal/TravelModal.tsx, src/modal-bodies.ts).

/*
  The whole card takes the accent: the emoji badge, a tinted paper and border, and the two theme
  greens so the Enregistrer button shows the colour before it is saved.
*/
function paintTravelModal(color) {
  const card = document.querySelector('.overlay .modal');
  const badge = document.getElementById('travel-modal-badge');
  badge.style.background = color ? mixAccent(color, 16, '#fff') : '';
  badge.style.borderColor = color || '';
  card.style.background = color ? mixAccent(color, 10, 'var(--paper-raised)') : '';
  card.style.borderColor = color ? mixAccent(color, 35, 'var(--line)') : '';
  ['--stone', '--stone-dark'].forEach((name) => card.style.removeProperty(name));
  if (!color) return;
  card.style.setProperty('--stone', color);
  card.style.setProperty('--stone-dark', mixAccent(color, 76, '#000'));
}

function mixAccent(color, percent, over) {
  return `color-mix(in srgb, ${color} ${percent}%, ${over})`;
}

