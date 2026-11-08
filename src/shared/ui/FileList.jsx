// List of added files with size, optional up/down buttons, and a remove button.
import { useI18n } from '../i18n/useI18n.js';
import { formatSize } from '../lib/formatSize.js';
import { Button } from './Button.jsx';

export function FileList({ items, onRemove, onMove, disabled }) {
  const { t } = useI18n();
  if (!items.length) return <p className="empty-state">{t('files.empty')}</p>;
  return (
    <section aria-labelledby="file-list-heading">
      <h3 id="file-list-heading" className="small-heading">{t('files.heading')}</h3>
      <ul className="file-list">
        {items.map((item, position) => (
          <li key={item.id} className="file-item">
            <span className="file-name">{item.file.name}</span>
            <span className="file-size">{formatSize(item.file.size)}</span>
            <span className="file-actions">
              {onMove ? (
                <>
                  <Button
                    variant="light"
                    disabled={disabled || position === 0}
                    aria-label={t('files.moveUp', { name: item.file.name })}
                    onClick={() => onMove(item.id, -1)}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="light"
                    disabled={disabled || position === items.length - 1}
                    aria-label={t('files.moveDown', { name: item.file.name })}
                    onClick={() => onMove(item.id, 1)}
                  >
                    ↓
                  </Button>
                </>
              ) : null}
              <Button
                variant="light"
                disabled={disabled}
                aria-label={t('files.remove', { name: item.file.name })}
                onClick={() => onRemove(item.id)}
              >
                {t('files.removeButton')}
              </Button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
