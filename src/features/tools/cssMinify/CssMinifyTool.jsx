// CSS Minifier screen: paste CSS, see the smaller CSS and how many characters were saved.
import { useMemo, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { InputBox } from '../textKit/InputBox.jsx';
import { OutputBox } from '../textKit/OutputBox.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { minifyCss } from './minifyCss.js';

export default function CssMinifyTool() {
  const { t } = useI18n();
  const [css, setCss] = useState('');
  const out = useMemo(() => minifyCss(css), [css]);
  const saved = css.length ? Math.round((1 - out.length / css.length) * 100) : 0;
  return (
    <TextToolShell>
      <InputBox label={t('css.input')} value={css} onChange={setCss} rows={10} />
      {css ? <p>{t('css.saved', { before: css.length, after: out.length, percent: saved })}</p> : null}
      <OutputBox label={t('css.output')} value={out} fileName="styles.min.css" />
    </TextToolShell>
  );
}
