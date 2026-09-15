/**
 * Backend de synchronisation pour l'app "Voyage Toscane".
 * Le Google Sheet est la source de vérité : un onglet par collection, une ligne par entrée.
 * Déploiement : Déployer > Nouveau déploiement > Application web,
 *   "Exécuter en tant que : moi", "Qui a accès : tout le monde", puis copier l'URL /exec.
 */

const COLLECTIONS = {
  travels: [
    'id',
    'name',
    'emoji',
    'image',
    'description',
    'status',
    'startDate',
    'endDate',
    'country',
    'region',
    'accentColor',
    'travelers',
  ],
  accommodations: [
    'travelId',
    'id',
    'type',
    'status',
    'name',
    'address',
    'country',
    'region',
    'county',
    'city',
    'lat',
    'lng',
    'price',
    'dates',
    'link',
    'bookingLink',
    'notes',
    'tags',
    'favorite',
  ],
  // Un prestataire porte ses options dans une seule cellule : elles ne se lisent qu'avec lui.
  providers: ['travelId', 'id', 'mode', 'name', 'logo', 'site', 'bookingUrl', 'notes', 'options'],
  cars: [
    'travelId',
    'id',
    'status',
    'providerId',
    'model',
    'pricePerDay',
    'priceTotal',
    'dates',
    'location',
    'link',
    'notes',
    'isDefault',
    // Le loueur était un texte recopié à chaque ligne : cette colonne n'est plus que la source de
    // la reprise, et repart vide au premier enregistrement.
    'name',
  ],
  fixedCosts: ['travelId', 'id', 'label', 'amount', 'categories', 'recurrence', 'notes'],
  cities: [
    'travelId',
    'id',
    'name',
    'address',
    'country',
    'region',
    'county',
    'city',
    'lat',
    'lng',
    'notes',
  ],
  attractions: [
    'travelId',
    'id',
    'name',
    'type',
    'status',
    'description',
    'address',
    'country',
    'region',
    'county',
    'city',
    'lat',
    'lng',
    'accommodationId',
    'mapsLink',
    'link',
    'hours',
    'phone',
    'budget',
    'amountMin',
    'amountMax',
    'tags',
    'favorite',
  ],
  transports: [
    'travelId',
    'id',
    'mode',
    'status',
    'fromCityId',
    'fromPrecision',
    'toCityId',
    'toPrecision',
    'departDate',
    'departTime',
    'arriveDate',
    'arriveTime',
    'providerId',
    'reference',
    'carId',
    'budget',
    'amountMin',
    'amountMax',
    'link',
    'notes',
    'favorite',
    // La compagnie était un texte recopié à chaque ligne : cette colonne n'est plus que la source
    // de la reprise, et repart vide au premier enregistrement.
    'carrier',
  ],
  scenarios: [
    'travelId',
    'id',
    'name',
    'startDate',
    'carId',
    'costIds',
    'transportIds',
    'favorite',
    'isChosen',
  ],
  tripNotes: ['travelId', 'id', 'text'],
  todoLists: ['travelId', 'id', 'kind', 'columnKey', 'filterValues'],
  // Le lieu, les nuits et le budget sont à l'étape ; `groupId` et `optionId` disent la colonne à
  // laquelle elle appartient, vides si elle n'est comparée à rien.
  steps: [
    'travelId',
    'id',
    'scenarioId',
    'name',
    'arrivalDate',
    'notes',
    'hidden',
    'groupId',
    'optionId',
    'nights',
    'cityId',
    'accommodationId',
    'accommodationType',
    'budget',
    // Le titre de l'étape s'appelait `city` : cette colonne n'est plus que la source de la
    // reprise, et repart vide au premier enregistrement.
    'city',
  ],
  // Un groupe porte son masquage, et pour le reste ses deux listes filles : ses colonnes et ses
  // lignes communes.
  stepGroups: ['travelId', 'id', 'scenarioId', 'hidden'],
  groupOptions: ['travelId', 'id', 'scenarioId', 'groupId', 'name', 'isSelected'],
  groupAttractions: [
    'travelId',
    'id',
    'scenarioId',
    'groupId',
    'attractionId',
    'costId',
    'count',
    'budget',
  ],
  // Une ligne référence une activité ou une dépense, et se rattache à son porteur.
  stepAttractions: [
    'travelId',
    'id',
    'scenarioId',
    'stepId',
    'attractionId',
    'costId',
    'count',
    'budget',
  ],
  // Les variantes d'une étape vivaient dans ses options avant les colonnes : cet onglet n'est plus
  // que la source de la reprise, et repart vide au premier enregistrement.
  stepOptions: [
    'travelId',
    'id',
    'scenarioId',
    'stepId',
    'name',
    'cityId',
    'accommodationId',
    'accommodationType',
    'nights',
    'budget',
    'isSelected',
  ],
};
const STEP_CHILDREN = { options: 'stepOptions', extras: 'stepAttractions' };
const GROUP_CHILDREN = { options: 'groupOptions', extras: 'groupAttractions' };
const BOOL_FIELDS = ['favorite', 'isDefault', 'hidden', 'isChosen', 'isSelected'];
const NUM_FIELDS = ['nights', 'travelers', 'count'];
// Listes d'identifiants : une seule cellule, séparée par des virgules.
const LIST_FIELDS = ['costIds', 'transportIds', 'tags', 'categories', 'filterValues'];
// Une liste d'objets ne tient pas dans une cellule séparée par des virgules : elle s'y écrit en JSON.
const JSON_FIELDS = ['options'];
// Ancien en-tête d'une colonne renommée : l'onglet se relit avant d'être réécrit au nom d'aujourd'hui.
const LEGACY_HEADERS = { address: 'geoAddress', categories: 'category' };

