// Les deux collections tracées sur la carte (filtre + légende), voir FilterFields.
export const MAP_KINDS: { key: 'hebergements' | 'attractions'; icon: string; label: string }[] = [
  { key: 'hebergements', icon: 'house', label: 'Hébergements' },
  { key: 'attractions', icon: 'landmark', label: 'Lieux & activités' },
];
