function openPasteImport() {
  openModal('paste-import');
}

function pasteImportForm() {
  return /* HTML */ `
    <h3>Importer depuis un tableau</h3>
    <p style="font-size:13px; color:var(--ink-soft); margin-top:-8px;">
      Dans Google Sheets ou Excel, mets tes colonnes dans cet ordre (une ligne par hébergement) :
      <br /><strong>Type · Nom · Ville · Région · Prix · Dates · Lien · Notes</strong><br />
      Type accepte
      ${Object.values(ACCOMMODATION_TYPES)
        .map((t) => `"${t.label}"`)
        .join(', ')}
      (par défaut : ${accType(DEFAULT_ACCOMMODATION_TYPE).label.toLowerCase()}). Sélectionne tes
      lignes, copie (Ctrl+C), puis colle ci-dessous.
    </p>
    <div class="field">
      <textarea
        id="paste-area"
        rows="10"
        placeholder="hotel	Antico Casale	Sarzana	Ligurie	152	21/09	https://...	Super, pack remboursable"
        style="font-family:monospace; font-size:12px;"
      ></textarea>
    </div>
    <div id="paste-preview" style="font-size:12.5px; color:var(--ink-soft);"></div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeModal()">Annuler</button>
      <button class="btn" onclick="runPasteImport()">Analyser et importer</button>
    </div>
  `;
}

function runPasteImport() {
  const raw = document.getElementById('paste-area').value;
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) {
    alert("Colle d'abord au moins une ligne.");
    return;
  }
  let added = 0;
  lines.forEach((line) => {
    const cells = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
    const [typeRaw, name, city, region, price, dates, link, notes] = cells.map((c) =>
      (c || '').trim(),
    );
    if (!name && !city) return;
    const type = accTypeFromText(typeRaw);
    state.accommodations.push({
      id: uid(),
      type,
      status: DEFAULT_ACCOMMODATION_STATUS,
      name: name || city || 'Sans nom',
      address: '',
      geoAddress: '',
      city: city || '',
      county: region || '',
      region: '',
      lat: '',
      lng: '',
      price: price || '',
      dates: dates || '',
      link: link || '',
      notes: notes || '',
      favorite: false,
    });
    added++;
  });
  saveNow();
  closeModal();
  alert(added + ' hébergement(s) importé(s). Renseigne une adresse à localiser pour les placer sur la carte.');
  render();
}
