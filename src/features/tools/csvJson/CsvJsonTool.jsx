// CSV and JSON converter screen: paste or load one, get the other.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { csvToJson, jsonToCsv } from './csvJson.js';

export default function CsvJsonTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [way, setWay] = usePref('csvjson.way', 'toJson');
  const result = useMemo(() => (text.trim() ? (way === 'toJson' ? csvToJson(text) : jsonToCsv(text)) : null), [text, way]);
  return (
    <TextToolShell>
      <ChoiceGroup chips legend={t('csvjson.way')} value={way} onChange={setWay} options={[{ value: 'toJson', label: t('csvjson.toJson') }, { value: 'toCsv', label: t('csvjson.toCsv') }]} />
      <InputBox label={way === 'toJson' ? t('csvjson.inCsv') : t('csvjson.inJson')} value={text} onChange={setText} rows={10} />
      {result && !result.ok ? <StatusMessage title={t('error.heading')}>{t(result.errorKey)}</StatusMessage> : null}
      {result?.ok ? <StatusMessage kind="info">{t('csvjson.done', { count: result.count })}</StatusMessage> : null}
      <OutputBox label={t('text.result')} value={result?.ok ? result.text : ''} fileName={way === 'toJson' ? 'data.json' : 'data.csv'} rows={12} />
    </TextToolShell>
  );
}
