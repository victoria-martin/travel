/*
  Une date ISO (aaaa-mm-jj) se lit en local : `new Date(iso)` la lirait en UTC et décalerait le
  jour selon le fuseau.
*/
function isoToDate(iso) {
  const [y, m, d] = (iso || '').split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}

function dateToIso(date) {
  if (!date) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// createdAt est un ISO complet (new Date().toISOString()), lisible directement en UTC.
function createdAtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
