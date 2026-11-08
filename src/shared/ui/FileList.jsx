// List of added files with size and a remove button. Shows a friendly empty state.
import { useI18n } from '../i18n/useI18n.js';
import { formatSize } from '../lib/formatSize.js';
import { Button } from './Button.jsx';

export function FileList({ items, onRemove, disabled }) {
  const { t } = useI18n();
  if (!items.length) return <p className="empty-state">{t('files.empty')}</p>;
  return (
    <section aria-labelledby="file-list-heading">
      <h3 id="file-list-heading" className="small-heading">{t('files.heading')}</h3>
      <ul className="file-list">
        {items.map((item) => (
          <li key={item.id} className="file-item">
            <span className="file-name">{item.file.name}</span>
            <span className="file-size">{formatSize(item.file.size)}</span>
            <Button
              variant="light"
              disabled={disabled}
              aria-label={t('files.remove', { name: item.file.name })}
              onClick={() => onRemove(item.id)}
            >
              {t('files.removeButton')}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
