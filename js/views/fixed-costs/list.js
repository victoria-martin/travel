registerList('charges', {
  dataKey: 'fixedCosts',
  title: 'Charges fixes',
  subtitle: 'Péages, assurances, abonnements liés au voyage',
  fields: [
    { key: 'label', label: 'Libellé', type: 'text' },
    { key: 'amount', label: 'Montant', type: 'text' },
    { key: 'category', label: 'Catégorie', type: 'text' },
    { key: 'recurrence', label: 'Récurrence', type: 'text' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
