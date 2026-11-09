// QR on Pages screen: type a link or text and a QR code is printed on the pages.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function QrPagesTool({ tool }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [size, setSize] = usePref('qrpages.size', 'medium');
  const [place, setPlace] = usePref('qrpages.place', 'br');
  const [pages, setPages] = usePref('qrpages.pages', 'all');
  const prepare = () => ({ task: 'qrPages', payload: { options: { text: text.trim(), size, place, pages } } });
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-qr" canRun={text.trim() !== ''}>
      <TextField label={t('qr.text')} hint={t('qr.hint')} value={text} onChange={(e) => setText(e.target.value)} maxLength={200} />
      <ChoiceGroup legend={t('qr.size')} value={size} onChange={setSize} options={['small', 'medium', 'large'].map((v) => ({ value: v, label: t(`qr.size.${v}`) }))} />
      <ChoiceGroup legend={t('qr.place')} value={place} onChange={setPlace} options={['tl', 'tr', 'bl', 'br', 'centre'].map((v) => ({ value: v, label: t(`qr.place.${v}`) }))} />
      <ChoiceGroup legend={t('stamp.pages')} value={pages} onChange={setPages} options={['all', 'first'].map((v) => ({ value: v, label: t(`stamp.pages.${v}`) }))} />
    </SimplePdfTool>
  );
}
