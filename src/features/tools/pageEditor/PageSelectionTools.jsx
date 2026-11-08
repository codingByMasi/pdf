// Buttons and a box to pick pages quickly: select all, clear, or type page numbers like "1-3, 5".
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { parsePageRange } from '../../../shared/lib/parsePageRange.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';

export function PageSelectionTools({ pageCount, disabled, onSelect }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [problem, setProblem] = useState(null);

  function apply() {
    const parsed = parsePageRange(text, pageCount);
    if (parsed.errorKey) setProblem({ key: parsed.errorKey, vars: parsed.vars });
    else {
      setProblem(null);
      onSelect(new Set(parsed.indices));
    }
  }

  return (
    <div className="selection-tools">
      <div className="selection-buttons">
        <Button variant="light" disabled={disabled} onClick={() => onSelect(new Set(Array.from({ length: pageCount }, (_, i) => i)))}>
          {t('pages.selectAll')}
        </Button>
        <Button variant="light" disabled={disabled} onClick={() => onSelect(new Set())}>{t('pages.clear')}</Button>
      </div>
      <TextField
        label={t('pages.rangeLabel')}
        value={text}
        inputMode="numeric"
        autoComplete="off"
        onChange={(event) => setText(event.target.value)}
      />
      <Button variant="light" disabled={disabled} onClick={apply}>{t('pages.apply')}</Button>
      {problem ? <StatusMessage>{t(problem.key, problem.vars)}</StatusMessage> : null}
    </div>
  );
}
