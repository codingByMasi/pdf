// Small picture of one PDF page (or an empty frame while it is being made), with a caption.
import { useI18n } from '../i18n/useI18n.js';

export function PageThumb({ url, number, rotation = 0, dimmed = false }) {
  const { t } = useI18n();
  return (
    <figure className={`page-thumb${dimmed ? ' page-thumb-dimmed' : ''}`}>
      <div className="page-thumb-frame">
        {url ? (
          <img
            className="page-thumb-img"
            src={url}
            alt={t('page.label', { n: number })}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        ) : (
          <span className="page-thumb-wait" aria-hidden="true" />
        )}
      </div>
      <figcaption>{t('page.label', { n: number })}</figcaption>
    </figure>
  );
}
