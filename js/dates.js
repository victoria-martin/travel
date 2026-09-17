/*
  Une date ISO (aaaa-mm-jj) se lit en local : `new Date(iso)` la lirait en UTC et décalerait le
  jour selon le fuseau.
*/
function isoToDate(iso) {
  const [y, m, d] = (iso || '').split('-').map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}
