const UNSET_ATTRACTION_TYPE = { label: 'Non renseigné', emoji: '❔', color: '#B4AFA6' };

const ATTRACTION_TYPES = {
  nature: { label: 'Nature', emoji: '🌿', color: '#7C8B5E' },
  heritage: { label: 'Patrimoine', emoji: '🏛️', color: '#A6462E' },
  museum: { label: 'Musée', emoji: '🖼️', color: '#3E6259' },
  village: { label: 'Village', emoji: '🏘️', color: '#C98A3E' },
  beach: { label: 'Plage', emoji: '🏖️', color: '#4E7A9B' },
  activity: { label: 'Activité', emoji: '🎟️', color: '#8B5E7C' },
};

function attractionType(type) {
  return ATTRACTION_TYPES[type] || UNSET_ATTRACTION_TYPE;
}

function attractionTypeKey(type) {
  return ATTRACTION_TYPES[type] ? type : '';
}
