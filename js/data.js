const DEFAULT_ACCOMMODATION_TYPE = 'hotel';

const ACCOMMODATION_TYPES = {
  hotel: {
    label: 'Hôtel',
    short: 'Hôtel',
    emoji: '🏨',
    color: '#A6462E',
    tagClass: 'tag-hotel',
    aliases: ['hotel', 'hôtel'],
  },
  homeExchange: {
    label: 'Home exchange',
    short: 'HE',
    emoji: '🔁',
    color: '#7C8B5E',
    tagClass: 'tag-home',
    aliases: ['home', 'exchange', 'échange'],
  },
  house: {
    label: 'Maison',
    short: 'Maison',
    emoji: '🏡',
    color: '#3E6259',
    tagClass: 'tag-house',
    aliases: ['maison', 'house'],
  },
};

function accType(type) {
  return ACCOMMODATION_TYPES[type] || ACCOMMODATION_TYPES[DEFAULT_ACCOMMODATION_TYPE];
}

function accTypeFromText(text) {
  const lower = (text || '').toLowerCase();
  const found = Object.keys(ACCOMMODATION_TYPES).find((key) =>
    accType(key).aliases.some((a) => lower.includes(a)),
  );
  return found || DEFAULT_ACCOMMODATION_TYPE;
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

let state = null;
let view = 'hebergements'; // hebergements | voitures | charges | scenarios | scenario-detail | carte
let listViewMode = { hebergements: 'table', voitures: 'table', charges: 'table' };
let listFilters = { favOnly: false };
let activeScenarioId = null;
let modal = null; // {type, payload}
let mapFilters = {
  types: new Set(Object.keys(ACCOMMODATION_TYPES)),
  regions: new Set(),
  scenarioId: null,
  favOnly: false,
};
let leafletMap = null;
const LOCAL_KEY = 'voyage-toscane-local-data';
