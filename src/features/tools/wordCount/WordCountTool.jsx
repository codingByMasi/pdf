// Word Counter screen: counts words, letters, sentences and paragraphs while you type.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { InputBox } from '../textKit/InputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { countText } from './countText.js';

const ROWS = ['words', 'characters', 'noSpaces', 'sentences', 'paragraphs', 'lines', 'readMinutes'];

export default function WordCountTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const counts = useMemo(() => countText(text), [text]);
  return (
    <TextToolShell>
      <InputBox label={t('count.input')} value={text} onChange={setText} rows={10} />
      <dl className="stat-grid" aria-live="polite">
        {ROWS.map((k) => <div key={k} className="stat"><dt>{t(`count.${k}`)}</dt><dd>{counts[k]}</dd></div>)}
      </dl>
    </TextToolShell>
  );
}
