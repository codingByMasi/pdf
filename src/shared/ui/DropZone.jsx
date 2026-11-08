// Area where people drop files or tap to choose them. Gets smaller once files are added.
import { useRef, useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';
import { acceptFor } from '../lib/validateFile.js';
import { Button } from './Button.jsx';
import { Icon } from './Icon.jsx';

export function DropZone({ kind, multiple, disabled, compact, onFiles }) {
  const { t } = useI18n();
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setOver(false);
    if (!disabled && event.dataTransfer.files.length) onFiles(Array.from(event.dataTransfer.files));
  }

  function handleChange(event) {
    const picked = Array.from(event.target.files);
    event.target.value = '';
    if (picked.length) onFiles(picked);
  }

  const classes = ['drop-zone', over ? 'drop-zone-over' : '', compact ? 'drop-zone-compact' : ''].join(' ').trim();
  return (
    <div
      className={classes}
      onDragOver={(event) => { event.preventDefault(); if (!disabled) setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
    >
      <span className="drop-icon" aria-hidden="true"><Icon name="file" size={32} /></span>
      <p className="drop-title">{t('drop.title')}</p>
      <p className="drop-hint">{t(`drop.${kind}Hint`)}</p>
      <p className="drop-private"><Icon name="lock" size={16} />{t('drop.private')}</p>
      <Button variant="secondary" disabled={disabled} onClick={() => inputRef.current.click()}>
        {t(multiple ? 'drop.choose' : 'drop.chooseOne')}
      </Button>
      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        tabIndex={-1}
        aria-label={t('drop.label')}
        accept={acceptFor(kind)}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
}
