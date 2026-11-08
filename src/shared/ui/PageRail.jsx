// Strip of small page pictures beside (or above) a page editor. Tap one to go to that page.
import { useI18n } from '../i18n/useI18n.js';
import { useThumbnails } from '../lib/useThumbnails.js';

export function PageRail({ file, current, onSelect }) {
  const { t } = useI18n();
  const thumbs = useThumbnails(file, { width: 160 });
  if (thumbs.status === 'error' || thumbs.urls.length < 2) return null;
  return (
    <nav className="page-rail" aria-label={t('rail.label')}>
      <p className="rail-title">{t('rail.title')} <span className="count-badge">{thumbs.numPages}</span></p>
      <ul className="rail-list">
        {thumbs.urls.map((url, index) => (
          <li key={index}>
            <button
              type="button"
              className={`rail-item${index === current ? ' rail-selected' : ''}`}
              aria-current={index === current ? 'page' : undefined}
              aria-label={t('rail.go', { page: index + 1 })}
              onClick={() => onSelect(index)}
            >
              <img src={url} alt="" />
              <small>{index + 1}</small>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
