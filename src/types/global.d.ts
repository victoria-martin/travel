export {};

/*
  Interop avec le legacy (scripts classiques, tout en globales) : ce fichier ne déclare que ce dont
  le pont React (src/store/legacyBridge.ts, src/main.tsx) a besoin. Pas une tentative de typer
  l'app legacy en entier.
*/
declare global {
  interface Window {
    state: any;
    currentTravelId: () => string | null;
    ofCurrentTravel: <T extends { travelId: string }>(items: T[]) => T[];
    openModal: (type: string, ...args: string[]) => void;
    openSheet: (type: string, ...args: string[]) => void;
    deleteItem: (collection: string, id: string) => void;
    REACT_VIEWS: Record<string, () => React.JSX.Element>;
    mountReactView: (container: HTMLElement, viewKey: string) => boolean;
    unmountReactView: () => void;
    __reactStateSubscribers?: Set<() => void>;
    svgIcon: (name: string, opts?: { fill?: boolean; className?: string }) => string;
    toggleAttractionFavorite: (id: string) => void;
    attractionType: (type: string) => { label: string; emoji: string; color: string };
    attractionStatus: (status: string) => { label: string; emoji: string };
    coordsLabel: (p: { lat: string; lng: string }) => string;
    hiddenColumns: (kind: string) => string[];
    toggleColumn: (kind: string, key: string) => void;
    ATTRACTION_TYPES: Record<string, { label: string; emoji: string; color: string }>;
    ATTRACTION_STATUSES: Record<string, { label: string; emoji: string }>;
    setAttractionType: (id: string, type: string) => void;
    setAttractionStatus: (id: string, status: string) => void;
    expenseAmountLabel: (cost: { amount: string; recurrence: string }) => string;
    expenseRecurrence: (recurrence: string) => { label: string; emoji: string };
    toggleTransportFavorite: (id: string) => void;
    setTransportMode: (id: string, mode: string) => void;
    setTransportStatus: (id: string, status: string) => void;
    TRANSPORT_MODES: Record<string, { label: string; emoji: string; color: string }>;
    PROVIDER_MODES: Record<string, { label: string; emoji: string; color: string }>;
    TRANSPORT_STATUSES: Record<string, { label: string; emoji: string }>;
    transportMode: (mode: string) => { label: string; emoji: string; color: string };
    providerMode: (mode: string) => { label: string; emoji: string; color: string };
    providerModeKey: (mode: string) => string;
    providerCarModels: (providerId: string) => import('../store/types').CarModel[];
    providerOptionUnit: (unit: string) => { label: string; suffix: string; per: string };
    CAR_FUELS: Record<string, { label: string; emoji: string }>;
    CAR_GEARBOXES: Record<string, { label: string; emoji: string }>;
    CAR_STATUSES: Record<string, { label: string; emoji: string }>;
    UNSET_CAR_FUEL: { label: string; emoji: string };
    UNSET_CAR_GEARBOX: { label: string; emoji: string };
    carFuel: (fuel: string) => { label: string; emoji: string };
    carGearbox: (gearbox: string) => { label: string; emoji: string };
    carStatus: (status: string) => { label: string; emoji: string };
    setCarModelFuel: (id: string, fuel: string) => void;
    setCarModelGearbox: (id: string, gearbox: string) => void;
    setOfferStatus: (id: string, status: string) => void;
    setOfferNotes: (id: string, notes: string) => void;
    setDefaultOffer: (id: string) => void;
    duplicateOffer: (id: string) => void;
    carModelProviders: (modelId: string) => import('../store/types').Provider[];
    carModelOffers: (modelId: string) => import('../store/types').Offer[];
    offerModelName: (offer: import('../store/types').Offer) => string;
    offerDatesLabel: (offer: import('../store/types').Offer) => string[];
    offerDayPrice: (offer: import('../store/types').Offer) => number;
    offerDayPriceLabel: (offer: import('../store/types').Offer) => string;
    offerOptions: (offer: import('../store/types').Offer) => import('../store/types').ProviderOption[];
    priceNumber: (value: string) => number;
    formatRate: (value: number) => string;
    transportStatus: (status: string) => { label: string; emoji: string };
    transportEndpointLabel: (placeId: string, precision: string) => string;
    transportPlaceName: (placeId: string) => string;
    transportMoment: (date: string, time: string) => string;
    priceLabel: (entity: { amountMin?: string; amountMax?: string; budget: string }) => string;
    providerName: (id: string) => string;
    saveNow: () => void;
    render: () => void;
    allAttractionTags: () => string[];
    allFixedCostCategories: () => string[];
  }
}
