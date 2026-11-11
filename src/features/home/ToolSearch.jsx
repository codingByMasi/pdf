// Big search box for the tool list, with a search icon, a clear button and a spoken result count.
import { useEffect, useId, useRef } from 'react';
import { useI18n } from '../../shared/i18n/useI18n.js';
import { Icon } from '../../shared/ui/Icon.jsx';

export function ToolSearch({ query, onChange, count }) {
  const { t } = useI18n();
  const id = useId();
  const input = useRef(null);
  // Pressing "/" jumps to the search box, unless the person is already typing somewhere.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '')) return;
      event.preventDefault();
      input.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="search-wrap" role="search">
      <Icon name="search" size={24} />
      <label className="visually-hidden" htmlFor={id}>{t('search.label')}</label>
      <input
        id={id}
        ref={input}
        type="search"
        value={query}
        placeholder={t('search.placeholder')}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      {query ? (
        <button type="button" className="search-clear" aria-label={t('search.clear')} onClick={() => onChange('')}>
          <Icon name="close" size={18} />
        </button>
      ) : null}
      <p className="visually-hidden" role="status">{query ? t('search.count', { count }) : ''}</p>
    </div>
  );
}
