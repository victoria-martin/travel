/*
  Ce qu'une option se compte : un forfait, ou un prix répété — par jour de location, par bagage,
  par personne, par trajet. Liste figée, comme les modes de transport.
*/
const PROVIDER_OPTION_UNITS = {
  flat: { label: 'Forfait', suffix: '' },
  perDay: { label: 'Par jour', suffix: '/ jour' },
  perBag: { label: 'Par bagage', suffix: '/ bagage' },
  perPerson: { label: 'Par personne', suffix: '/ personne' },
  perTrip: { label: 'Par trajet', suffix: '/ trajet' },
};

function providerOptionUnit(key) {
  return PROVIDER_OPTION_UNITS[key] || PROVIDER_OPTION_UNITS.flat;
}
