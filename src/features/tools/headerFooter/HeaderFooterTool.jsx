// Header and Footer screen: type a header and/or footer, pick where it sits, and add it to every page.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import SimplePdfTool from '../simple/SimplePdfTool.jsx';

export default function HeaderFooterTool({ tool }) {
  const { t } = useI18n();
  const [header, setHeader] = useState('');
  const [footer, setFooter] = useState('');
  const [align, setAlign] = useState('center');
  const [skipFirst, setSkipFirst] = useState(false);
  const prepare = () => ({ task: 'headerFooter', payload: { options: { header, footer, align, skipFirst } } });
  const note = (r) => (r.replaced > 0 ? { noteKey: 'note.replaced', noteVars: { count: r.replaced } } : null);
  return (
    <SimplePdfTool tool={tool} prepare={prepare} suffix="-headers" note={note} canRun={Boolean(header.trim() || footer.trim())}>
      <TextField label={t('hf.header')} value={header} onChange={(e) => setHeader(e.target.value)} />
      <TextField label={t('hf.footer')} hint={t('hf.hint')} value={footer} onChange={(e) => setFooter(e.target.value)} />
      <ChoiceGroup
        legend={t('hf.align')}
        value={align}
        onChange={setAlign}
        options={['left', 'center', 'right'].map((v) => ({ value: v, label: t(`numbers.${v}`) }))}
      />
      <label className="choice">
        <input type="checkbox" checked={skipFirst} onChange={(e) => setSkipFirst(e.target.checked)} />
        <span>{t('numbers.skipFirst')}</span>
      </label>
    </SimplePdfTool>
  );
}
