import type { ReactNode } from 'react';

const INLINE_RE = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\{([^{}]+)\}/g;

// A light syntax, not a markdown engine: headings, bold, italic, links and the journal's {refs}.
export function JournalPreview({ text }: { text: string }) {
  return (
    <div className="journal-preview">
      {text.split('\n').map((line, index) => {
        const heading = /^(#{1,6})\s+(.*)$/.exec(line);
        if (heading) {
          const Tag = `h${heading[1].length}` as 'h1';
          return <Tag key={index}>{inline(heading[2])}</Tag>;
        }
        if (!line.trim()) return <br key={index} />;
        return <p key={index}>{inline(line)}</p>;
      })}
    </div>
  );
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(text.slice(cursor, index));
    const [, bold, italic, label, url, ref] = match;
    if (bold !== undefined) nodes.push(<strong key={index}>{inline(bold)}</strong>);
    else if (italic !== undefined) nodes.push(<em key={index}>{inline(italic)}</em>);
    else if (label !== undefined)
      nodes.push(
        <a key={index} className="external-link" href={url} target="_blank" rel="noreferrer">
          {inline(label)}
        </a>,
      );
    else nodes.push(<RefChip key={index} name={ref} />);
    cursor = index + match[0].length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function RefChip({ name }: { name: string }) {
  const entity = window.resolveJournalRef(name);
  if (!entity) return <span className="journal-ref journal-ref-unknown">{name}</span>;
  const open =
    entity.kind === 'accommodation' ? window.openAccommodationSheet : window.openAttractionSheet;
  return (
    <button type="button" className="journal-ref" onClick={() => open(entity.id)}>
      {entity.name}
    </button>
  );
}
