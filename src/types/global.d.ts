export {};

/*
  Interop avec le legacy (scripts classiques, tout en globales) : ce fichier ne déclare que ce dont
  le pont React (src/store/useTravelStore.ts, src/shell/) a besoin. Pas une tentative de typer
  l'app legacy en entier.
*/
declare global {
  interface LegacySortOrder {
    key: string;
    label: string;
    dict: Record<string, { label: string; emoji: string }>;
  }

  // A legacy COLUMN_SETS entry: it still carries sort, filter and visibility semantics for React tables.
  interface JournalPlace {
    id: string;
    name: string;
    kind: 'accommodation' | 'attraction';
  }

  interface LegacyColumn {
    key: string;
    label: string;
    pickerLabel?: string;
    locked?: boolean;
    hiddenByDefault?: boolean;
    sortValue?: (item: unknown) => string | number;
    sortOrder?: LegacySortOrder;
  }

  interface Window {
    state: any;
    currentTravelId: () => string | null;
    ofCurrentTravel: <T extends { travelId: string }>(items: T[]) => T[];
    openModal: (type: string, ...args: string[]) => void;
    openSheet: (type: string, ...args: string[]) => void;
    deleteItem: (collection: string, id: string) => void;
    __reactStateSubscribers?: Set<() => void>;
    svgIcon: (name: string, opts?: { fill?: boolean; className?: string }) => string;
    toggleAttractionFavorite: (id: string) => void;
    attractionType: (type: string) => { label: string; emoji: string; color: string };
    attractionStatus: (status: string) => { label: string; emoji: string };
    coordsLabel: (p: { lat: string; lng: string }) => string;
    hiddenColumns: (kind: string) => string[];
    columnsFor: (kind: string) => LegacyColumn[];
    chosenStepForPlace: (place: { accommodationId: string } | { attractionId: string }) => {
      scenario: import('../store/types').Scenario;
      step: import('../store/types').Step;
      index: number;
    } | null;
    createdAtDate: (iso: string) => string;
    listViewMode: Record<string, 'table' | 'card'>;
    setListMode: (kind: string, mode: 'table' | 'card') => void;
    favOnly: boolean;
    toggleFavOnly: () => void;
    columnLabel: (column: LegacyColumn) => string;
    sortableColumns: (kind: string) => LegacyColumn[];
    sortItems: <T>(kind: string, items: T[]) => T[];
    sortCriteria: (kind: string) => { key: string; dir: 'asc' | 'desc' }[];
    toggleSort: (kind: string, key: string) => void;
    addSortLevel: (kind: string) => void;
    setSortKey: (kind: string, index: number, key: string) => void;
    setSortDir: (kind: string, index: number, dir: string) => void;
    removeSortLevel: (kind: string, index: number) => void;
    moveSortLevel: (kind: string, index: number, offset: number) => void;
    directionLabel: (column: LegacyColumn | undefined, dir: 'asc' | 'desc') => string;
    sortOrderWords: (order: LegacySortOrder) => string[];
    startSortWordDrag: (event: React.DragEvent, word: string) => void;
    overSortWord: (event: React.DragEvent) => void;
    dropOnSortWord: (event: React.DragEvent, kind: string, columnKey: string, word: string) => void;
    endSortWordDrag: () => void;
    filterableColumns: (kind: string) => LegacyColumn[];
    filterKind: (scope: string) => string;
    mapScope: (kind: string) => string;
    filterLevels: (scope: string) => { key: string; values: 'all' | string[] }[];
    filterColumn: (kind: string, key: string) => LegacyColumn | undefined;
    filterValues: (kind: string, column: LegacyColumn) => string[];
    levelValues: (kind: string, level: { key: string; values: 'all' | string[] }) => string[];
    toggleFilterLevel: (scope: string, key: string) => void;
    setAllFilterLevels: (scope: string, checked: boolean) => void;
    toggleFilterValue: (scope: string, index: number, valueIndex: number) => void;
    setAllFilterValuesEverywhere: (scope: string, checked: boolean) => void;
    activeFilterCount: (scope: string) => number;
    keptByFilters: (scope: string, item: unknown) => boolean;
    toggleColumn: (kind: string, key: string) => void;
    ATTRACTION_TYPES: Record<string, { label: string; emoji: string; color: string }>;
    ATTRACTION_STATUSES: Record<string, { label: string; emoji: string }>;
    setAttractionType: (id: string, type: string) => void;
    setAttractionStatus: (id: string, status: string) => void;
    expenseAmountLabel: (cost: { amount: string; recurrence: string }) => string;
    expenseRecurrence: (recurrence: string) => { label: string; emoji: string; unit: string };
    toggleTransportFavorite: (id: string) => void;
    setTransportMode: (id: string, mode: string) => void;
    setTransportStatus: (id: string, status: string) => void;
    TRANSPORT_MODES: Record<string, { label: string; emoji: string; color: string }>;
    PROVIDER_MODES: Record<string, { label: string; emoji: string; color: string }>;
    UNSET_TRANSPORT_MODE: { label: string; emoji: string; color: string };
    saveProvider: (id: string) => void;
    locateVille: () => void;
    applyVilleMatch: (index: number) => void;
    saveVille: (id: string) => void;
    TRANSPORT_STATUSES: Record<string, { label: string; emoji: string }>;
    UNSET_TRANSPORT_STATUS: { label: string; emoji: string };
    saveTransport: (id: string) => void;
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
    UNSET_CAR_STATUS: { label: string; emoji: string };
    saveOffer: (id: string) => void;
    suggestCarConsumption: () => void;
    saveCarModel: (id: string) => void;
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
    createProviderNamed: (name: string, mode: string) => import('../store/types').Provider;
    createCarModelNamed: (
      name: string,
      fuel: string,
      gearbox: string,
    ) => import('../store/types').CarModel;
    travelCarModels: () => import('../store/types').CarModel[];
    providerNoun: (mode: string) => { label: string; indefinite: string };
    askNewProvider: (
      mode: string,
      onCreate: (provider: import('../store/types').Provider) => void,
    ) => void;
    getCarModel: (id: string) => import('../store/types').CarModel | undefined;
    upsertProvider: (provider: import('../store/types').Provider) => void;
    providerOptionLabel: (option: import('../store/types').ProviderOption) => string;
    PROVIDER_OPTION_UNITS: Record<string, { label: string; suffix: string; per: string }>;
    carModelOffers: (modelId: string) => import('../store/types').Offer[];
    offerModelName: (offer: import('../store/types').Offer) => string;
    offerDatesLabel: (offer: import('../store/types').Offer) => string[];
    offerDayPrice: (offer: import('../store/types').Offer) => number;
    offerDayPriceLabel: (offer: import('../store/types').Offer) => string;
    offerOptions: (
      offer: import('../store/types').Offer,
    ) => import('../store/types').ProviderOption[];
    priceNumber: (value: string) => number;
    formatRate: (value: number) => string;
    TRAVEL_STATUSES: Record<string, { label: string; emoji: string }>;
    DEFAULT_TRAVEL_STATUS: string;
    DEFAULT_FUEL_PRICE: number;
    DEFAULT_TOLL_RATE: number;
    commitOnEnter: (event: KeyboardEvent) => void;
    saveTravel: (id: string) => void;
    formatEuros: (value: number) => string;
    formatGuestPoints: (value: number) => string;
    formatCosts: (value: { euros: number; guestPoints: number }) => string;
    transportStatus: (status: string) => { label: string; emoji: string };
    transportEndpointLabel: (placeId: string, precision: string) => string;
    transportPlaceName: (placeId: string) => string;
    transportMoment: (date: string, time: string) => string;
    priceLabel: (entity: { amountMin?: string; amountMax?: string; budget: string }) => string;
    providerName: (id: string) => string;
    saveNow: () => void;
    uid: () => string;
    render: () => void;
    duplicateAttraction: (id: string) => void;
    duplicateFixedCost: (id: string) => void;
    openAttractionSheet: (id: string) => void;
    allAttractionTags: () => string[];
    allFixedCostCategories: () => string[];
    showButtonLabels: () => boolean;
    toggleButtonLabels: () => void;
    L: any;
    createLeafletMap: (element: string | HTMLElement) => any;
    fitToPoints: (map: any, points: [number, number][]) => void;
    keptOnMap: (kind: 'hebergements' | 'attractions', item: { favorite: boolean }) => boolean;
    accType: (type: string) => { label: string; emoji: string; color: string };
    accTypeKey: (type: string) => string;
    accStatus: (status: string) => { label: string; emoji: string };
    accommodationPriceUnit: (acc: { price: string }) => string;
    ACCOMMODATION_TYPES: Record<string, { label: string; emoji: string; color: string }>;
    ACCOMMODATION_STATUSES: Record<string, { label: string; emoji: string }>;
    UNSET_ACCOMMODATION_TYPE: { label: string; emoji: string; color: string };
    UNSET_ACCOMMODATION_STATUS: { label: string; emoji: string };
    setAccommodationType: (id: string, type: string) => void;
    setAccommodationStatus: (id: string, status: string) => void;
    toggleFavorite: (id: string) => void;
    duplicateAccommodation: (id: string) => void;
    allAccommodationTags: () => string[];
    IMPORT_FIELDS: { key: string; labels: string[] }[];
    PASTE_COLUMN_ORDER: string[];
    fieldLabel: (key: string) => string;
    runPasteImport: () => void;
    accommodationSearchOutOfRange: (acc: import('../store/types').Accommodation) => string | null;
    applyPriceFormula: (input: HTMLInputElement) => void;
    importHomeExchangePaste: () => void;
    importHomeExchangeLink: () => void;
    importAirbnbPaste: () => void;
    importAirbnbLink: () => void;
    importBookingPaste: () => void;
    importBookingLink: () => void;
    saveAccommodation: (id: string) => void;
    setTripNote: (text: string) => void;
    travelCountries: () => string[];
    countryInfoDefaults: (country: string) => {
      police: string;
      firefighters: string;
      medical: string;
      emergencyNumber: string;
      embassy: string;
      note: string;
    };
    setCountryInfoField: (country: string, field: string, value: string) => void;
    currentTravel: () => import('../store/types').Travel | null;
    chosenScenario: () => import('../store/types').Scenario | null;
    nightsLabel: (nights: number) => string;
    openScenario: (id: string) => void;
    travelPackingItems: () => import('../store/types').PackingListItem[];
    todoListsOfTravel: () => import('../store/types').TodoList[];
    todoListItems: (list: import('../store/types').TodoList) => unknown[];
    LIST_RESOURCES: { kind: string; label: string; icon: string }[];
    listResource: (kind: string) => { kind: string; label: string; icon: string };
    addTodoList: (kind: string, columnKey: string, filterValues: string[]) => void;
    toggleTodoListValue: (id: string, value: string) => void;
    freeTodosOfTravel: () => import('../store/types').FreeTodo[];
    travelPhraseLanguages: () => string[];
    currentPhraseLang: () => string;
    setPhraseLang: (lang: string) => void;
    languageLabel: (code: string) => string;
    phraseCategoriesWithCustom: () => import('../domains/translations/types').PhraseCategory[];
    phraseTranslation: (fr: string, lang: string) => string;
    editPhraseTranslation: (fr: string, lang: string) => void;
    deleteCustomPhrase: (id: string) => void;
    PHRASE_CATEGORIES: { title: string; items: { fr: string; note?: string }[] }[];
    saveCustomPhrase: (id: string) => void;
    deletePackingItem: (id: string) => void;
    allPackingCategories: () => string[];
    savePackingItem: (id: string) => void;
    NEW_WORD_VALUE: string;
    wordSelectValues: Record<string, string>;
    wordSelectChanged: (id: string, bank: string) => void;
    UNSET_ATTRACTION_TYPE: { label: string; emoji: string; color: string };
    UNSET_ATTRACTION_STATUS: { label: string; emoji: string };
    attractionAccommodations: () => import('../store/types').Accommodation[];
    PLACE_LEVELS: { key: string; label: string }[];
    locateAddress: () => void;
    importGoogleMapsPaste: (field: HTMLInputElement, nameId: string) => void;
    importGoogleMapsLink: (field: HTMLInputElement, nameId: string) => void;
    saveAttraction: (id: string) => void;
    setTodoSearch: (query: string) => void;
    addFreeTodo: (text: string) => void;
    toggleFreeTodo: (id: string) => void;
    deleteFreeTodo: (id: string) => void;
    setFreeTodoStatus: (id: string, status: string) => void;
    freeTodoStatus: (status: string) => { label: string; emoji: string };
    FREE_TODO_STATUSES: Record<string, { label: string; emoji: string }>;
    UNSET_FREE_TODO_STATUS: { label: string; emoji: string };
    defaultJournalScenarioId: () => string;
    journalScenarioOptions: () => import('../store/types').Scenario[];
    setJournalScenario: (id: string) => void;
    journalScenarioDays: (scenario: import('../store/types').Scenario) => string[];
    journalEntriesForTravel: (travelId: string) => import('../store/types').JournalEntry[];
    getJournalEntry: (
      travelId: string,
      date: string,
    ) => import('../store/types').JournalEntry | null;
    selectJournalDay: (date: string) => void;
    promptJournalDay: () => void;
    onJournalPanelToggle: (date: string, key: string) => void;
    journalMapPlaces: (date: string) => { id: string; kind: string }[];
    journalPlannedItemsForDay: (
      scenario: import('../store/types').Scenario,
      date: string,
    ) => JournalPlace[];
    stepForJournalDay: (
      scenario: import('../store/types').Scenario,
      date: string,
    ) => import('../store/types').Step | null;
    journalTextRefs: (text: string) => { raw: string; name: string; entity: JournalPlace | null }[];
    journalRefMatches: (query: string) => JournalPlace[];
    resolveJournalRef: (name: string) => JournalPlace | null;
    setJournalTextQuiet: (date: string, text: string) => void;
    removeJournalPhoto: (date: string, url: string) => void;
    onJournalPhotoPicked: (input: HTMLInputElement, date: string) => void;
    expenseBudgetScenario: () => import('../store/types').Scenario | null;
    manualExpenses: () => import('../store/types').FixedCost[];
    actualExpenses: () => import('../store/types').ActualExpense[];
    actualExpensesTotal: () => number;
    scenarioBudgetTotal: (scenario: import('../store/types').Scenario | null) => number;
    actualExpenseCostTotal: (costId: string) => number;
    actualExpensesWithoutBudget: () => import('../store/types').ActualExpense[];
    scenarioSpan: (scenario: import('../store/types').Scenario) => {
      nights: number;
      days: number;
      travelers: number;
    };
    getScenarioExpenses: (
      scenario: import('../store/types').Scenario,
    ) => import('../store/types').FixedCost[];
    expenseAmount: (
      cost: import('../store/types').FixedCost,
      span: { nights: number; days: number; travelers: number },
    ) => number;
    offerLabel: (offer: import('../store/types').Offer) => string;
    derivedExpenseGroups: () => {
      key: string;
      label: string;
      view: string;
      items: {
        icon: string;
        label: string;
        unit: string;
        amount: number | null;
        display: string;
      }[];
    }[];
    derivedExpensesTotal: () => number;
    mapAttractionScenarioActions: (attractionId: string) => string;
    getCurrentView: () => string;
    navItem: (key: string) => { key: string; label: string; icon: string } | undefined;
    navSectionOpen: (key: string) => boolean;
    setNavSectionFold: (key: string, open: boolean) => void;
    NAV_SECTIONS: { key: string; title: string; keys: string[] }[];
    mobileNavPlusOpen: boolean;
    mobileNavReordering: boolean;
    MOBILE_NAV_PRIMARY_COUNT: number;
    mobileNavPrimaryKeys: () => string[];
    mobileNavSecondaryKeys: () => string[];
    mobileNavOrder: () => string[];
    goToFromMobileNav: (key: string) => void;
    toggleMobileNavPlus: () => void;
    closeMobileNavPlus: () => void;
    startMobileNavReorder: () => void;
    endMobileNavReorder: () => void;
    startMobileNavDrag: (event: React.DragEvent, key: string) => void;
    overMobileNavRow: (event: React.DragEvent) => void;
    dropOnMobileNavRow: (event: React.DragEvent, key: string) => void;
    endMobileNavDrag: () => void;
    travelSubtitle: (travel: import('../store/types').Travel | null) => string;
    selectTravel: (id: string) => void;
    openTravelModal: (id?: string) => void;
    openSyncModal: () => void;
    modal: { type: string; sheet: boolean; payload: any } | null;
    modalPanelWidth: () => string | null;
    onModalPainted: () => void;
    dismissModal: () => void;
    dismissAskOpen: boolean;
    keepEditing: () => void;
    closeModal: () => void;
    PHRASE_STYLES: { key: string; label: string; modifier: string }[];
    phraseStyle: () => { key: string; label: string; modifier: string };
    setPhraseStyle: (key: string) => void;
    emptyExtra: () => import('../store/types').Extra;
    COUNTRIES: { code: string; label: string }[];
    countryLabel: (code: string) => string;
    countryFlag: (code: string) => string;
    paintTravelModal: (color: string) => void;
    attachAttractionToStep: (scenarioId: string, stepId: string) => void;
    addAttractionToPlan: () => void;
    askNewWord: (
      bank: string,
      onCreate: (word: { key: string; label: string; emoji: string }) => void,
    ) => void;
    sync: {
      url: string;
      lastUrl: string;
      status: string;
      message: string;
      pendingRemote: unknown;
    };
    syncActive: () => boolean;
    saveSyncUrl: () => void;
    resolveSyncChoice: (side: 'remote' | 'local') => void;
    disconnectSync: () => void;
    saveAndClose: () => void;
    applyTravelAccent: () => void;
    applyTravelTab: () => void;
    applyFlash: () => void;
    placeOpenInlineMenu: () => void;
    comparedScenarios: <T extends { id: string }>(items: T[]) => T[];
    compareMode: boolean;
    activeToast: string;
    activeAsk:
      | {
          kind: 'word';
          bank: string;
          onCreate: (word: { key: string; label: string; emoji: string }) => void;
          onClose: () => void;
        }
      | {
          kind: 'provider';
          mode: string;
          onCreate: (provider: import('../store/types').Provider) => void;
          onClose: () => void;
        }
      | {
          kind: 'routeAccommodation';
          scenarioId: string;
          stepId: string | null;
          points: { id: string; name: string }[];
          onClose: () => void;
        }
      | null;
    applyRouteAccommodationChoice: (
      scenarioId: string,
      stepId: string | null,
      points: { id: string; name: string }[],
      choice: 'new-step' | 'replace' | 'new-scenario',
      sourceId: string,
    ) => void;
    WORD_BANKS: Record<string, { noun: string; color: boolean }>;
    createWord: (
      bank: string,
      fields: { label: string; emoji: string; color: string },
    ) => { key: string; label: string; emoji: string };
    stepPlace: (
      step: import('../store/types').Step,
    ) => import('../store/types').Accommodation | import('../store/types').Attraction | null;
    visibleSteps: (scenario: import('../store/types').Scenario) => import('../store/types').Step[];
    setChosenScenario: (id: string) => void;
    toggleComparedScenario: (id: string) => void;
    isComparedScenario: (id: string) => boolean;
    duplicateScenario: (id: string) => void;
    toggleScenarioArchived: (id: string) => void;
    showArchivedScenarios: boolean;
    toggleArchivedScenarios: () => void;
    toggleCompareMode: () => void;
    createScenario: () => void;
    saveActualExpense: (id: string) => void;
    saveFixedCost: (id: string) => void;
    expenseRecurrenceKey: (recurrence: string) => string;
    EXPENSE_RECURRENCES: Record<
      string,
      { label: string; emoji: string; unit: string; count: (span: unknown) => number }
    >;
    googleMapsPlaceUrl: (query: string) => string;
    priceRange: (entity: { amountMin?: string; amountMax?: string }) => string;
    ROUTE_HELP: string;
    routeBuilder: {
      active: boolean;
      points: { lat: number; lng: number; name: string; id: string; kind: string }[];
    };
    toggleRouteBuilderMode: () => void;
    removeRouteBuilderPoint: (index: number) => void;
    clearRouteBuilderPoints: () => void;
    startRoutePointDrag: (event: React.DragEvent, index: number) => void;
    overRoutePointRow: (event: React.DragEvent) => void;
    dropOnRoutePointRow: (event: React.DragEvent, index: number) => void;
    endRoutePointDrag: () => void;
    addRouteToStep: (scenarioId: string, stepId: string) => void;
    addRouteToPlan: () => void;
    geocodeCandidates: (
      address: string,
    ) => Promise<{ label: string; lat: string; lng: string; city?: string }[]>;
    upsertVille: (ville: import('../store/types').Ville) => void;
    villeIdFromName: (travelId: string, name: string) => string;
    getStep: (scenarioId: string, stepId: string) => import('../store/types').Step | undefined;
    drawRouteBuilderLine: (map: any) => void;
    addRouteBuilderPoint: (
      lat: number,
      lng: number,
      name: string,
      id: string,
      kind: string,
    ) => void;
    mapFilters: {
      shown: { hebergements: boolean; attractions: boolean };
      scenarioId: string | null;
      scenarioOnly: boolean;
      favOnly: boolean;
    };
    toggleMapKind: (kind: 'hebergements' | 'attractions') => void;
    toggleMapFavOnly: () => void;
    setMapScenario: (id: string) => void;
    setMapScenarioOnly: (only: boolean) => void;
    activeScenarios: (
      scenarios: import('../store/types').Scenario[],
    ) => import('../store/types').Scenario[];
    getActiveScenarioId: () => string | null;
    getScenario: (id: string) => import('../store/types').Scenario | null;
    goTo: (view: string) => void;
    toggleScenarioFavorite: (id: string) => void;
    renameScenario: (id: string, name: string) => void;
    setScenarioStartDate: (id: string, date: string) => void;
    stepNights: (step: import('../store/types').Step) => number;
    saveStep: (id: string) => void;
    stepArrival: (scenario: import('../store/types').Scenario, index: number) => Date | null;
    stepLegRank: (
      scenario: import('../store/types').Scenario,
      step: import('../store/types').Step | null,
    ) => number | null;
    groupArrival: (
      scenario: import('../store/types').Scenario,
      group: import('../store/types').StepGroup,
    ) => Date | null;
    isStepVisible: (
      scenario: import('../store/types').Scenario,
      step: import('../store/types').Step,
    ) => boolean;
    moveStepBefore: (scenarioId: string, stepId: string, targetId: string, before: boolean) => void;
    moveStep: (scenarioId: string, stepId: string, direction: number) => void;
    moveGroup: (scenarioId: string, groupId: string, direction: number) => void;
    insertStep: (scenarioId: string, index: number) => void;
    insertOptionStep: (scenarioId: string, index: number, optionId: string) => void;
    insertStepGroup: (scenarioId: string, index: number) => void;
    makeStepGroup: (scenarioId: string, stepId: string) => void;
    deleteStep: (scenarioId: string, stepId: string) => void;
    duplicateStep: (scenarioId: string, stepId: string) => void;
    toggleStepHidden: (scenarioId: string, stepId: string) => void;
    renameStep: (scenarioId: string, stepId: string, name: string) => void;
    setStepBudget: (scenarioId: string, stepId: string, budget: string) => void;
    setStepNights: (scenarioId: string, stepId: string, nights: string) => void;
    setStepAccommodationType: (scenarioId: string, stepId: string, type: string) => void;
    setStepPlace: (scenarioId: string, stepId: string, value: string) => void;
    setStepPlaceDate: (scenarioId: string, stepId: string, date: string) => void;
    NIGHTS_OPTIONS: number[];
    placeLevelsLabel: (place: import('../store/types').PlaceLevels) => string;
    attractionTypeKey: (type: string) => string;
    openAccommodationSheet: (id: string) => void;
    emptyAttraction: () => Omit<import('../store/types').Attraction, 'id'> & { id: string | null };
    upsertAttraction: (item: import('../store/types').Attraction) => void;
    groupOptions: (
      group: import('../store/types').StepGroup,
    ) => import('../store/types').StepGroupOption[];
    optionSteps: (
      scenario: import('../store/types').Scenario,
      optionId: string,
    ) => import('../store/types').Step[];
    chooseGroupOption: (scenarioId: string, groupId: string, optionId: string) => void;
    toggleGroupHidden: (scenarioId: string, groupId: string) => void;
    renameStepGroup: (scenarioId: string, groupId: string, name: string) => void;
    addGroupOption: (scenarioId: string, groupId: string) => void;
    removeGroupOption: (scenarioId: string, groupId: string, optionId: string) => void;
    keepGroupOption: (scenarioId: string, groupId: string, optionId: string) => void;
    optionCost: (
      scenario: import('../store/types').Scenario,
      option: import('../store/types').StepGroupOption,
    ) => { euros: number; guestPoints: number };
    stepAccommodationCost: (step: import('../store/types').Step) => number;
    hasStepBudget: (step: import('../store/types').Step) => boolean;
    getAccommodation: (id: string | null) => import('../store/types').Accommodation | undefined;
    formatAccommodationCost: (
      acc: import('../store/types').Accommodation | undefined,
      amount: number,
    ) => string;
    scenarioRoadPoints: (scenario: import('../store/types').Scenario) => [number, number][];
    scenarioRoadKm: (scenario: import('../store/types').Scenario) => number | null;
    scenarioRoadTotal: (scenario: import('../store/types').Scenario) => number;
    scenarioFuelCost: (scenario: import('../store/types').Scenario) => number;
    scenarioTollCost: (scenario: import('../store/types').Scenario) => number;
    fetchRoute: (points: [number, number][]) => Promise<{
      line: [number, number][];
      legs: { distance: number; duration: number }[];
    }>;
    getScenarioTransports: (
      scenario: import('../store/types').Scenario,
    ) => import('../store/types').Transport[];
    transportLegLabel: (transport: import('../store/types').Transport) => string;
    attachScenarioTransport: (scenarioId: string, transportId: string) => void;
    detachScenarioTransport: (scenarioId: string, transportId: string) => void;
    fixedCostsTotal: (scenario: import('../store/types').Scenario) => number;
    setRecapFold: (key: string, open: boolean) => void;
    placeStatus: (
      scenario: import('../store/types').Scenario,
      place: { steps: import('../store/types').Step[] },
    ) => string;
    setAccommodationCheckInTime: (id: string, checkInTime: string) => void;
    isBookedAccommodation: (
      accommodation: import('../store/types').Accommodation | undefined,
    ) => boolean;
    stepOutOfRange: (
      accommodation: import('../store/types').Accommodation,
      arrival: Date | null,
      nights: number,
    ) => string | null;
    nightsByPlace: (scenario: import('../store/types').Scenario) => {
      place: import('../store/types').Attraction | null;
      acc: import('../store/types').Accommodation | null;
      nights: number;
      steps: import('../store/types').Step[];
      firstStay: number;
      dates: string[];
    }[];
    placeCost: (row: { steps: import('../store/types').Step[] }) => {
      euros: number;
      guestPoints: number;
    };
    scenarioExtraCostLines: (
      scenario: import('../store/types').Scenario,
    ) => import('../store/types').Extra[];
    scenarioAttractionLines: (
      scenario: import('../store/types').Scenario,
    ) => import('../store/types').Extra[];
    scenarioOfferOptions: (
      scenario: import('../store/types').Scenario,
    ) => import('../store/types').ProviderOption[];
    scenarioDateLabel: (iso: string) => string;
    legFuelCost: (scenario: import('../store/types').Scenario, leg: { distance: number }) => number;
    legTollCost: (leg: { distance: number }) => number;
    scenarioFuelConsumption: (scenario: import('../store/types').Scenario) => number;
    scenarioFuelCalc: (scenario: import('../store/types').Scenario) => number;
    scenarioTollCalc: (scenario: import('../store/types').Scenario) => number;
    travelFuelPrice: () => number;
    travelTollRate: () => number;
    setScenarioRoadBudget: (
      scenarioId: string,
      field: 'fuelBudget' | 'tollBudget',
      value: string,
    ) => void;
    attachScenarioExpense: (scenarioId: string, costId: string) => void;
    detachScenarioExpense: (scenarioId: string, costId: string) => void;
    trailShown: () => boolean;
    toggleTrailShown: () => void;
    trailColorByType: () => boolean;
    toggleTrailColor: () => void;
    TRAIL_STYLES: { key: string; label: string }[];
    trailStyle: () => string;
    setTrailStyle: (style: string) => void;
    STEP_AREA_SHAPES: { key: string; label: string }[];
    setStepAreaShape: (shape: string) => void;
    weatherBannerShown: () => boolean;
    weatherBannerStyle: () => string;
    toggleWeatherBanner: () => void;
    setWeatherBannerStyle: (style: string) => void;
    WEATHER_BANNER_STYLES: { key: string; label: string }[];
    OUT_OF_RANGE_STYLES: { key: string; label: string; modifier: string; showText: boolean }[];
    outOfRangeStyle: () => { key: string; label: string; modifier: string; showText: boolean };
    setOutOfRangeStyle: (key: string) => void;
    onScenarioPanelToggle: (scenarioId: string, key: string) => void;
    getScenarioOffer: (
      scenario: import('../store/types').Scenario,
    ) => import('../store/types').Offer | null;
    scenarioOfferTotal: (scenario: import('../store/types').Scenario) => number;
    setScenarioOffer: (scenarioId: string, offerId: string) => void;
    toggleScenarioOfferOption: (scenarioId: string, optionId: string) => void;
    openOfferSheet: (offerId: string) => void;
    providersOfMode: (mode: string) => import('../store/types').Provider[];
    getProvider: (id: string) => import('../store/types').Provider | undefined;
    optionAmount: (option: import('../store/types').ProviderOption, days: number) => number;
    packingItemQuantity: (item: import('../store/types').PackingListItem) => number;
    packingQuantityLabel: (item: import('../store/types').PackingListItem) => string;
    packingLineLabel: (item: import('../store/types').PackingListItem) => string;
    packingLineCategory: (item: import('../store/types').PackingListItem) => string;
    setPackingPerNight: (id: string) => void;
    setPackingQuantity: (id: string, quantity: number) => void;
    togglePackingChecked: (id: string) => void;
    removeFromTravelPacking: (id: string) => void;
    toggleCatalogItemInTravel: (catalogId: string) => void;
    isPackingGroupOpen: (category: string) => boolean;
    setPackingGroupOpen: (category: string, isOpen: boolean) => void;
    addTravelPackingItem: (line: {
      label: string;
      category: string;
      quantity: number;
      alsoInCatalog: boolean;
    }) => void;
    coordsFor: (step: import('../store/types').Step) => [number, number] | null;
    stepLetter: (rank: number) => string;
    isGroupHidden: (scenario: import('../store/types').Scenario, groupId: string) => boolean;
    holderExtras: (
      holder: import('../store/types').Step | import('../store/types').StepGroup,
    ) => import('../store/types').Extra[];
    extrasTotal: (
      holder: import('../store/types').Step | import('../store/types').StepGroup,
    ) => number;
    attachExtraAttraction: (scenarioId: string, holderId: string, attractionId: string) => void;
    attachExtraCost: (scenarioId: string, holderId: string, costId: string) => void;
    createAttractionNamed: (name: string) => import('../store/types').Attraction;
    createFixedCostNamed: (label: string) => import('../store/types').FixedCost;
    extraCount: (extra: import('../store/types').Extra) => number;
    extraCountLabel: (n: number) => string;
    extraAmount: (extra: import('../store/types').Extra) => number;
    EXTRA_COUNTS: number[];
    extraSiblingIds: (
      holder: import('../store/types').Step | import('../store/types').StepGroup,
      line: import('../store/types').Extra,
      field: 'attractionId' | 'costId',
    ) => string[];
    hasPriceValue: (value: string) => boolean;
    getAttraction: (id: string) => import('../store/types').Attraction | undefined;
    getFixedCost: (id: string) => import('../store/types').FixedCost | undefined;
    costLabel: (cost: import('../store/types').FixedCost) => string;
    costMatches: (query: string, usedIds: string[]) => import('../store/types').FixedCost[];
    attractionMatches: (query: string, usedIds: string[]) => import('../store/types').Attraction[];
    setExtraDate: (scenarioId: string, holderId: string, lineId: string, date: string) => void;
    setExtraBudget: (scenarioId: string, holderId: string, lineId: string, budget: string) => void;
    setExtraCount: (scenarioId: string, holderId: string, lineId: string, count: number) => void;
    setExtraAttraction: (
      scenarioId: string,
      holderId: string,
      lineId: string,
      attractionId: string,
    ) => void;
    setExtraCost: (scenarioId: string, holderId: string, lineId: string, costId: string) => void;
    detachExtra: (scenarioId: string, holderId: string, lineId: string) => void;
    stepStatusBackground: (status: string) => string;
    stepStatus: (
      scenario: import('../store/types').Scenario,
      step: import('../store/types').Step,
    ) => string;
    stepStatusInfo: (status: string) => { label: string; emoji: string; color: string };
    travelerCount: () => number;
    dateAfter: (date: Date | null, nights: number) => Date | null;
    dateRangeLabel: (arrival: Date | null, nights: number) => string;
    formatStepDate: (date: Date) => string;
    formatStepDay: (date: Date) => string;
    isoToDate: (iso: string) => Date | null;
    dateToIso: (date: Date | null) => string;
    scenarioStart: (scenario: import('../store/types').Scenario) => Date | null;
    totalDays: (scenario: import('../store/types').Scenario) => number;
    formatGuestPoints: (amount: number) => string;
    totalNights: (scenario: import('../store/types').Scenario) => number;
    accommodationTotals: (scenario: import('../store/types').Scenario) => {
      euros: { amount: number; nights: number };
      guestPoints: { amount: number; nights: number };
    };
    scenarioChargesTotal: (scenario: import('../store/types').Scenario) => number;
    scenarioTransportTotal: (scenario: import('../store/types').Scenario) => number;
    scenarioAttractionsTotal: (scenario: import('../store/types').Scenario) => number;
    scenarioTotal: (scenario: import('../store/types').Scenario) => {
      euros: number;
      guestPoints: number;
    };
    scenarioTotalPerTraveler: (scenario: import('../store/types').Scenario) => number;
    scenarioRoadPoints: (scenario: import('../store/types').Scenario) => [number, number][];
    scenarioRoadKm: (scenario: import('../store/types').Scenario) => number | null;
    scenarioRoadTotal: (scenario: import('../store/types').Scenario) => number;
    scenarioFuelCost: (scenario: import('../store/types').Scenario) => number;
    scenarioTollCost: (scenario: import('../store/types').Scenario) => number;
    fetchRoute: (points: [number, number][]) => Promise<{
      line: [number, number][];
      legs: { distance: number; duration: number }[];
    }>;
    drawScenarioOnMap: (
      map: any,
      scenario: import('../store/types').Scenario,
      noticeId: string,
      idleMessage: string,
    ) => [number, number][];
    scenarioAccommodationIds: (scenario: import('../store/types').Scenario) => Set<string>;
    prefs: { mapSideWidth: number; [key: string]: any };
    persistPrefs: () => void;
  }
}
