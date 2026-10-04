function emptyTransport() {
  return {
    id: null,
    mode: '',
    status: '',
    fromAttractionId: '',
    fromPrecision: '',
    toAttractionId: '',
    toPrecision: '',
    departDate: '',
    departTime: '',
    arriveDate: '',
    arriveTime: '',
    providerId: '',
    reference: '',
    budget: '',
    amountMin: '',
    amountMax: '',
    link: '',
    notes: '',
    favorite: false,
  };
}

// body : React (src/domains/transports/modal/TransportModal.tsx, src/modal-bodies.ts).
