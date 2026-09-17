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
  'offers',
  'fixedCosts',
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
    offers: [],
    fixedCosts: [],
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
  adoptOfferNames(data);
  absorbCities(data);
  if (!data.travels) data.travels = [];
  if (!data.providers) data.providers = [];
  if (!data.rentals) data.rentals = [];
  if (!data.carModels) data.carModels = [];
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
    if (a.availableFrom === undefined) a.availableFrom = '';
    if (a.availableTo === undefined) a.availableTo = '';
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
  (data.offers || []).forEach((c) => {
    if (c.pricePerDay === undefined) c.pricePerDay = c.price || '';
    if (c.priceTotal === undefined) c.priceTotal = '';
    if (!Array.isArray(c.optionIds)) c.optionIds = [];
    delete c.price;
  });
  adoptRentals(data);
  adoptOfferRentals(data);
  adoptCarModels(data);
  adoptProviderModels(data);
  // La page Voitures est devenue Locations : une liste enregistrée la désigne par sa clé.
  (data.todoLists || []).forEach((list) => {
    if (list.kind === 'voitures') list.kind = 'locations';
  });
  (data.scenarios || []).forEach((s) => {
    if (s.startDate === undefined) s.startDate = '';
    if (s.offerId === undefined) s.offerId = null;
    // Les options d'une voiture se choisissent par scénario ; celles de l'offre en sont le départ.
    if (!Array.isArray(s.offerOptionIds))
      s.offerOptionIds = [
        ...((data.offers || []).find((c) => c.id === s.offerId)?.optionIds || []),
      ];
    if (!Array.isArray(s.costIds)) s.costIds = [];
    if (!Array.isArray(s.transportIds)) s.transportIds = [];
    if (s.favorite === undefined) s.favorite = false;
    adoptScenarioSteps(s);
  });
  return data;
}

/*
  Une ville et une activité sont le même objet — un endroit localisé du voyage —, et l'étape qui
  s'y pose comme la ligne qui l'y ajoute ne diffèrent que par le rôle qu'elles lui donnent. Les
  deux collections n'en font donc plus qu'une, et le type dit ce qu'on a devant soi. La ville garde
  son identifiant : ce qui la référençait le trouve toujours, seul le nom du champ suit. La base de
  synchro passe par ici aussi, sans quoi son instantané resterait à deux collections et chaque
  ville repartirait en ajout.
*/
function absorbCities(data) {
  if (!Array.isArray(data.attractions)) data.attractions = [];
  const known = new Set(data.attractions.map((a) => a.id));
  (data.cities || []).forEach((city) => {
    if (!known.has(city.id)) data.attractions.push(attractionFromCity(city));
  });
  delete data.cities;
  (data.scenarios || []).forEach((s) =>
    (s.steps || []).forEach((step) => renameKey(step, 'cityId', 'attractionId')),
  );
  (data.transports || []).forEach((t) => {
    renameKey(t, 'fromCityId', 'fromAttractionId');
    renameKey(t, 'toCityId', 'toAttractionId');
  });
  // Une liste enregistrée désignait la page par sa clé ; ses valeurs gardées valent sur l'autre.
  (data.todoLists || []).forEach((list) => {
    if (list.kind === 'villes') list.kind = 'attractions';
  });
  return data;
}

/*
  Le statut reste vide plutôt qu'« à trier » : une ville déjà notée n'attend le tri de personne.
  Ses notes deviennent la description, seul champ de texte libre d'une activité.
*/
function attractionFromCity(city) {
  const { notes, ...place } = city;
  return {
    ...emptyAttraction(),
    ...place,
    type: 'city',
    status: '',
    description: notes || '',
    tags: [],
    favorite: false,
  };
}

function renameKey(item, from, to) {
  if (item[from] !== undefined && item[to] === undefined) item[to] = item[from];
  delete item[from];
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
  (data.offers || []).forEach((offer) => {
    adopt(offer, offer.name, 'car');
    delete offer.name;
  });
  (data.transports || []).forEach((t) => {
    if (t.mode !== 'car') adopt(t, t.carrier, t.mode);
    delete t.carrier;
  });
  data.providers.forEach((p) => {
    if (!Array.isArray(p.options)) p.options = [];
    if (!Array.isArray(p.modelIds)) p.modelIds = [];
  });
}

