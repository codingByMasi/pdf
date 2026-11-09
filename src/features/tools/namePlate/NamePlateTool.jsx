// Name Plate Maker screen: a big name and a small line under it, ready to print for a desk, door or event.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { DocShell } from '../docKit/DocShell.jsx';
import { useDocStyle } from '../docKit/DocStyle.jsx';
import { namePlatePdf } from './namePlatePdf.js';

export default function NamePlateTool() {
  const { t } = useI18n();
  const style = useDocStyle(false);
  const [name, setName] = useState('');
  const [line, setLine] = useState('');
  const make = async () => ({ ...(await namePlatePdf({ name, line, accent: style.accent })), fileName: 'name-plate.pdf' });
  return (
    <DocShell toolId="namePlate" make={make} canRun={name.trim() !== ''}>
      {style.controls}
      <TextField label={t('plate.name')} value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label={t('plate.line')} value={line} onChange={(e) => setLine(e.target.value)} hint={t('plate.hint')} />
    </DocShell>
  );
}
