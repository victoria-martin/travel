/*
  Le Google Sheet (voir js/sync.js) est la seule source de données : rien n'est embarqué
  dans l'app. localStorage sert de cache local, pour travailler hors ligne entre deux synchros.
*/

const LOCAL_KEY = 'voyage-toscane-local-data';

const TRAVEL_COLLECTIONS = [
  'accommodations',
  'providers',
  'carModels',
  'rentals',
  'cars',
  'fixedCosts',
  'cities',
  'attractions',
  'transports',
  'scenarios',
  'tripNotes',
  'todoLists',
];

function emptyData() {
  return {
    travels: [],
    accommodations: [],
    providers: [],
    carModels: [],
    rentals: [],
    cars: [],
    fixedCosts: [],
    cities: [],
    attractions: [],
    transports: [],
    scenarios: [],
    tripNotes: [],
    todoLists: [],
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
  if (!data.providers) data.providers = [];
  if (!data.rentals) data.rentals = [];
  if (!data.carModels) data.carModels = [];
  if (!data.cities) data.cities = [];
  if (!data.attractions) data.attractions = [];
  if (!data.transports) data.transports = [];
  if (!data.tripNotes) data.tripNotes = [];
  if (!data.todoLists) data.todoLists = [];
  data.todoLists.forEach((l) => {
    if (!Array.isArray(l.filterValues)) l.filterValues = [];
  });
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
  (data.fixedCosts || []).forEach((c) => {
    if (!Array.isArray(c.categories)) c.categories = c.category ? [c.category] : [];
    delete c.category;
  });
  adoptProviders(data);
  (data.cars || []).forEach((c) => {
    if (c.pricePerDay === undefined) c.pricePerDay = c.price || '';
    if (c.priceTotal === undefined) c.priceTotal = '';
    if (!Array.isArray(c.optionIds)) c.optionIds = [];
    delete c.price;
  });
  adoptRentals(data);
  adoptCarModels(data);
  // La page Voitures est devenue Locations : une liste enregistrée la désigne par sa clé.
  (data.todoLists || []).forEach((list) => {
    if (list.kind === 'voitures') list.kind = 'locations';
  });
  (data.scenarios || []).forEach((s) => {
    if (s.startDate === undefined) s.startDate = '';
    if (s.carId === undefined) s.carId = null;
    if (!Array.isArray(s.costIds)) s.costIds = [];
    if (!Array.isArray(s.transportIds)) s.transportIds = [];
    if (s.favorite === undefined) s.favorite = false;
    adoptScenarioSteps(s);
  });
  data.cities.forEach((c) => {
    adoptPlace(c);
    if (!c.city) c.city = c.name || '';
  });
  return data;
}

/*
  Le loueur d'une voiture et la compagnie d'un trajet étaient deux textes libres, recopiés d'une
  ligne à l'autre ; ils deviennent une entrée de `providers` que les deux référencent. L'identifiant
  se dérive du voyage, du mode et du nom : un `uid()` neuf donnerait deux résultats différents des
  deux côtés de la synchro, donc un conflit à chaque envoi. La voiture d'un trajet porte déjà son
  loueur, le texte du trajet ne fait alors que disparaître.
*/
function providerIdFromName(travelId, mode, name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `provider-${travelId}-${mode}-${slug}`;
}

function adoptProviders(data) {
  const known = new Set(data.providers.map((p) => p.id));
  const adopt = (item, typed, mode) => {
    const name = (typed || '').trim();
    if (item.providerId || !name) return;
    const id = providerIdFromName(item.travelId, mode, name);
    if (!known.has(id)) {
      known.add(id);
      data.providers.push({ ...emptyProvider(), id, travelId: item.travelId, mode, name });
    }
    item.providerId = id;
  };
  (data.cars || []).forEach((car) => {
    adopt(car, car.name, 'car');
    delete car.name;
  });
  (data.transports || []).forEach((t) => {
    if (t.mode !== 'car') adopt(t, t.carrier, t.mode);
    delete t.carrier;
  });
  data.providers.forEach((p) => {
    if (!Array.isArray(p.options)) p.options = [];
  });
}

/*
  Le lieu et les dates d'une location vivaient sur chaque véhicule, recopiés d'une ligne à l'autre :
  ils deviennent une entrée de `rentals` que les véhicules d'une même recherche partagent. Comme
  pour les prestataires, l'identifiant se dérive de ce qui la distingue — un `uid()` neuf ferait
  diverger les deux côtés de la synchro. Les dates d'avant étaient un texte libre qu'aucune date
  réelle ne peut reprendre : elles rejoignent les notes de la location, et le prix par jour reste
  sur le véhicule comme seul chiffre connu tant qu'aucun total n'est saisi.
*/
function rentalIdFromCar(car) {
  const slug = [car.providerId, car.location, car.dates]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `rental-${car.travelId}-${slug}`;
}

function adoptRentals(data) {
  const known = new Set(data.rentals.map((r) => r.id));
  (data.cars || []).forEach((car) => {
    if (car.rentalId === undefined) car.rentalId = '';
    if (car.rentalId || (!car.providerId && !car.location && !car.dates)) return cleanCar(car);
    const id = rentalIdFromCar(car);
    if (!known.has(id)) {
      known.add(id);
      data.rentals.push({
        ...emptyRental(),
        id,
        travelId: car.travelId,
        providerId: car.providerId || '',
        location: car.location || '',
        notes: car.dates || '',
      });
    }
    car.rentalId = id;
    cleanCar(car);
  });
}

function cleanCar(car) {
  delete car.providerId;
  delete car.location;
  delete car.dates;
}

/*
  Le modèle d'un véhicule était un texte tapé sur sa ligne, puis une entrée du catalogue de son
  loueur : il devient une entrée du voyage, pour que la même Golf relevée chez deux loueurs soit
  une seule voiture qu'on compare. L'identifiant se dérive du nom — les deux côtés de la synchro
  doivent en trouver le même — ce qui fusionne du même coup les modèles homonymes des catalogues
  de loueurs.
*/
function carModelIdFromName(travelId, name) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `model-${travelId}-${slug}`;
}

