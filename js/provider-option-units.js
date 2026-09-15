/*
  Ce qu'une option se compte : un forfait, ou un prix répété — par jour de location, par bagage,
  par personne, par trajet. Liste figée, comme les modes de transport.
  `per` dit ce qui le répète dans un total. Un bagage et un trajet ne s'y comptent qu'une fois :
  rien ne dit combien on en prend.
*/
const PROVIDER_OPTION_UNITS = {
  flat: { label: 'Forfait', suffix: '', per: '' },
  perDay: { label: 'Par jour', suffix: '/ jour', per: 'day' },
  perBag: { label: 'Par bagage', suffix: '/ bagage', per: '' },
  perPerson: { label: 'Par personne', suffix: '/ personne', per: 'traveler' },
  perTrip: { label: 'Par trajet', suffix: '/ trajet', per: '' },
};

function providerOptionUnit(key) {
  return PROVIDER_OPTION_UNITS[key] || PROVIDER_OPTION_UNITS.flat;
}
