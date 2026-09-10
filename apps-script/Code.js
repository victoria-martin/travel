/**
 * Backend de synchronisation pour l'app "Voyage Toscane".
 * Le Google Sheet est la source de vérité : un onglet par collection, une ligne par entrée.
 * Déploiement : Déployer > Nouveau déploiement > Application web,
 *   "Exécuter en tant que : moi", "Qui a accès : tout le monde", puis copier l'URL /exec.
 */

const COLLECTIONS = {
  accommodations: [
    'id',
    'type',
    'status',
    'name',
    'address',
    'geoAddress',
    'city',
    'county',
    'region',
    'lat',
    'lng',
    'price',
    'dates',
    'link',
    'bookingLink',
    'notes',
    'favorite',
  ],
  cars: ['id', 'name', 'price', 'dates', 'location', 'notes'],
  fixedCosts: ['id', 'label', 'amount', 'category', 'recurrence', 'notes'],
  cities: ['id', 'name', 'geoAddress', 'lat', 'lng', 'county', 'region', 'notes'],
  scenarios: ['id', 'name', 'carId', 'costIds', 'favorite'],
  steps: [
    'id',
    'scenarioId',
    'city',
    'region',
    'arrivalDate',
    'nights',
    'cityId',
    'accommodationId',
    'notes',
  ],
};
const BOOL_FIELDS = ['favorite'];
const NUM_FIELDS = ['nights'];
// Listes d'identifiants : une seule cellule, séparée par des virgules.
const LIST_FIELDS = ['costIds'];

function doGet() {
  return json(readState());
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ error: 'Corps de requête illisible' });
  }
  if (body.action !== 'push') return json({ error: 'Action inconnue: ' + body.action });

  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var current = readState();
    if (body.baseRev && body.baseRev !== current.rev) {
      return json({ conflict: true, rev: current.rev, data: current.data });
    }
    // On renvoie ce qu'on écrit, pas une relecture de l'onglet : une relecture peut ne pas
    // encore voir l'écriture, et le client adopterait alors l'ancienne valeur.
    var written = normalizeState(body.data || {});
    writeState(written);
    return json({ rev: fingerprint(written), data: written });
  } finally {
    lock.releaseLock();
  }
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/* ------------------------------- lecture ------------------------------- */

function readState() {
  var rows = {};
  Object.keys(COLLECTIONS).forEach(function (name) {
    rows[name] = readSheet(name);
  });

  var stepsByScenario = {};
  rows.steps.forEach(function (step) {
    var key = step.scenarioId || '';
    if (!stepsByScenario[key]) stepsByScenario[key] = [];
    delete step.scenarioId;
    stepsByScenario[key].push(step);
  });

  var data = {
    accommodations: rows.accommodations,
    cars: rows.cars,
    fixedCosts: rows.fixedCosts,
    cities: rows.cities,
    scenarios: rows.scenarios.map(function (scenario) {
      scenario.steps = stepsByScenario[scenario.id] || [];
      return scenario;
    }),
  };
  return { rev: fingerprint(data), data: data };
}

// Les cellules se lisent par nom d'en-tête : ajouter ou déplacer une colonne dans
// COLLECTIONS ne doit jamais décaler les lignes déjà présentes dans l'onglet.
function readSheet(name) {
  var sheet = ensureSheet(name);
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  var columns = COLLECTIONS[name];
  if (lastRow < 2 || lastColumn < 1) return [];

  var header = sheet
    .getRange(1, 1, 1, lastColumn)
    .getDisplayValues()[0]
    .map(function (cell) {
      return String(cell == null ? '' : cell).trim();
    });
  var values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getDisplayValues();
  return values
    .filter(function (row) {
      return row.join('').trim() !== '';
    })
    .map(function (row) {
      var item = {};
      columns.forEach(function (column) {
        var index = header.indexOf(column);
        item[column] = decodeCell(column, index >= 0 ? row[index] : '');
      });
      if (!item.id) item.id = uid();
      return item;
    });
}