/*
  Quels modèles un loueur propose ne se déduisait que des offres déjà relevées : le menu Modèle
  d'une offre listait donc tout le voyage. Le loueur porte désormais ses modèles, et ce qu'on a
  relevé chez lui en est la reprise — sans quoi son catalogue naîtrait vide sous une offre qui
  pointe déjà un modèle.
*/
function adoptProviderModels(data) {
  const byProvider = {};
  (data.offers || []).forEach((offer) => {
    const rental = (data.rentals || []).find((r) => r.id === offer.rentalId);
    if (!rental || !rental.providerId || !offer.modelId) return;
    (byProvider[rental.providerId] = byProvider[rental.providerId] || new Set()).add(offer.modelId);
  });
  data.providers.forEach((provider) => {
    const seen = byProvider[provider.id];
    if (!seen) return;
    provider.modelIds = [...new Set([...provider.modelIds, ...seen])];
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
function rentalIdFromOffer(offer) {
  const slug = [offer.providerId, offer.location, offer.dates]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `rental-${offer.travelId}-${slug}`;
}

function adoptRentals(data) {
  const known = new Set(data.rentals.map((r) => r.id));
  (data.offers || []).forEach((offer) => {
    if (offer.rentalId === undefined) offer.rentalId = '';
    if (offer.rentalId || (!offer.providerId && !offer.location && !offer.dates))
      return cleanOffer(offer);
    const id = rentalIdFromOffer(offer);
    if (!known.has(id)) {
      known.add(id);
      data.rentals.push({
        id,
        travelId: offer.travelId,
        providerId: offer.providerId || '',
        location: offer.location || '',
        pickupDate: '',
        pickupTime: '',
        dropoffDate: '',
        dropoffTime: '',
        link: '',
        notes: offer.dates || '',
      });
    }
    offer.rentalId = id;
    cleanOffer(offer);
  });
}

function cleanOffer(offer) {
  delete offer.providerId;
  delete offer.location;
  delete offer.dates;
}

/*
  Le loueur, le lieu et les dates d'une offre redescendent de sa location sur elle : une location
  ne portait plus que ce qui distinguait un relevé, et le total qu'elle servait à ramener au jour
  ne se saisit plus — la durée appartient au scénario qui lit l'offre. La collection `rentals`
  reste dans les données le temps que sa page dorme : rien n'est effacé, l'offre se suffit.
*/
const RENTAL_FIELDS = ['location', 'pickupDate', 'pickupTime', 'dropoffDate', 'dropoffTime'];

function adoptOfferRentals(data) {
  (data.offers || []).forEach((offer) => {
    const rental = (data.rentals || []).find((r) => r.id === offer.rentalId) || {};
    if (offer.providerId === undefined) offer.providerId = rental.providerId || '';
    RENTAL_FIELDS.forEach((field) => {
      if (offer[field] === undefined) offer[field] = rental[field] || '';
    });
    if (!offer.pricePerDay) offer.pricePerDay = migratedDayPrice(offer, rental);
  });
}

// Le total relevé chez le loueur valait pour les jours de sa location : c'est de là que vient le
// prix par jour d'une offre qui n'en portait pas.
function migratedDayPrice(offer, rental) {
  const days = daysBetween(rental.pickupDate, rental.dropoffDate);
  if (!days || !hasPriceValue(offer.priceTotal)) return '';
  return String(Math.round((priceNumber(offer.priceTotal) / days) * 100) / 100);
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
  (data.offers || []).forEach((offer) => {
    if (offer.modelId === undefined) offer.modelId = '';
    if (fromProviders[offer.modelId]) offer.modelId = fromProviders[offer.modelId];
    else if (!offer.modelId && offer.model)
      offer.modelId = adoptCarModel(data, offer.travelId, offer.model, offer.fuel, offer.gearbox);
    offer.model = '';
    cleanOfferWords(offer);
  });
}

/*
  `cars` nommait un prix proposé par un loueur et non une voiture — la voiture, c'est `carModels`.
  La collection, les deux champs qui la référencent et l'onglet du Sheet deviennent donc `offers`.
  La base de synchro passe par ici aussi : sans quoi son instantané resterait au nom d'avant et
  chaque offre repartirait en ajout.
*/
function adoptOfferNames(data) {
  if (data.cars && !data.offers) data.offers = data.cars;
  delete data.cars;
  [...(data.scenarios || []), ...(data.transports || [])].forEach((item) => {
    if (item.carId !== undefined && item.offerId === undefined) item.offerId = item.carId;
    if (item.carOptionIds !== undefined && item.offerOptionIds === undefined)
      item.offerOptionIds = item.carOptionIds;
    delete item.carId;
    delete item.carOptionIds;
  });
  return data;
}

function cleanOfferWords(offer) {
  delete offer.fuel;
  delete offer.gearbox;
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
    attractionId: option.attractionId || option.cityId || null,
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
  if (step.attractionId === undefined) step.attractionId = null;
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