function adoptCarModel(data, travelId, name, fuel, gearbox) {
  const id = carModelIdFromName(travelId, name);
  const known = data.carModels.find((m) => m.id === id);
  if (known) {
    known.fuel = known.fuel || fuel || '';
    known.gearbox = known.gearbox || gearbox || '';
    return id;
  }
  data.carModels.push({ id, travelId, name, fuel: fuel || '', gearbox: gearbox || '' });
  return id;
}

function adoptCarModels(data) {
  const fromProviders = {};
  data.providers.forEach((provider) => {
    (provider.models || []).forEach((model) => {
      fromProviders[model.id] = adoptCarModel(
        data,
        provider.travelId,
        model.name,
        model.fuel,
        model.gearbox,
      );
    });
    delete provider.models;
  });
  (data.cars || []).forEach((car) => {
    if (car.modelId === undefined) car.modelId = '';
    if (fromProviders[car.modelId]) car.modelId = fromProviders[car.modelId];
    else if (!car.modelId && car.model)
      car.modelId = adoptCarModel(data, car.travelId, car.model, car.fuel, car.gearbox);
    car.model = '';
    cleanVehicleWords(car);
  });
}

function cleanVehicleWords(car) {
  delete car.fuel;
  delete car.gearbox;
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
  Avant les colonnes, les variantes d'une étape vivaient dans ses options. Chaque option devient une
  étape à elle, rangée dans une colonne du groupe qui remplace l'étape ; la colonne et l'étape
  portent l'identifiant de l'option, et le groupe celui de l'étape suffixé. La reprise se rejoue à
  chaque lecture des deux côtés de la synchro : un `uid()` neuf donnerait deux résultats différents
  et ferait diverger l'empreinte du Sheet, donc un conflit à chaque envoi. Les lignes de l'étape,
  communes à toutes ses options, deviennent celles du groupe.
*/
function adoptScenarioSteps(scenario) {
  scenario.steps = (scenario.steps || []).flatMap(explodeStepOptions.bind(null, scenario));
  scenario.steps.forEach(adoptStep);
  scenarioGroups(scenario).forEach((group) => group.extras.forEach(adoptExtraLine));
}

function explodeStepOptions(scenario, step) {
  const options = step.options;
  delete step.options;
  if (!Array.isArray(options) || options.length === 0) return [step];
  const lines = Array.isArray(step.extras) ? step.extras : [];
  if (options.length === 1) return [{ ...step, ...optionFields(options[0]), extras: lines }];
  const group = {
    id: `${step.id}-groupe`,
    options: options.map((o) => ({ id: o.id, name: o.name || '', isSelected: !!o.isSelected })),
    extras: lines.filter((line) => !line.optionId).map(withoutOptionId),
  };
  scenarioGroups(scenario).push(group);
  return options.map((option) => ({
    ...step,
    ...optionFields(option),
    id: option.id,
    groupId: group.id,
    optionId: option.id,
    extras: lines.filter((line) => line.optionId === option.id).map(withoutOptionId),
  }));
}

function optionFields(option) {
  return {
    cityId: option.cityId || null,
    accommodationId: option.accommodationId || null,
    accommodationType: option.accommodationType || '',
    nights: parseInt(option.nights) || 0,
    budget: option.budget || '',
  };
}

function withoutOptionId(line) {
  const { optionId, ...rest } = line;
  return rest;
}

/*
  Les activités d'une étape sont devenues ses lignes — activités et dépenses mêlées. Une ligne
  d'avant n'avait pas d'identifiant : elle en gagne un, sans quoi le Sheet lui en inventerait un
  neuf à chaque lecture.
*/
function adoptStep(step) {
  if (step.city) step.name = step.name || step.city;
  delete step.city;
  delete step.region;
  if (Array.isArray(step.attractions)) step.extras = step.attractions;
  delete step.attractions;
  if (!Array.isArray(step.extras)) step.extras = [];
  step.extras.forEach(adoptExtraLine);
  if (step.groupId === undefined) step.groupId = '';
  if (step.optionId === undefined) step.optionId = '';
  if (step.accommodationType === undefined) step.accommodationType = '';
  if (step.cityId === undefined) step.cityId = null;
  if (step.accommodationId === undefined) step.accommodationId = null;
  if (step.nights === undefined) step.nights = 0;
  if (step.budget === undefined) step.budget = '';
}

function adoptExtraLine(line) {
  if (!line.id) line.id = uid();
  delete line.optionId;
  if (line.attractionId === undefined) line.attractionId = '';
  if (line.costId === undefined) line.costId = '';
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
