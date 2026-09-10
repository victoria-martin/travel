const DEFAULT_ACCOMMODATION_TYPE = 'hotel';

const MAX_STEP_NIGHTS = 14;
const NIGHTS_OPTIONS = Array.from({ length: MAX_STEP_NIGHTS + 1 }, (_, n) => n);

const ACCOMMODATION_TYPES = {
  hotel: {
    label: 'Hôtel',
    emoji: '🏨',
    color: '#A6462E',
    aliases: ['hotel', 'hôtel'],
  },
  homeExchange: {
    label: 'Home exchange',
    emoji: '🔁',
    color: '#7C8B5E',
    aliases: ['home', 'exchange', 'échange'],
  },
  house: {
    label: 'Maison',
    emoji: '🏡',
    color: '#3E6259',
    aliases: ['maison', 'house'],
  },
};

const DEFAULT_ACCOMMODATION_STATUS = 'toCheck';

const ACCOMMODATION_STATUSES = {
  toCheck: { label: 'À voir', emoji: '👀' },
  contacted: { label: 'Contacté', emoji: '✉️' },
  go: { label: 'Go', emoji: '✅' },
  notAvailable: { label: 'Pas dispo', emoji: '🚫' },
  rejected: { label: 'Écarté', emoji: '👎' },
  booked: { label: 'Réservé', emoji: '🔒' },
};

function accType(type) {
  return ACCOMMODATION_TYPES[type] || ACCOMMODATION_TYPES[DEFAULT_ACCOMMODATION_TYPE];
}

function accStatus(status) {
  return ACCOMMODATION_STATUSES[status] || ACCOMMODATION_STATUSES[DEFAULT_ACCOMMODATION_STATUS];
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
  counties: new Set(),
  scenarioId: null,
  favOnly: false,
};
let leafletMap = null;
let scenarioDetailMap = null;
const LOCAL_KEY = 'voyage-toscane-local-data';
