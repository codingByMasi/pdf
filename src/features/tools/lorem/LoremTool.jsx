// Sample Text Maker screen: makes lorem ipsum placeholder text.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { UNITS, makeLorem } from './makeLorem.js';

export default function LoremTool() {
  const { t } = useI18n();
  const [unit, setUnit] = usePref('lorem.unit', 'paragraphs');
  const [count, setCount] = usePref('lorem.count', '3');
  const [text, setText] = useState(() => makeLorem('paragraphs', 3));
  return (
    <TextToolShell>
      <ChoiceGroup chips legend={t('lorem.unit')} value={unit} onChange={setUnit} options={UNITS.map((v) => ({ value: v, label: t(`lorem.${v}`) }))} />
      <TextField label={t('lorem.count')} type="number" inputMode="numeric" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} />
      <Button onClick={() => setText(makeLorem(unit, Number(count)))}>{t('run.lorem')}</Button>
      <OutputBox label={t('text.result')} value={text} rows={12} />
    </TextToolShell>
  );
}