function doGet(e) {
  var params = (e && e.parameter) || {};
  var scrapers = [
    { param: 'homeExchange', scrape: scrapeHomeExchange },
    { param: 'airbnb', scrape: scrapeAirbnb },
    { param: 'booking', scrape: scrapeBooking },
    { param: 'googleMaps', scrape: scrapeGoogleMaps },
  ];
  for (var i = 0; i < scrapers.length; i++) {
    if (params[scrapers[i].param]) return json(scrapers[i].scrape(params[scrapers[i].param]));
  }
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

  var stepsByScenario = groupByParent(rows.steps, 'scenarioId');
  var groupsByScenario = groupByParent(rows.stepGroups, 'scenarioId');
  attachChildren(stepsByScenario, rows, STEP_CHILDREN, 'stepId');
  attachChildren(groupsByScenario, rows, GROUP_CHILDREN, 'groupId');

  var data = {
    travels: rows.travels,
    accommodations: rows.accommodations,
    providers: rows.providers,
    cars: rows.cars,
    fixedCosts: rows.fixedCosts,
    cities: rows.cities,
    attractions: rows.attractions,
    transports: rows.transports,
    scenarios: rows.scenarios.map(function (scenario) {
      scenario.steps = stepsByScenario[scenario.id] || [];
      scenario.groups = groupsByScenario[scenario.id] || [];
      adoptScenarioSteps(scenario);
      return scenario;
    }),
    tripNotes: rows.tripNotes,
  };
  return { rev: fingerprint(data), data: data };
}

// Chaque parent retrouve ses listes filles, un onglet par liste.
function attachChildren(parentsByScenario, rows, childFields, parentColumn) {
  var byParent = {};
  Object.keys(childFields).forEach(function (field) {
    byParent[field] = groupByParent(rows[childFields[field]], parentColumn);
  });
  Object.keys(parentsByScenario).forEach(function (scenarioId) {
    parentsByScenario[scenarioId].forEach(function (parent) {
      Object.keys(childFields).forEach(function (field) {
        parent[field] = byParent[field][parent.id] || [];
      });
    });
  });
}

