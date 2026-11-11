// Colour Palette and Gradient screen: pick a colour, get matching colours with hex codes, and build a CSS gradient.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { gradientCss, makePalettes } from './colours.js';

function Swatches({ colours, onCopy }) {
  return (
    <ul className="swatch-row">
      {colours.map((c) => (
        <li key={c}><button type="button" className="swatch-chip" style={{ background: c }} onClick={() => onCopy(c)} aria-label={c}><span>{c}</span></button></li>
      ))}
    </ul>
  );
}

export default function ColourPaletteTool() {
  const { t } = useI18n();
  const [base, setBase] = useState('#1d4ed8');
  const [second, setSecond] = useState('#22c55e');
  const [angle, setAngle] = useState('135');
  const [copied, setCopied] = useState('');
  const palettes = makePalettes(base);
  const css = gradientCss(Number(angle) || 0, [base, second]);
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); setCopied(text); } catch { setCopied(''); }
  }
  return (
    <TextToolShell>
      <div className="form-fields">
        <TextField label={t('palette.base')} type="color" value={/^#[0-9a-f]{6}$/i.test(base) ? base : '#000000'} onChange={(e) => setBase(e.target.value)} />
        <TextField label={t('palette.hex')} value={base} onChange={(e) => setBase(e.target.value)} spellCheck="false" />
      </div>
      {palettes ? ['complementary', 'analogous', 'triadic', 'shades'].map((k) => (
        <section key={k}><h3>{t(`palette.${k}`)}</h3><Swatches colours={palettes[k]} onCopy={copy} /></section>
      )) : <p role="alert">{t('palette.bad')}</p>}
      <h3>{t('palette.gradient')}</h3>
      <div className="form-fields">
        <TextField label={t('palette.second')} type="color" value={second} onChange={(e) => setSecond(e.target.value)} />
        <TextField label={t('palette.angle')} type="number" min="0" max="360" value={angle} onChange={(e) => setAngle(e.target.value)} />
      </div>
      <div className="gradient-box" style={{ background: `linear-gradient(${Number(angle) || 0}deg, ${base}, ${second})` }} role="img" aria-label={t('palette.gradient')} />
      <pre className="qr-result" tabIndex={0}>{css}</pre>
      <div className="editor-actions"><Button onClick={() => copy(css)}>{t('palette.copyCss')}</Button></div>
      <span role="status" className="share-status">{copied ? t('palette.copied', { text: copied.slice(0, 20) }) : ''}</span>
      <p className="field-hint">{t('palette.hint')}</p>
    </TextToolShell>
  );
}
