const UNSET_ATTRACTION_TYPE = { label: 'Non renseigné', emoji: '❔', color: '#B4AFA6' };

const ATTRACTION_TYPES = {
  nature: { label: 'Nature', emoji: '🌿', color: '#7C8B5E' },
  heritage: { label: 'Patrimoine', emoji: '🏛️', color: '#A6462E' },
  museum: { label: 'Musée', emoji: '🖼️', color: '#3E6259' },
  city: { label: 'Ville', emoji: '🏙️', color: '#5F6B72' },
  village: { label: 'Village', emoji: '🏘️', color: '#C98A3E' },
  beach: { label: 'Plage', emoji: '🏖️', color: '#4E7A9B' },
  activity: { label: 'Activité', emoji: '🎟️', color: '#8B5E7C' },
  restaurant: { label: 'Restaurant', emoji: '🍝', color: '#7A5C3E' },
};


const ATTRACTION_TYPES_SIMPLE = {
  nature: { label: 'Nature'  },
  heritage: { label: 'Patrimoine'  },
  museum: { label: 'Musée'  },
  city: { label: 'Ville'  },
  village: { label: 'Village'  },
  beach: { label: 'Plage'  },
  activity: { label: 'Activité'  },
  restaurant: { label: 'Restaurant'  },
};

function attractionType(type) {
  return ATTRACTION_TYPES[type] || UNSET_ATTRACTION_TYPE;
}

function attractionTypeKey(type) {
  return ATTRACTION_TYPES[type] ? type : '';
}