// Une ligne fille porte son rattachement en colonne : il redevient l'imbrication côté client.
function groupByParent(rows, parentColumn) {
  var groups = {};
  (rows || []).forEach(function (row) {
    var key = row[parentColumn] || '';
    if (!groups[key]) groups[key] = [];
    delete row[parentColumn];
    delete row.scenarioId;
    delete row.travelId;
    groups[key].push(row);
  });
  return groups;
}

/*
  Reprise des étapes d'avant les colonnes : chaque option devient une étape à elle, rangée dans une
  colonne du groupe qui remplace l'étape. La colonne et l'étape portent l'identifiant de l'option,
  le groupe celui de l'étape suffixé — un `uid()` neuf changerait l'empreinte de l'état à chaque
  lecture, et tout envoi se verrait refuser en conflit. Les lignes de l'étape, communes à toutes
  ses options, deviennent celles du groupe.
  À retirer une fois la conversion passée dans le Sheet.
*/
function adoptScenarioSteps(scenario) {
  var steps = [];
  scenario.steps.forEach(function (step) {
    explodeStepOptions(scenario, step).forEach(function (exploded) {
      steps.push(exploded);
    });
  });
  scenario.steps = steps;
  scenario.steps.forEach(function (step) {
    if (step.city) step.name = step.name || step.city;
    delete step.city;
  });
}

function explodeStepOptions(scenario, step) {
  var options = step.options;
  delete step.options;
  if (!options || options.length === 0) return [step];
  var lines = step.extras || [];
  if (options.length === 1) return [stepFromOption(step, options[0], lines)];
  var group = {
    id: step.id + '-groupe',
    options: options.map(function (option) {
      return { id: option.id, isSelected: !!option.isSelected };
    }),
    extras: lines.filter(function (line) {
      return !line.optionId;
    }),
  };
  scenario.groups.push(group);
  return options.map(function (option) {
    var made = stepFromOption(
      step,
      option,
      lines.filter(function (line) {
        return line.optionId === option.id;
      }),
    );
    made.id = option.id;
    made.groupId = group.id;
    made.optionId = option.id;
    return made;
  });
}

function stepFromOption(step, option, lines) {
  var made = {};
  Object.keys(step).forEach(function (key) {
    made[key] = step[key];
  });
  made.cityId = option.cityId || null;
  made.accommodationId = option.accommodationId || null;
  made.accommodationType = option.accommodationType || '';
  made.nights = parseInt(option.nights, 10) || 0;
  made.budget = option.budget || '';
  made.extras = lines.map(function (line) {
    var copy = {};
    Object.keys(line).forEach(function (key) {
      if (key !== 'optionId') copy[key] = line[key];
    });
    return copy;
  });
  return made;
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
        if (index < 0 && LEGACY_HEADERS[column]) index = header.indexOf(LEGACY_HEADERS[column]);
        item[column] = decodeCell(column, index >= 0 ? row[index] : '');
      });
      if (!item.id) item.id = uid();
      return item;
    });
}

function normalizeChildren(sheet, parent, children, parentColumn) {
  return (children || [])
    .map(function (child) {
      var row = normalizeItem(sheet, flattenChild(parent, child, parentColumn));
      if (!row) return null;
      delete row[parentColumn];
      delete row.scenarioId;
      delete row.travelId;
      return row;
    })
    .filter(function (row) {
      return !!row;
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
      var normalizedStep = normalizeItem('steps', flattenChild(normalized, step, 'scenarioId'));
      if (!normalizedStep) return;
      delete normalizedStep.scenarioId;
      delete normalizedStep.travelId;
      normalizedStep.extras = normalizeChildren('stepAttractions', step, step.extras, 'stepId');
      delete normalizedStep.city;
      normalized.steps.push(normalizedStep);
    });
    normalized.groups = (scenario.groups || [])
      .map(function (group) {
        var normalizedGroup = normalizeItem(
          'stepGroups',
          flattenChild(normalized, group, 'scenarioId'),
        );
        if (!normalizedGroup) return null;
        delete normalizedGroup.scenarioId;
        delete normalizedGroup.travelId;
        Object.keys(GROUP_CHILDREN).forEach(function (field) {
          normalizedGroup[field] = normalizeChildren(
            GROUP_CHILDREN[field],
            group,
            group[field],
            'groupId',
          );
        });
        return normalizedGroup;
      })
      .filter(function (group) {
        return !!group;
      });
    scenarios.push(normalized);
  });

  return {
    travels: normalizeCollection('travels', data.travels),
    accommodations: normalizeCollection('accommodations', data.accommodations),
    providers: normalizeCollection('providers', data.providers),
    cars: normalizeCollection('cars', data.cars),
    fixedCosts: normalizeCollection('fixedCosts', data.fixedCosts),
    cities: normalizeCollection('cities', data.cities),
    attractions: normalizeCollection('attractions', data.attractions),
    transports: normalizeCollection('transports', data.transports),
    scenarios: scenarios,
    tripNotes: normalizeCollection('tripNotes', data.tripNotes),
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
    return encodeCell(column, item ? item[column] : '');
  });
  if (cells.join('').trim() === '') return null; // ligne vide : ignorée à la relecture
  var out = {};
  columns.forEach(function (column, index) {
    out[column] = decodeCell(column, cells[index]);
  });
  if (!out.id) out.id = uid();
  return out;
}

