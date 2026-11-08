// List of added files: file icon, name, size, optional up/down buttons, and a trash button.
import { useI18n } from '../i18n/useI18n.js';
import { formatSize } from '../lib/formatSize.js';
import { Icon } from './Icon.jsx';

export function FileList({ items, onRemove, onMove, disabled }) {
  const { t } = useI18n();
  if (!items.length) return <p className="empty-state">{t('files.empty')}</p>;
  return (
    <section aria-labelledby="file-list-heading">
      <h3 id="file-list-heading" className="small-heading">
        {t('files.heading')} <span className="count-badge">{items.length}</span>
      </h3>
      <ul className="file-list">
        {items.map((item, position) => (
          <li key={item.id} className="file-item">
            <span className="mini-file" aria-hidden="true"><Icon name="file" size={22} /></span>
            <span className="file-info">
              <span className="file-name">{item.file.name}</span>
              <span className="file-size">{formatSize(item.file.size)}</span>
            </span>
            <span className="file-actions">
              {onMove ? (
                <>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={disabled || position === 0}
                    aria-label={t('files.moveUp', { name: item.file.name })}
                    onClick={() => onMove(item.id, -1)}
                  >
                    <Icon name="up" size={20} />
                  </button>
                  <button
                    type="button"
                    className="icon-button"
                    disabled={disabled || position === items.length - 1}
                    aria-label={t('files.moveDown', { name: item.file.name })}
                    onClick={() => onMove(item.id, 1)}
                  >
                    <Icon name="down" size={20} />
                  </button>
                </>
              ) : null}
              <button
                type="button"
                className="icon-button icon-button-danger"
                disabled={disabled}
                aria-label={t('files.remove', { name: item.file.name })}
                onClick={() => onRemove(item.id)}
              >
                <Icon name="trash" size={20} />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
