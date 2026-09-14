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
  'attractions',
  'transports',
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
    attractions: [],
    transports: [],
    scenarios: [],
    tripNotes: [],
  };
}

function loadData() {
  loadPrefs();
  state = migrateData(readStore(LOCAL_KEY) || emptyData());
  selectTestScenario();
  applyRoute();
  render();
}

/*
  Before addresses, `region` was typed by hand and held province-level values ("Sienne",
  "Florence") — the same granularity the map filter now reads from `county`.
*/
function migrateData(data) {
  if (!data.travels) data.travels = [];
  if (!data.cities) data.cities = [];
  if (!data.attractions) data.attractions = [];
  if (!data.transports) data.transports = [];
  if (!data.tripNotes) data.tripNotes = [];
  (data.accommodations || []).forEach((a) => {
    unshiftAccommodation(a);
    adoptPlace(a);
    if (a.county === undefined) {
      a.county = a.region || '';
      a.region = '';
    }
    if (!Array.isArray(a.tags)) a.tags = [];
  });
  data.attractions.forEach((a) => {
    adoptPlace(a);
    if (!Array.isArray(a.tags)) a.tags = [];
    if (a.favorite === undefined) a.favorite = false;
  });
  (data.cars || []).forEach((c) => {
    if (c.pricePerDay === undefined) c.pricePerDay = c.price || '';
    if (c.priceTotal === undefined) c.priceTotal = '';
    delete c.price;
  });
  (data.scenarios || []).forEach((s) => {
    if (s.startDate === undefined) s.startDate = '';
    if (s.carId === undefined) s.carId = null;
    if (!Array.isArray(s.costIds)) s.costIds = [];
    if (!Array.isArray(s.transportIds)) s.transportIds = [];
    if (s.favorite === undefined) s.favorite = false;
    (s.steps || []).forEach(adoptLegacyStep);
  });
  data.cities.forEach((c) => {
    adoptPlace(c);
    if (!c.city) c.city = c.name || '';
  });
  return data;
}

/*
  Une adresse libre et une adresse à géocoder faisaient deux champs pour la même chose, et le pays
  manquait au-dessus de la région. Le nom retenu est `address` : `geoAddress` nommait le mécanisme.
*/
function adoptPlace(place) {
  place.address = place.address || place.geoAddress || '';
  delete place.geoAddress;
  PLACE_LEVEL_KEYS.forEach((key) => {
    if (place[key] === undefined) place[key] = '';
  });
}

/*
  Avant les options, le lieu, les nuits et le budget vivaient sur l'étape ; ils deviennent sa
  première option. Les activités d'une étape, elles, sont devenues ses lignes — activités et
  dépenses mêlées, chacune rattachée à l'étape ou à l'une de ses options. Une ligne d'avant n'avait
  pas d'identifiant : elle en gagne un, sans quoi le Sheet lui en inventerait un neuf à chaque
  lecture.
  L'option de reprise porte l'identifiant de son étape, et jamais un `uid()` neuf : la reprise se
  rejoue à chaque lecture des deux côtés, et deux résultats différents feraient diverger l'empreinte
  du Sheet à chaque appel — donc un conflit à chaque envoi.
*/
function adoptLegacyStep(step) {
  if (step.city) step.name = step.name || step.city;
  delete step.city;
  delete step.region;
  if (Array.isArray(step.attractions)) step.extras = step.attractions;
  delete step.attractions;
  if (!Array.isArray(step.extras)) step.extras = [];
  step.extras.forEach((line) => {
    if (!line.id) line.id = uid();
    if (line.optionId === undefined) line.optionId = '';
    if (line.attractionId === undefined) line.attractionId = '';
    if (line.costId === undefined) line.costId = '';
  });
  if (!Array.isArray(step.options) || step.options.length === 0)
    step.options = [
      {
        id: step.id,
        name: '',
        cityId: step.cityId || null,
        accommodationId: step.accommodationId || null,
        nights: step.nights || 0,
        budget: step.budget || '',
        isSelected: true,
      },
    ];
  delete step.nights;
  delete step.cityId;
  delete step.accommodationId;
  delete step.budget;
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
}

function saveNow() {
  persistState();
  schedulePush();
}

function persistState() {
  writeStore(LOCAL_KEY, state);
}
