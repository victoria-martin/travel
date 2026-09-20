/*
  Every list renders the same table: a kind names its columns in COLUMN_SETS, the picker says
  which ones show, and each column renders its own cell.
*/

function listTable(kind, items) {
  const columns = visibleColumns(kind);
  return /* HTML */ `<div class="table-wrap table-wrap-${kind}">
    <table>
      <thead>
        <tr>
          ${columns.map((c) => columnHeader(kind, c)).join('')}
        </tr>
      </thead>
      <tbody>
        ${items.map((item) => listRow(kind, item, columns)).join('')}
      </tbody>
    </table>
  </div>`;
}

const listSearchQueries = {};

function listSearchField(kind) {
  return `<label class="list-search" data-list-search="${kind}" title="Rechercher">
    <span class="sr-only">Rechercher</span>
    <input type="search" placeholder="Rechercher…" value="${escapeHtml(listSearchQueries[kind] || '')}"
      oninput="setListSearch('${kind}', this.value)" />
  </label>`;
}

function setListSearch(kind, query) {
  listSearchQueries[kind] = query;
  render();
  const input = document.querySelector(`.list-search[data-list-search="${kind}"] input`);
  if (input) {
    input.focus();
    input.setSelectionRange(query.length, query.length);
  }
}

function listSearchItems(kind, items) {
  const wanted = normalizeListSearch(listSearchQueries[kind]);
  if (!wanted) return items;
  return items.filter((item) => normalizeListSearch(listSearchText(kind, item)).includes(wanted));
}

function normalizeListSearch(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function listSearchText(kind, item) {
  const values = {
    hebergements: [
      item.name,
      accType(item.type).label,
      ...(item.tags || []),
      item.city,
      item.county,
      item.region,
      item.country,
      item.address,
      coordsLabel(item),
    ],
    attractions: [
      item.name,
      attractionType(item.type).label,
      ...(item.tags || []),
      item.city,
      item.county,
      item.region,
      item.country,
      item.address,
      coordsLabel(item),
    ],
    villes: [
      item.name,
      attractionType(item.type).label,
      ...(item.tags || []),
      item.city,
      item.county,
      item.region,
      item.country,
      item.address,
      coordsLabel(item),
    ],
    locations: [
      offerModelName(item),
      providerName(item.providerId),
      item.location,
      carFuel(offerWords(item).fuel).label,
      carGearbox(offerWords(item).gearbox).label,
      ...offerOptions(item).map((option) => option.label),
    ],
    transports: [
      transportMode(item).label,
      transportEndpointLabel(item.fromAttractionId, item.fromPrecision),
      transportEndpointLabel(item.toAttractionId, item.toPrecision),
      providerName(item.providerId),
      item.reference,
    ],
    modeles: [item.name, carFuel(item.fuel).label, carGearbox(item.gearbox).label],
    prestataires: [
      item.name,
      providerMode(item.mode).label,
      ...(item.options || []).map((option) => option.label || option),
      ...providerCarModels(item.id).map((model) => model.name),
    ],
    charges: [item.label, ...(item.categories || []), expenseRecurrence(item.recurrence).label],
  };
  return (values[kind] || []).filter(Boolean).join(' ');
}

/*
  A row opens its resource when its kind has registered how; a click that landed on a cell which
  acts by itself — a tag, a field, a button — belongs to that cell and opens nothing.
*/
const ROW_CLICKS = {};
const ACTING_CELL = 'button, a, input, textarea, select, summary, label, [contenteditable]';

function listRow(kind, item, columns) {
  const open = ROW_CLICKS[kind]
    ? ` class="row-openable" onclick="openListRow(event,'${kind}','${item.id}')"`
    : '';
  return /* HTML */ `<tr${open} class="list-row">
    ${columns
      .map(
        (c) =>
          `<td${c.nowrap ? ' style="white-space:nowrap;"' : ''}${c.ellipsis ? ' class="cell-ellipsis"' : ''}>${c.cell(item)}</td>`,
      )
      .join('')}
  </tr>`;
}

function openListRow(event, kind, id) {
  if (event.target.closest(ACTING_CELL)) return;
  ROW_CLICKS[kind](id);
}
