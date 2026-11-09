// Number to Words screen: writes an amount in rupees and paise in English and Hindi words.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { rupeeWords } from './rupeeWords.js';

export default function NumberWordsTool() {
  const { t } = useI18n();
  const [amount, setAmount] = useState('');
  const r = useMemo(() => (amount.trim() ? rupeeWords(amount) : null), [amount]);
  return (
    <TextToolShell>
      <TextField label={t('words.amount')} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} hint={t('words.hint')} />
      {r && !r.ok ? <StatusMessage title={t('error.heading')}>{t(r.errorKey)}</StatusMessage> : null}
      <OutputBox label={t('words.en')} value={r?.ok ? r.en : ''} fileName="amount-english.txt" rows={3} />
      <OutputBox label={t('words.hi')} value={r?.ok ? r.hi : ''} fileName="amount-hindi.txt" rows={3} />
    </TextToolShell>
  );
}
