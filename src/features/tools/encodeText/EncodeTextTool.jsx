// Encode and Decode screen: Base64 and web-address (URL) text coding.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { MODES, runEncode } from './encodeText.js';

export default function EncodeTextTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [mode, setMode] = usePref('encode.mode', 'b64enc');
  const result = useMemo(() => (text ? runEncode(mode, text) : null), [text, mode]);
  return (
    <TextToolShell>
      <ChoiceGroup chips legend={t('encode.mode')} value={mode} onChange={setMode} options={MODES.map((v) => ({ value: v, label: t(`encode.${v}`) }))} />
      <InputBox label={t('encode.input')} value={text} onChange={setText} rows={8} />
      {result && !result.ok ? <StatusMessage title={t('error.heading')}>{t('encode.bad')}</StatusMessage> : null}
      <OutputBox label={t('text.result')} value={result?.ok ? result.text : ''} rows={8} />
    </TextToolShell>
  );
}
