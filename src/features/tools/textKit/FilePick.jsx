// A plain "choose a file" button for tools that show a result on the page instead of making a download.
import { useRef } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';

export function FilePick({ file, accept, onPick }) {
  const { t } = useI18n();
  const input = useRef(null);
  return (
    <div className="file-pick">
      <input ref={input} type="file" accept={accept} className="visually-hidden" aria-label={t('drop.label')} onChange={(e) => { onPick(e.target.files?.[0] ?? null); e.target.value = ''; }} />
      <Button variant="secondary" onClick={() => input.current?.click()}>{t('drop.chooseOne')}</Button>
      {file ? <span className="file-pick-name">{file.name}</span> : null}
    </div>
  );
}
