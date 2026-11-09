// Case Converter screen: change text to UPPER, lower, Title, Sentence, camelCase, snake_case or kebab-case.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { CASES, convertCase } from './convertCase.js';

export default function CaseConvertTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [kind, setKind] = usePref('case.kind', 'upper');
  const out = useMemo(() => convertCase(kind, text), [kind, text]);
  return (
    <TextToolShell>
      <InputBox label={t('case.input')} value={text} onChange={setText} rows={7} />
      <ChoiceGroup chips legend={t('case.kind')} value={kind} onChange={setKind} options={CASES.map((v) => ({ value: v, label: t(`case.${v}`) }))} />
      <OutputBox label={t('text.result')} value={out} rows={7} />
    </TextToolShell>
  );
}