// Le client doit recevoir exactement ce qu'une relecture donnerait : on fait passer chaque
// entrée par l'encodage d'écriture puis le décodage de lecture.
function normalizeState(data) {
  var scenarios = [];
  (data.scenarios || []).forEach(function (scenario) {
    var normalized = normalizeItem('scenarios', scenario);
    if (!normalized) return;
    normalized.steps = [];
    (scenario.steps || []).forEach(function (step) {
      var flat = { scenarioId: normalized.id };
      COLLECTIONS.steps.forEach(function (column) {
        if (column !== 'scenarioId') flat[column] = step[column];
      });
      var normalizedStep = normalizeItem('steps', flat);
      if (!normalizedStep) return;
      delete normalizedStep.scenarioId;
      normalized.steps.push(normalizedStep);
    });
    scenarios.push(normalized);
  });

  return {
    accommodations: normalizeCollection('accommodations', data.accommodations),
    cars: normalizeCollection('cars', data.cars),
    fixedCosts: normalizeCollection('fixedCosts', data.fixedCosts),
    cities: normalizeCollection('cities', data.cities),
    scenarios: scenarios,
  };
}

function normalizeCollection(name, items) {
  return (items || [])
    .map(function (item) {
      return normalizeItem(name, item);
    })
    .filter(function (item) {
      return !!item;
    });
}

function normalizeItem(name, item) {
  var columns = COLLECTIONS[name];
  var cells = columns.map(function (column) {
    return encodeCell(item ? item[column] : '');
  });
  if (cells.join('').trim() === '') return null; // ligne vide : ignorée à la relecture
  var out = {};
  columns.forEach(function (column, index) {
    out[column] = decodeCell(column, cells[index]);
  });
  if (!out.id) out.id = uid();
  return out;
}

function encodeCell(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) return value.join(',');
  return String(value);
}

function decodeCell(column, raw) {
  var value = String(raw == null ? '' : raw).trim();
  if (BOOL_FIELDS.indexOf(column) >= 0) return /^(true|vrai|oui|1|x)$/i.test(value);
  if (NUM_FIELDS.indexOf(column) >= 0) return parseInt(value, 10) || 0;
  if (LIST_FIELDS.indexOf(column) >= 0) {
    return value
      .split(',')
      .map(function (part) {
        return part.trim();
      })
      .filter(function (part) {
        return part !== '';
      });
  }
  if (column === 'accommodationId' || column === 'cityId' || column === 'carId') {
    return value || null;
  }
  return value;
}

/* ------------------------------- écriture ------------------------------- */

function writeState(data) {
  var scenarios = data.scenarios || [];
  var steps = [];
  scenarios.forEach(function (scenario) {
    (scenario.steps || []).forEach(function (step) {
      var flat = { scenarioId: scenario.id };
      COLLECTIONS.steps.forEach(function (column) {
        if (column !== 'scenarioId') flat[column] = step[column];
      });
      steps.push(flat);
    });
  });

  writeSheet('accommodations', data.accommodations || []);
  writeSheet('cars', data.cars || []);
  writeSheet('fixedCosts', data.fixedCosts || []);
  writeSheet('cities', data.cities || []);
  writeSheet('scenarios', scenarios);
  writeSheet('steps', steps);
}

function writeSheet(name, items) {
  var sheet = ensureSheet(name);
  var columns = COLLECTIONS[name];
  // Une colonne retirée de COLLECTIONS laisserait sinon ses cellules orphelines à droite.
  var width = Math.max(sheet.getLastColumn(), columns.length);
  var lastRow = sheet.getLastRow();
  sheet.getRange(1, 1, 1, width).clearContent();
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold');
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, width).clearContent();
  }
  if (!items.length) return;

  var rows = items.map(function (item) {
    return columns.map(function (column) {
      return encodeCell(item[column]);
    });
  });
  var range = sheet.getRange(2, 1, rows.length, columns.length);
  range.setNumberFormat('@'); // garde "21/09" ou "42.899" tels quels
  range.setValues(rows);
}

/* ------------------------------- utilitaires ------------------------------- */

function ensureSheet(name) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    var columns = COLLECTIONS[name];
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function fingerprint(data) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.MD5,
    JSON.stringify(data),
    Utilities.Charset.UTF_8,
  );
  return bytes
    .map(function (b) {
      return ((b & 0xff) + 0x100).toString(16).slice(1);
    })
    .join('');
}

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
