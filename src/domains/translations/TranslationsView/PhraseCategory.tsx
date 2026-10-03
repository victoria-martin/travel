import type { PhraseCategory as PhraseCategoryType } from '../types';
import { PhraseItem } from './PhraseItem';

// Port de phraseCategoryHtml (js/views/phrases.js).
export function PhraseCategory({ category, lang }: { category: PhraseCategoryType; lang: string }) {
  return (
    <section className="translation-category">
      <h3 className="translation-category-title">{category.title}</h3>
      <ul className="translation-list">
        {category.items.map((item) => (
          <PhraseItem key={item.customId || item.fr} item={item} lang={lang} />
        ))}
      </ul>
    </section>
  );
}
