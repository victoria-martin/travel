/*
  Une référence est du texte brut entre accolades — pas un id caché : {Nom} se retape aussi
  facilement qu'il se lit, et se résout à l'affichage contre les lieux et hébergements du voyage.
*/
const JOURNAL_REF_RE = /\{([^{}]+)\}/g;

function journalSearchPool() {
  const travelId = currentTravelId();
  const attractions = ofCurrentTravel(state.attractions).map((a) => ({
    id: a.id,
    name: a.name,
    kind: 'attraction',
  }));
  const accommodations = ofCurrentTravel(state.accommodations).map((a) => ({
    id: a.id,
    name: a.name,
    kind: 'accommodation',
  }));
  return travelId ? [...attractions, ...accommodations] : [];
}

function resolveJournalRef(name) {
  const wanted = name.trim().toLowerCase();
  if (!wanted) return null;
  const pool = journalSearchPool();
  return (
    pool.find((item) => item.name.toLowerCase() === wanted) ||
    pool.find((item) => item.name.toLowerCase().includes(wanted)) ||
    null
  );
}

function journalRefMatches(query) {
  const wanted = query.trim().toLowerCase();
  const pool = journalSearchPool();
  if (!wanted) return pool.slice(0, 8);
  return pool.filter((item) => item.name.toLowerCase().includes(wanted)).slice(0, 8);
}

// Les refs présentes dans le texte, résolues quand elles matchent un lieu du voyage.
function journalTextRefs(text) {
  const found = [];
  let match;
  JOURNAL_REF_RE.lastIndex = 0;
  while ((match = JOURNAL_REF_RE.exec(text || ''))) {
    found.push({ raw: match[0], name: match[1], entity: resolveJournalRef(match[1]) });
  }
  return found;
}
