import { LegacyMarkup } from '@/shared/LegacyMarkup';
import type { Extra } from '@/store/types';

export function ExtraRecapRow({ line }: { line: Extra }) {
  const count = window.extraCount(line);
  const date = line.date ? window.scenarioDateLabel(line.date) : '';
  const meta = [date, count > 1 ? window.extraCountLabel(count) : ''].filter(Boolean).join(' · ');
  return (
    <div className="acc-recap-row acc-recap-sub">
      <span>
        <LegacyMarkup html={window.extraLabel(line)} />
      </span>
      <span className="acc-recap-nights">{meta}</span>
      <strong>{window.formatEuros(window.extraAmount(line))}</strong>
    </div>
  );
}
