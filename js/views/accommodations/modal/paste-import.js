// To review: predates the Sheet sync, which is now the way to bring rows in. The list only offers
// it while no Sheet is connected.

const IMPORT_FIELDS = [
  { key: 'type', labels: ['type'] },
  { key: 'status', labels: ['statut', 'status'] },
  { key: 'name', labels: ['nom', 'name', 'hebergement', 'logement'] },
  { key: 'city', labels: ['ville', 'city'] },
  { key: 'county', labels: ['province'] },
  { key: 'region', labels: ['region'] },
  { key: 'address', labels: ['adresse', 'address'] },
  { key: 'price', labels: ['prix', 'price'] },
  { key: 'dates', labels: ['dates', 'date'] },
  { key: 'link', labels: ['lien', 'link', 'url'] },
  { key: 'bookingLink', labels: ['booking', 'lien booking'] },
  { key: 'notes', labels: ['notes', 'note', 'commentaire', 'commentaires'] },
];

const PASTE_COLUMN_ORDER = ['type', 'name', 'city', 'county', 'price', 'dates', 'link', 'notes'];

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

function pasteImportForm() {
  return /* HTML */ `
    <h3>Importer depuis un tableau</h3>
    <p style="font-size:13px; color:var(--ink-soft); margin-top:-8px;">
      Copie tes lignes depuis Google Sheets ou Excel, <strong>avec la ligne d'en-tête</strong> : les
      colonnes sont reconnues par leur nom, dans n'importe quel ordre. Noms compris : <br /><strong
        >${IMPORT_FIELDS.map((f) => f.labels[0][0].toUpperCase() + f.labels[0].slice(1)).join(
          ' · ',
        )}</strong
      ><br />
      Sans en-tête, l'ordre attendu est
      <strong>${PASTE_COLUMN_ORDER.map((key) => fieldLabel(key)).join(' · ')}</strong>. Type accepte
      ${Object.values(ACCOMMODATION_TYPES)
        .map((t) => `"${t.label}"`)
        .join(', ')}
      (par défaut : ${accType(DEFAULT_ACCOMMODATION_TYPE).label.toLowerCase()}).
    </p>
    <div class="field">
      <textarea
        id="paste-area"
        rows="10"
        placeholder="Type	Nom	Ville	Province	Prix	Dates	Lien	Notes
hotel	Antico Casale	Sarzana	Ligurie	152	21/09	https://...	Super, pack remboursable"
        style="font-family:monospace; font-size:12px;"
      ></textarea>
    </div>
    <div id="paste-preview" style="font-size:12.5px; color:var(--ink-soft);"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="dismissModal()">Annuler</button>
      <button class="btn" onclick="runPasteImport()">Analyser et importer</button>
    </div>
  `;
}

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
    state.accommodations.push({
      id: uid(),
      travelId: currentTravelId(),
      type: accTypeFromText(fields.type),
      status: accStatusFromText(fields.status),
      name: fields.name || fields.city || 'Sans nom',
      address: fields.address || '',
      geoAddress: '',
      city: fields.city || '',
      county: fields.county || '',
      region: fields.region || '',
      lat: '',
      lng: '',
      price: fields.price || '',
      dates: fields.dates || '',
      link: fields.link || '',
      bookingLink: fields.bookingLink || '',
      notes: fields.notes || '',
      favorite: false,
    });
    added++;
  });
  saveNow();
  closeModal();
  alert(
    added +
      ' hébergement(s) importé(s). Renseigne une adresse à localiser pour les placer sur la carte.',
  );
  render();
}
