registerList('voitures', {
  dataKey: 'cars',
  title: 'Voitures',
  subtitle: 'Options de location',
  leadCell: defaultCarCell,
  fields: [
    { key: 'name', label: 'Loueur', type: 'text' },
    { key: 'model', label: 'Modèle', type: 'text' },
    { key: 'price', label: 'Prix', type: 'text' },
    { key: 'dates', label: 'Dates', type: 'text' },
    { key: 'location', label: 'Lieu de prise en charge', type: 'text' },
    { key: 'link', label: 'Lien', type: 'text', cell: linkCell },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
});
