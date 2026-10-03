function emptyFixedCost() {
  return {
    id: null,
    label: '',
    amount: '',
    categories: [],
    recurrence: DEFAULT_EXPENSE_RECURRENCE,
    notes: '',
  };
}

// Formulaire : src/domains/fixed-costs/modal/FixedCostModal.tsx (docs/react-migration-plan.md § 4).
// saveFixedCost reste dans save.js, juste à côté — #f-save continue de l'appeler telle quelle.
