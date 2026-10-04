import { Icon } from '@/shared/Icon';
import { TagLabel } from '@/shared/TagLabel';
import type { Extra, Step } from '@/store/types';
import { useRef, useState } from 'react';

/*
  The step's activities only: expenses and lines shared by a group are attached on the card, where
  their holder shows. The active result is a rank in the displayed list, set by hover and arrows
  alike; Enter picks it. A result keeps the pointer on mousedown, or the input would blur first.
*/
export function StepAttractionsField({ payload }: { payload: Step }) {
  const [extras, setExtras] = useState<Extra[]>(() => {
    payload.extras ??= [];
    return payload.extras;
  });
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (next: Extra[]) => {
    payload.extras = next;
    setExtras(next);
    setQuery('');
    setActiveIndex(0);
    inputRef.current?.focus();
  };
  const attractionLines = extras.filter((line) => !line.costId);
  const trimmed = query.trim();
  const matches = window.attractionMatches(
    trimmed,
    attractionLines.map((line) => line.attractionId),
  );
  const results = [
    ...matches.map((attraction) => ({
      key: attraction.id,
      pick: () => commit([...extras, { ...window.emptyExtra(), attractionId: attraction.id }]),
      content: (
        <TagLabel emoji={window.attractionType(attraction.type).emoji} label={attraction.name} />
      ),
      create: false,
    })),
    ...(trimmed
      ? [
          {
            key: '__create',
            pick: () =>
              commit([
                ...extras,
                { ...window.emptyExtra(), attractionId: window.createAttractionNamed(trimmed).id },
              ]),
            content: (
              <>
                <Icon name="plus" /> Créer « {trimmed} »
              </>
            ),
            create: true,
          },
        ]
      : []),
  ];

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => results.length && setActiveIndex((activeIndex + 1) % results.length),
      ArrowUp: () =>
        results.length && setActiveIndex((activeIndex - 1 + results.length) % results.length),
      Enter: () => results[activeIndex]?.pick(),
      Escape: () => setIsOpen(false),
    };
    const handler = keys[event.key];
    if (!handler) return;
    event.preventDefault();
    handler();
  };

  return (
    <div className="field">
      <label htmlFor="step-attractions-input">Activités</label>
      <div id="step-attractions" className="tags-field">
        {attractionLines.map((line) => (
          <span key={line.id} className="tag-chip tag-chip-editable">
            {window.getAttraction(line.attractionId)?.name ?? 'Activité supprimée'}
            <button
              type="button"
              className="tag-chip-remove"
              title="Retirer cette activité"
              onClick={() => commit(extras.filter((other) => other.id !== line.id))}
            >
              <Icon name="x" />
            </button>
          </span>
        ))}
        <input
          id="step-attractions-input"
          ref={inputRef}
          type="text"
          placeholder="Chercher une activité…"
          value={query}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onKeyDown={onKeyDown}
        />
      </div>
      <div id="step-attractions-results" className="attraction-results">
        {isOpen &&
          results.map((result, index) => (
            <button
              type="button"
              key={result.key}
              className={`attraction-result${result.create ? ' attraction-result-create' : ''}${index === activeIndex ? ' attraction-result-active' : ''}`}
              ref={(element) => {
                if (index === activeIndex) element?.scrollIntoView({ block: 'nearest' });
              }}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={result.pick}
            >
              {result.content}
            </button>
          ))}
      </div>
    </div>
  );
}
