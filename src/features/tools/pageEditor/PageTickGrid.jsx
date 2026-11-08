// Grid of page pictures, each with a tick box. Used to pick pages to keep or to remove.
import { PageThumb } from '../../../shared/ui/PageThumb.jsx';
import { useI18n } from '../../../shared/i18n/useI18n.js';

// checkKey is the text key for the tick box label, like "delete.pageCheck" (it gets {n}).
export function PageTickGrid({ count, urls, selected, disabled, checkKey, dimSelected, onToggle }) {
  const { t } = useI18n();
  return (
    <ul className="page-grid">
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="page-card">
          <PageThumb url={urls[index]} number={index + 1} dimmed={dimSelected ? selected.has(index) : !selected.has(index)} />
          <label className="choice">
            <input type="checkbox" checked={selected.has(index)} disabled={disabled} onChange={() => onToggle(index)} />
            <span>{t(checkKey, { n: index + 1 })}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
