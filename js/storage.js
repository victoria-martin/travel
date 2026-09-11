/*
  Le Google Sheet (voir js/sync.js) est la seule source de données : rien n'est embarqué
  dans l'app. localStorage sert de cache local, pour travailler hors ligne entre deux synchros.
*/

const LOCAL_KEY = 'voyage-toscane-local-data';

const TRAVEL_COLLECTIONS = [
  'accommodations',
  'cars',
  'fixedCosts',
  'cities',
  'scenarios',
  'tripNotes',
];

function emptyData() {
  return {
    travels: [],
    accommodations: [],
    cars: [],
    fixedCosts: [],
    cities: [],
    scenarios: [],
    tripNotes: [],
  };
}

function loadData() {
  loadPrefs();
  state = migrateData(readStore(LOCAL_KEY) || emptyData());
  render();
}

/*
  Before addresses, `region` was typed by hand and held province-level values ("Sienne",
  "Florence") — the same granularity the map filter now reads from `county`.
*/
function migrateData(data) {
  if (!data.travels) data.travels = [];
  if (!data.cities) data.cities = [];
  if (!data.tripNotes) data.tripNotes = [];
  (data.accommodations || []).forEach((a) => {
    unshiftAccommodation(a);
    if (!a.status) a.status = DEFAULT_ACCOMMODATION_STATUS;
    if (a.address === undefined) a.address = '';
    if (a.geoAddress === undefined) a.geoAddress = a.address;
    if (a.county === undefined) {
      a.county = a.region || '';
      a.region = '';
    }
    if (!Array.isArray(a.tags)) a.tags = [];
  });
  (data.scenarios || []).forEach((s) => {
    if (s.startDate === undefined) s.startDate = '';
    if (s.carId === undefined) s.carId = null;
    if (!Array.isArray(s.costIds)) s.costIds = [];
    if (s.favorite === undefined) s.favorite = false;
  });
  data.cities.forEach((c) => {
    if (c.geoAddress === undefined) {
      c.geoAddress = c.address || '';
      delete c.address;
    }
  });
  attachOrphansToFirstTravel(data);
  return data;
}

/*
  Two ways an entry ends up unreachable: it predates the Voyage entity and carries no travelId,
  or it names a travel the data no longer holds. Both are adopted by the first travel — but a
  dangling one only by a travel that already exists, never by one invented here: a pull that
  came back without its travels would otherwise overwrite a real link with a brand new id.
*/
function attachOrphansToFirstTravel(data) {
  const known = new Set(data.travels.map((t) => t.id));
  const pick = (isOrphan) =>
    TRAVEL_COLLECTIONS.flatMap((name) => (data[name] || []).filter(isOrphan));

  const unattached = pick((item) => !item.travelId);
  if (unattached.length && !data.travels.length) data.travels.push(firstTravel());
  const first = data.travels[0];
  if (!first) return;

  const dangling = known.size ? pick((item) => item.travelId && !known.has(item.travelId)) : [];
  [...unattached, ...dangling].forEach((item) => {
    item.travelId = first.id;
  });
}

function firstTravel() {
  return {
    id: uid(),
    name: 'Voyage Toscane',
    emoji: '🌿',
    image: '',
    description: '',
    status: DEFAULT_TRAVEL_STATUS,
    startDate: '',
    endDate: '',
    country: 'Italie',
    region: 'Toscane',
    accentColor: '',
    travelers: 0,
  };
}

/*
  The Sheet backend used to map cells by column index. Inserting city, county and region
  pushed every pre-existing row three columns to the left, so `dates` ended up holding the
  old `favorite` boolean — the marker used here to recognize a shifted row.
*/
function unshiftAccommodation(a) {
  const shifted =
    a.dates === true || a.dates === false || a.dates === 'true' || a.dates === 'false';
  if (!shifted) return;
  const shiftedRow = { ...a };
  a.lat = shiftedRow.city;
  a.lng = shiftedRow.county;
  a.price = shiftedRow.region;
  a.dates = shiftedRow.lat;
  a.link = shiftedRow.lng;
  a.notes = shiftedRow.price;
  a.favorite = shiftedRow.dates === true || shiftedRow.dates === 'true';
  a.city = '';
  a.county = '';
  a.region = '';
  a.bookingLink = '';
  if (!a.geoAddress) a.geoAddress = a.address || '';
}

function saveNow() {
  persistState();
  schedulePush();
}

function persistState() {
  writeStore(LOCAL_KEY, state);
}
