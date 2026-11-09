// JSON Formatter screen: paste JSON, then tidy it, shrink it or sort its keys, and see where a mistake is.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { formatJson, formatSorted } from './jsonFormat.js';

const MODES = { pretty: (t) => formatJson(t, 2), tab: (t) => formatJson(t, 'tab'), mini: (t) => formatJson(t, 0), sorted: (t) => formatSorted(t, 2) };

export default function JsonFormatTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [mode, setMode] = usePref('json.mode', 'pretty');
  const result = useMemo(() => (text.trim() ? (MODES[mode] ?? MODES.pretty)(text) : null), [text, mode]);
  return (
    <TextToolShell>
      <InputBox label={t('json.input')} value={text} onChange={setText} rows={10} />
      <ChoiceGroup chips legend={t('json.mode')} value={mode} onChange={setMode} options={Object.keys(MODES).map((v) => ({ value: v, label: t(`json.${v}`) }))} />
      {result && !result.ok ? <StatusMessage title={t('error.heading')}>{t('json.bad', { line: result.line, column: result.column })}</StatusMessage> : null}
      {result?.ok ? <StatusMessage kind="info">{t('json.good')}</StatusMessage> : null}
      <OutputBox label={t('text.result')} value={result?.ok ? result.text : ''} fileName="data.json" rows={12} />
    </TextToolShell>
  );
}
