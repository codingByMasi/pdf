// Barcode Maker screen: Code 128 or EAN-13, shown on screen and saved as PNG or SVG.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { barcodeToSvg, drawBarcode } from '../../../shared/lib/barcode/barcodeImage.js';
import { code128, ean13 } from '../../../shared/lib/barcode/code128.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { saveBlob } from '../textKit/saveBlob.js';

export default function BarcodeMakerTool() {
  const { t } = useI18n();
  const [kind, setKind] = usePref('barcode.kind', 'code128');
  const [text, setText] = useState('');
  const canvas = useRef(null);
  const made = useMemo(() => {
    if (!text) return null;
    try {
      if (kind === 'ean13') { const r = ean13(text); return { runs: r.runs, label: r.code }; }
      return { runs: code128(text), label: text };
    } catch (e) {
      return { errorKey: e.errorKey ?? 'error.generic' };
    }
  }, [kind, text]);
  useEffect(() => { if (made?.runs && canvas.current) drawBarcode(canvas.current, made.runs, made.label); }, [made]);
  const png = () => canvas.current.toBlob((b) => b && saveBlob(b, 'barcode.png'), 'image/png');
  const svg = () => saveBlob(new Blob([barcodeToSvg(made.runs, made.label)], { type: 'image/svg+xml' }), 'barcode.svg');
  return (
    <TextToolShell>
      <ChoiceGroup legend={t('barcode.kind')} value={kind} onChange={(v) => { setKind(v); setText(''); }} options={[{ value: 'code128', label: 'Code 128' }, { value: 'ean13', label: 'EAN-13' }]} />
      <TextField label={t(kind === 'ean13' ? 'barcode.digits' : 'barcode.text')} value={text} onChange={(e) => setText(e.target.value)} inputMode={kind === 'ean13' ? 'numeric' : 'text'} maxLength={kind === 'ean13' ? 13 : 60} />
      {made?.errorKey ? <StatusMessage title={t('error.heading')}>{t(made.errorKey)}</StatusMessage> : null}
      <canvas ref={canvas} className="barcode-canvas" role="img" aria-label={t('barcode.alt')} hidden={!made?.runs} />
      {made?.runs ? (
        <div className="editor-actions">
          <Button onClick={png}>{t('qrmaker.png')}</Button>
          <Button variant="secondary" onClick={svg}>{t('qrmaker.svg')}</Button>
        </div>
      ) : null}
      <p className="field-hint">{t('barcode.note')}</p>
    </TextToolShell>
  );
}
