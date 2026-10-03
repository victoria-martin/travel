// Pas dans store/types.ts : les phrases custom vivent en localStorage (dépannage local, pas
// synchronisé), hors de `state` — voir js/views/phrases.js.
export interface PhraseItem {
  fr: string;
  note?: string;
  customId?: string | null;
}

export interface PhraseCategory {
  title: string;
  items: PhraseItem[];
}

export interface CustomPhrase {
  id: string | null;
  category: string;
  fr: string;
  note: string;
}
