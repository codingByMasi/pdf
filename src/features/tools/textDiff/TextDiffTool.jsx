// Text Compare screen: paste two texts and see which lines were added or removed.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { diffLines } from './diffLines.js';

export default function TextDiffTool() {
  const { t } = useI18n();
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState(null);
  const lines = result?.lines;
  const changes = lines ? lines.filter((l) => l.type !== 'same').length : 0;
  return (
    <TextToolShell>
      <InputBox label={t('diff.a')} value={a} onChange={setA} rows={7} />
      <InputBox label={t('diff.b')} value={b} onChange={setB} rows={7} />
      <Button disabled={!a && !b} onClick={() => setResult(diffLines(a, b))}>{t('run.textDiff')}</Button>
      {result?.errorKey ? <StatusMessage title={t('error.heading')}>{t(result.errorKey)}</StatusMessage> : null}
      {lines ? (
        <>
          <StatusMessage kind="info">{changes === 0 ? t('diff.same') : t('diff.count', { count: changes })}</StatusMessage>
          <div className="diff-view" role="region" aria-label={t('diff.result')} tabIndex={0}>
            {lines.map((line, i) => (
              <div key={i} className={`diff-line diff-${line.type}`}>
                <span className="diff-mark" aria-label={t(`diff.${line.type}`)}>{line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '}</span>
                <span className="diff-text">{line.text || ' '}</span>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </TextToolShell>
  );
}
