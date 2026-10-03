/*
  Types dérivés des emptyX() / fonctions de sauvegarde réelles (js/views/**), pas d'une
  modélisation abstraite — docs/react-migration-plan.md § 2. `scenarios`/`steps`/`groups` restent
  volontairement moins détaillés : zone en flux (voir PLAN.md, « Deux dates par étape »), affinée
  en Phase 2 quand Scenarios est migré. Champs de statut/type/mode typés `string` : les vocabulaires
  (ACCOMMODATION_TYPES, etc.) restent des dictionnaires legacy pour l'instant, pas des union types.
*/

export interface PlaceLevels {
  country: string;
  region: string;
  county: string;
  city: string;
}

export interface Travel {
  id: string;
  name: string;
  emoji: string;
  image: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  countries: string[];
  region: string;
  accentColor: string;
  travelers: number;
  fuelPrice: string;
  tollRate: string;
}

export interface Accommodation extends PlaceLevels {
  id: string;
  travelId: string;
  type: string;
  status: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  price: string;
  dates: string;
  checkInTime: string;
  availableFrom: string;
  availableTo: string;
  searchDate: string;
  link: string;
  bookingLink: string;
  mapsLink: string;
  notes: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

// Une « ville » est un lieu de type ville — pas d'entité à soi (atelier/PLAN.md, « Tranché »).
export interface Attraction extends PlaceLevels {
  id: string;
  travelId: string;
  name: string;
  type: string;
  status: string;
  description: string;
  address: string;
  lat: string;
  lng: string;
  accommodationId: string;
  mapsLink: string;
  link: string;
  hours: string;
  phone: string;
  budget: string;
  amountMin: string;
  amountMax: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
}

// Pas la page Villes (dérivée d'Attraction, state.attractions) : une liste légère de noms de
// villes connues, alimentée par upsertVilleByName (autocomplete d'adresse) et lue par la carte
// (markers) — vérifié dans le code, pas déduite. Corrige un commentaire précédent erroné qui la
// disait morte.
export interface Ville {
  id: string;
  travelId: string;
  name: string;
  lat: string;
  lng: string;
}

export interface ProviderOption {
  id: string;
  label: string;
  amount: string;
  unit: string;
}

export interface Provider {
  id: string;
  travelId: string;
  mode: string;
  name: string;
  logo: string;
  site: string;
  bookingUrl: string;
  notes: string;
  options: ProviderOption[];
  modelIds: string[];
}

export interface CarModel {
  id: string;
  travelId: string;
  name: string;
  fuel: string;
  gearbox: string;
  consumption: string;
}

// La page Locations dort (atelier/PLAN.md, « Un modèle de voiture... ») : Rental n'a plus que ses
// champs de recherche, l'Offer porte désormais son propre loueur/lieu/dates.
export interface Rental {
  id: string;
  travelId: string;
  providerId: string;
  location: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  link: string;
  notes: string;
}

export interface Offer {
  id: string;
  travelId: string;
  isDefault: boolean;
  providerId: string;
  modelId: string;
  model: string;
  status: string;
  location: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  pricePerDay: string;
  optionIds: string[];
  link: string;
  notes: string;
}

export interface FixedCost {
  id: string;
  travelId: string;
  label: string;
  amount: string;
  categories: string[];
  recurrence: string;
  notes: string;
}

export interface Transport {
  id: string;
  travelId: string;
  mode: string;
  status: string;
  fromAttractionId: string;
  fromPrecision: string;
  toAttractionId: string;
  toPrecision: string;
  departDate: string;
  departTime: string;
  arriveDate: string;
  arriveTime: string;
  providerId: string;
  reference: string;
  budget: string;
  amountMin: string;
  amountMax: string;
  link: string;
  notes: string;
  favorite: boolean;
}

export interface Extra {
  id: string;
  attractionId: string;
  costId: string;
  date: string;
  count: number;
  budget: string;
}

export interface Step {
  id: string | null;
  name: string;
  arrivalDate: string;
  placeDate?: string;
  notes: string;
  extras: Extra[];
  hidden: boolean;
  groupId: string;
  optionId: string;
  attractionId: string | null;
  accommodationId: string | null;
  accommodationType: string;
  nights: number;
  budget: string;
}

export interface StepGroupOption {
  id: string;
  name?: string;
  isSelected: boolean;
}

export interface StepGroup {
  id: string;
  name?: string;
  hidden?: boolean;
  extras?: Extra[];
  options: StepGroupOption[];
}

export interface Scenario {
  id: string;
  travelId: string;
  name: string;
  startDate: string;
  offerId: string | null;
  offerOptionIds: string[];
  costIds: string[];
  transportIds: string[];
  favorite: boolean;
  archived: boolean;
  isChosen?: boolean;
  steps: Step[];
  groups?: StepGroup[];
}

export interface TripNote {
  id: string;
  travelId: string;
  text: string;
}

export interface TodoList {
  id: string;
  travelId: string;
  kind: string;
  columnKey: string;
  filterValues: string[];
}

export interface FreeTodo {
  id: string;
  travelId: string;
  text: string;
  done: boolean;
  status: string;
}

// Catalogue, pas du voyage : pas de travelId (js/views/packing/modal/catalog-form.js).
export interface PackingItem {
  id: string;
  label: string;
  category: string;
  notes: string;
}

export interface PackingListItem {
  id: string;
  travelId: string;
  packingItemId: string;
  label: string;
  category: string;
  quantity: number;
  perNight: boolean;
  checked: boolean;
}

export interface CountryInfo {
  id: string;
  travelId: string;
  country: string;
  police: string;
  firefighters: string;
  medical: string;
  emergencyNumber: string;
  embassy: string;
  note: string;
}

export interface JournalEntry {
  id: string;
  travelId: string;
  date: string;
  scenarioId: string;
  photos: string[];
  text: string;
}

export interface ActualExpense {
  id: string;
  travelId: string;
  date: string;
  label: string;
  amount: string;
  fixedCostId: string;
  category: string;
  subCategory: string;
  address: string;
  notes: string;
}

export interface TravelData {
  travels: Travel[];
  accommodations: Accommodation[];
  providers: Provider[];
  carModels: CarModel[];
  rentals: Rental[];
  offers: Offer[];
  fixedCosts: FixedCost[];
  actualExpenses: ActualExpense[];
  attractions: Attraction[];
  villes: Ville[];
  transports: Transport[];
  scenarios: Scenario[];
  tripNotes: TripNote[];
  todoLists: TodoList[];
  freeTodos: FreeTodo[];
  packingItems: PackingItem[];
  packingListItems: PackingListItem[];
  countryInfos: CountryInfo[];
  journalEntries: JournalEntry[];
}
