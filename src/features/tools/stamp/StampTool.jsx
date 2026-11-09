// Stamp screen: pick a ready stamp (Approved, Draft...) or type your own, then place it on the pages.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

const READY = ['approved', 'draft', 'confidential', 'paid', 'copy', 'custom'];

export default function StampTool({ tool }) {
  const { t } = useI18n();
  const [kind, setKind] = usePref('stamp.kind', 'approved');
  const [custom, setCustom] = useState('');
  const [colour, setColour] = usePref('stamp.colour', 'red');
  const [place, setPlace] = usePref('stamp.place', 'centre');
  const [pages, setPages] = usePref('stamp.pages', 'all');
  const text = kind === 'custom' ? custom : t(`stamp.${kind}`);
  const prepare = () => ({ task: 'stamp', payload: { options: { text, colour, place, pages } } });
  const note = (r) => (r.replaced > 0 ? { noteKey: 'note.replaced', noteVars: { count: r.replaced } } : null);
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-stamped" note={note} canRun={Boolean(text.trim())}>
      <ChoiceGroup chips legend={t('stamp.kind')} value={kind} onChange={setKind} options={READY.map((v) => ({ value: v, label: t(`stamp.${v}`) }))} />
      {kind === 'custom' ? <TextField label={t('stamp.custom')} maxLength={30} value={custom} onChange={(e) => setCustom(e.target.value)} /> : null}
      <ChoiceGroup legend={t('stamp.colour')} value={colour} onChange={setColour} options={['red', 'green', 'blue', 'grey'].map((v) => ({ value: v, label: t(`stamp.colour.${v}`) }))} />
      <ChoiceGroup legend={t('stamp.place')} value={place} onChange={setPlace} options={['centre', 'corner'].map((v) => ({ value: v, label: t(`stamp.place.${v}`) }))} />
      <ChoiceGroup legend={t('stamp.pages')} value={pages} onChange={setPages} options={['all', 'first'].map((v) => ({ value: v, label: t(`stamp.pages.${v}`) }))} />
    </SimplePdfTool>
  );
}
