function emptyStep() {
  return {
    id: null,
    name: '',
    arrivalDate: '',
    notes: '',
    placeDate: '',
    extras: [],
    hidden: false,
    groupId: '',
    optionId: '',
    attractionId: null,
    accommodationId: null,
    accommodationType: '',
    nights: 1,
    budget: '',
  };
}

// body : React (src/domains/scenarios/detail/step-modal/StepModal.tsx, src/modal-bodies.ts).
