const DEFAULT_ACCOMMODATION_TYPE = 'hotel';

const MAX_STEP_NIGHTS = 14;
const NIGHTS_OPTIONS = Array.from({ length: MAX_STEP_NIGHTS + 1 }, (_, n) => n);

const ACCOMMODATION_TYPES = {
  homeExchange: {
    label: 'Home exchange',
    emoji: '🔁',
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
    emoji: '🏡',
    color: '#3E6259',
    aliases: ['maison', 'house'],
  },
};

const DEFAULT_ACCOMMODATION_STATUS = 'toCheck';

const ACCOMMODATION_STATUSES = {
  booked: { label: 'Réservé', emoji: '🔒' },
  contacted: { label: 'Contacté', emoji: '✉️' },
  awaitingReply: { label: 'Attente réponse', emoji: '⏳' },
  toBook: { label: 'À booker', emoji: '💳' },
  go: { label: 'Go', emoji: '✅' },
  interested: { label: 'Intéressé', emoji: '👍' },
  toCheck: { label: 'À voir', emoji: '👀' },
  notAvailable: { label: 'Pas dispo', emoji: '🚫' },
  rejected: { label: 'Écarté', emoji: '👎' },
};

function accType(type) {
  return ACCOMMODATION_TYPES[type] || ACCOMMODATION_TYPES[DEFAULT_ACCOMMODATION_TYPE];
}

function accStatus(status) {
  return ACCOMMODATION_STATUSES[status] || ACCOMMODATION_STATUSES[DEFAULT_ACCOMMODATION_STATUS];
}

function accStatusKey(status) {
  return ACCOMMODATION_STATUSES[status] ? status : DEFAULT_ACCOMMODATION_STATUS;
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

function accStatusFromText(text) {
  const wanted = (text || '').trim().toLowerCase();
  if (!wanted) return DEFAULT_ACCOMMODATION_STATUS;
  const found = Object.keys(ACCOMMODATION_STATUSES).find(
    (key) => key.toLowerCase() === wanted || accStatus(key).label.toLowerCase() === wanted,
  );
  return found || DEFAULT_ACCOMMODATION_STATUS;
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

let state = null;
let view = 'hebergements'; // hebergements | voitures | charges | scenarios | scenario-detail | carte | notes
let listViewMode = { hebergements: 'table', voitures: 'table', charges: 'table' };
let listFilters = { favOnly: false, tags: [] };
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
