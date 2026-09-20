/*
  Une syntaxe légère, pas un moteur markdown complet : titres, gras, italique, liens, et les
  {refs} du journal — rien d'autre n'a de raison d'exister ici. Tout part de escapeHtml, la syntaxe
  ne s'interprète que sur du texte déjà échappé.
*/
function renderJournalMarkdown(text) {
  const lines = (text || '').split('\n');
  return lines
    .map((line) => journalMarkdownLine(line))
    .filter(Boolean)
    .join('\n');
}

function journalMarkdownLine(line) {
  const heading = /^(#{1,6})\s+(.*)$/.exec(line);
  if (heading) return `<h${heading[1].length}>${journalMarkdownInline(heading[2])}</h${heading[1].length}>`;
  if (!line.trim()) return '<br />';
  return `<p>${journalMarkdownInline(line)}</p>`;
}

function journalMarkdownInline(text) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (m, label, url) =>
    externalLink(url, label),
  );
  html = html.replace(JOURNAL_REF_RE, (m, name) => journalRefChip(name));
  return html;
}

function journalRefChip(name) {
  const entity = resolveJournalRef(name);
  if (!entity) return `<span class="journal-ref journal-ref-unknown">${escapeHtml(name)}</span>`;
  const open = entity.kind === 'accommodation' ? 'openAccommodationSheet' : 'openAttractionSheet';
  return /* HTML */ `<button class="journal-ref" onclick="${open}('${entity.id}')">
    ${escapeHtml(entity.name)}
  </button>`;
}
