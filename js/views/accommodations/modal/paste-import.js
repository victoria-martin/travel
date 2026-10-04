// To review: predates the Sheet sync, which is now the way to bring rows in. The list only offers
// it while no Sheet is connected.

const IMPORT_FIELDS = [
  { key: 'type', labels: ['type'] },
  { key: 'status', labels: ['statut', 'status'] },
  { key: 'name', labels: ['nom', 'name', 'hebergement', 'logement'] },
  { key: 'country', labels: ['pays', 'country'] },
  { key: 'region', labels: ['region'] },
  { key: 'county', labels: ['province'] },
  { key: 'city', labels: ['ville', 'city'] },
  { key: 'address', labels: ['adresse', 'address'] },
  { key: 'price', labels: ['prix', 'price'] },
  { key: 'dates', labels: ['dates', 'date'] },
  { key: 'link', labels: ['lien', 'link', 'url'] },
  { key: 'bookingLink', labels: ['booking', 'lien booking'] },
  { key: 'notes', labels: ['notes', 'note', 'commentaire', 'commentaires'] },
];

const PASTE_COLUMN_ORDER = ['type', 'name', 'city', 'county', 'price', 'dates', 'link', 'notes'];

window.IMPORT_FIELDS = IMPORT_FIELDS;
window.PASTE_COLUMN_ORDER = PASTE_COLUMN_ORDER;

function fieldLabel(key) {
  const field = IMPORT_FIELDS.find((f) => f.key === key);
  const label = field ? field.labels[0] : key;
  return label[0].toUpperCase() + label.slice(1);
}

function normalizeHeaderCell(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function splitPastedRow(line) {
  return line.includes('\t') ? line.split('\t') : line.split(',');
}

// A pasted header is only trusted when it names the one column we cannot guess: the name.
function headerMapping(cells) {
  const mapping = cells.map((cell) => {
    const normalized = normalizeHeaderCell(cell);
    const field = IMPORT_FIELDS.find((f) => f.labels.includes(normalized));
    return field ? field.key : null;
  });
  return mapping.includes('name') ? mapping : null;
}

//  est ce que ce flow fonctionne avec le code actuel : j importe un fichier : ca créé un nouveau google sheet avec le structure avec nom actuel du fichier + "-data" à la fin. j imagine qu il faudra re rentrer un google script url ? a verifier tout ca
// function openPasteImport() {
//   openModal('paste-import');
// }

function runPasteImport() {
  const raw = document.getElementById('paste-area').value;
  const rows = raw
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map(splitPastedRow);
  if (rows.length === 0) {
    alert("Colle d'abord au moins une ligne.");
    return;
  }

  const header = headerMapping(rows[0]);
  const mapping = header || PASTE_COLUMN_ORDER;
  const dataRows = header ? rows.slice(1) : rows;
  if (dataRows.length === 0) {
    alert("Il n'y a que la ligne d'en-tête, aucune donnée à importer.");
    return;
  }

  let added = 0;
  dataRows.forEach((cells) => {
    const fields = {};
    mapping.forEach((key, index) => {
      if (key) fields[key] = (cells[index] || '').trim();
    });
    if (!fields.name && !fields.city) return;
    if (fields.city) upsertVilleByName(currentTravelId(), fields.city);
    state.accommodations.push({
      id: uid(),
      travelId: currentTravelId(),
      type: accTypeFromText(fields.type),
      status: accStatusFromText(fields.status),
      name: fields.name || fields.city || 'Sans nom',
      address: fields.address || '',
      ...placeLevelsOf(fields),
      lat: '',
      lng: '',
      price: fields.price || '',
      dates: fields.dates || '',
      link: fields.link || '',
      bookingLink: fields.bookingLink || '',
      notes: fields.notes || '',
      favorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    added++;
  });
  saveNow();
  closeModal();
  alert(added + ' hébergement(s) importé(s). Renseigne une adresse pour les placer sur la carte.');
  render();
}
