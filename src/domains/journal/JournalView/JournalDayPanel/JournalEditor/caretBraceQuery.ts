// The last `{` before the caret, as long as no `}` comes between: typed or wrapped, same reading.
export function caretBraceQuery(text: string, caret: number) {
  const before = text.slice(0, caret);
  const braceStart = before.lastIndexOf('{');
  if (braceStart === -1) return null;
  const query = before.slice(braceStart + 1);
  if (query.includes('}')) return null;
  return { braceStart, query };
}
