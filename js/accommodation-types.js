const DEFAULT_ACCOMMODATION_TYPE = 'hotel';

const ACCOMMODATION_TYPES = {
  homeExchange: {
    label: 'Home exchange',
    emoji: '🏡',
    color: '#7C8B5E',
    aliases: ['home', 'exchange', 'échange'],
  },
  hotel: {
    label: 'Hôtel',
    emoji: '🏨',
    color: '#A6462E',
    aliases: ['hotel', 'hôtel'],
  },
  house: {
    label: 'Maison',
    emoji: '🏠',
    color: '#3E6259',
    aliases: ['maison', 'house'],
  },
  // camping: {
  //   label: 'Camping',
  //   emoji: '⛺​',
  //   color: '#8B4513',
  //   aliases: ['camping', 'camp', 'tent'],
  // },
};

function accType(type) {
  return ACCOMMODATION_TYPES[type] || ACCOMMODATION_TYPES[DEFAULT_ACCOMMODATION_TYPE];
}

function accTypeKey(type) {
  return ACCOMMODATION_TYPES[type] ? type : DEFAULT_ACCOMMODATION_TYPE;
}

function accTypeFromText(text) {
  const lower = (text || '').toLowerCase();
  const found = Object.keys(ACCOMMODATION_TYPES).find((key) =>
    accType(key).aliases.some((a) => lower.includes(a)),
  );
  return found || DEFAULT_ACCOMMODATION_TYPE;
}
