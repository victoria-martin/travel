// Port de normalizeListSearch (js/views/table.js) : même normalisation (accents, casse) partout.
export function normalizeSearch(value: string | null | undefined): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
