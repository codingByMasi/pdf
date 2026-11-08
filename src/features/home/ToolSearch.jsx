// Search box for the tool list, with a clear button and a spoken result count.
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Button } from '../../shared/ui/Button.jsx';
import { TextField } from '../../shared/ui/TextField.jsx';

export function ToolSearch({ query, onChange, count }) {
  const { t } = useI18n();
  return (
    <div className="tool-search" role="search">
      <TextField
        label={t('search.label')}
        type="search"
        value={query}
        placeholder={t('search.placeholder')}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      {query ? <Button variant="light" onClick={() => onChange('')}>{t('search.clear')}</Button> : null}
      <p className="visually-hidden" role="status">{query ? t('search.count', { count }) : ''}</p>
    </div>
  );
}
