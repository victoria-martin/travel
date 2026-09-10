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
  scenarios: ['id', 'name'],
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
    writeState(body.data || {});
    return json(readState());
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

function readSheet(name) {
  var sheet = ensureSheet(name);
  var lastRow = sheet.getLastRow();
  var columns = COLLECTIONS[name];
  if (lastRow < 2) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, columns.length).getDisplayValues();
  return values
    .filter(function (row) {
      return row.join('').trim() !== '';
    })
    .map(function (row) {
      var item = {};
      columns.forEach(function (column, i) {
        item[column] = decodeCell(column, row[i]);
      });
      if (!item.id) item.id = uid();
      return item;
    });
}

function decodeCell(column, raw) {
  var value = String(raw == null ? '' : raw).trim();
  if (BOOL_FIELDS.indexOf(column) >= 0) return /^(true|vrai|oui|1|x)$/i.test(value);
  if (NUM_FIELDS.indexOf(column) >= 0) return parseInt(value, 10) || 0;
  if (column === 'accommodationId' || column === 'cityId') return value || null;
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
  sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight('bold');
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, columns.length).clearContent();
  }
  if (!items.length) return;

  var rows = items.map(function (item) {
    return columns.map(function (column) {
      var value = item[column];
      if (value === undefined || value === null) return '';
      if (typeof value === 'boolean') return value ? 'true' : 'false';
      return String(value);
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
