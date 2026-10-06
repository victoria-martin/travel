// Port de normalizeListSearch (js/views/todo/get-todo-list.js) : même normalisation (accents, casse) partout.
export function normalizeSearch(value: string | null | undefined): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