function encodeCell(column, value) {
  if (value === undefined || value === null) return '';
  if (JSON_FIELDS.indexOf(column) >= 0) return value.length ? JSON.stringify(value) : '';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (Array.isArray(value)) return value.join(',');
  return String(value);
}

function decodeCell(column, raw) {
  var value = String(raw == null ? '' : raw).trim();
  if (JSON_FIELDS.indexOf(column) >= 0) {
    try {
      return JSON.parse(value || '[]');
    } catch (err) {
      return [];
    }
  }
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

// Une ligne fille n'existe que dans son parent : son rattachement et son voyage en viennent.
function flattenChild(parent, child, parentColumn) {
  var flat = { travelId: parent.travelId };
  flat[parentColumn] = parent.id;
  Object.keys(child).forEach(function (key) {
    if (key !== 'travelId' && key !== parentColumn) flat[key] = child[key];
  });
  return flat;
}

/* ------------------------------- écriture ------------------------------- */

function writeState(data) {
  var scenarios = data.scenarios || [];
  var steps = [];
  var groups = [];
  var children = { stepAttractions: [], groupOptions: [], groupAttractions: [] };
  scenarios.forEach(function (scenario) {
    (scenario.steps || []).forEach(function (step) {
      steps.push(flattenChild(scenario, step, 'scenarioId'));
      (step.extras || []).forEach(function (line) {
        var row = flattenChild(step, line, 'stepId');
        row.travelId = scenario.travelId;
        children.stepAttractions.push(row);
      });
    });
    (scenario.groups || []).forEach(function (group) {
      groups.push(flattenChild(scenario, group, 'scenarioId'));
      Object.keys(GROUP_CHILDREN).forEach(function (field) {
        (group[field] || []).forEach(function (child) {
          var row = flattenChild(group, child, 'groupId');
          row.travelId = scenario.travelId;
          children[GROUP_CHILDREN[field]].push(row);
        });
      });
    });
  });

  writeSheet('travels', data.travels || []);
  writeSheet('accommodations', data.accommodations || []);
  writeSheet('providers', data.providers || []);
  writeSheet('cars', data.cars || []);
  writeSheet('fixedCosts', data.fixedCosts || []);
  writeSheet('cities', data.cities || []);
  writeSheet('attractions', data.attractions || []);
  writeSheet('transports', data.transports || []);
  writeSheet('tripNotes', data.tripNotes || []);
  writeSheet('scenarios', scenarios);
  // L'onglet des options d'avant les colonnes repart vide : sa donnée vit maintenant dans les
  // étapes, les groupes et leurs colonnes.
  writeSheet('stepOptions', []);
  writeSheet('stepGroups', groups);
  writeSheet('groupOptions', children.groupOptions);
  writeSheet('groupAttractions', children.groupAttractions);
  writeSheet('stepAttractions', children.stepAttractions);
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
      return encodeCell(column, item[column]);
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
