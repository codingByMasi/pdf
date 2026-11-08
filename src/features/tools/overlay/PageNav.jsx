// Previous / next page buttons with "Page 2 of 5".
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';

export function PageNav({ page, numPages, onChange }) {
  const { t } = useI18n();
  return (
    <div className="page-nav">
      <Button variant="secondary" disabled={page <= 0} onClick={() => onChange(page - 1)}>{t('viewer.prev')}</Button>
      <p className="page-nav-label" aria-live="polite">{t('viewer.pageOf', { page: page + 1, total: numPages })}</p>
      <Button variant="secondary" disabled={page >= numPages - 1} onClick={() => onChange(page + 1)}>{t('viewer.next')}</Button>
    </div>
  );
}
