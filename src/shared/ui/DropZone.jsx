// Area where people drop files or tap to choose them.
import { useRef, useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';
import { acceptFor } from '../lib/validateFile.js';
import { Button } from './Button.jsx';

export function DropZone({ kind, multiple, disabled, onFiles }) {
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

  return (
    <div
      className={`drop-zone${over ? ' drop-zone-over' : ''}`}
      onDragOver={(event) => { event.preventDefault(); if (!disabled) setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={handleDrop}
    >
      <p className="drop-title">{t('drop.title')}</p>
      <p className="drop-hint">{t(kind === 'image' ? 'drop.imageHint' : 'drop.pdfHint')}</p>
      <Button disabled={disabled} onClick={() => inputRef.current.click()}>
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
