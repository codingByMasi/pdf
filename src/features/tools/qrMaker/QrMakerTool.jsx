// QR Code Maker screen: type a link or text, see the code, download it as PNG or SVG.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { makeQr } from '../../../shared/lib/qr/qrMatrix.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { TextToolShell } from '../textKit/TextToolShell.jsx';
import { saveBlob } from '../textKit/saveBlob.js';
import { drawQr, qrToSvg } from './qrImage.js';

const COLOURS = { black: '#000000', blue: '#1d4ed8', green: '#15803d', red: '#b91c1c' };

export default function QrMakerTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [level, setLevel] = usePref('qrmaker.level', 'M');
  const [colour, setColour] = usePref('qrmaker.colour', 'black');
  const canvas = useRef(null);
  const made = useMemo(() => {
    if (!text.trim()) return null;
    try {
      return { grid: makeQr(text, level) };
    } catch (error) {
      return { errorKey: error.errorKey ?? 'error.qrTooLong' };
    }
  }, [text, level]);
  useEffect(() => {
    if (made?.grid && canvas.current) drawQr(canvas.current, made.grid, 480, { dark: COLOURS[colour] });
  }, [made, colour]);
  const png = () => canvas.current && drawQr(canvas.current, made.grid, 1200, { dark: COLOURS[colour] }).toBlob((blob) => {
    saveBlob(blob, 'qr-code.png');
    drawQr(canvas.current, made.grid, 480, { dark: COLOURS[colour] });
  }, 'image/png');
  return (
    <TextToolShell>
      <TextField label={t('qrmaker.text')} multiline rows={4} value={text} onChange={(e) => setText(e.target.value)} hint={t('qrmaker.hint')} />
      <ChoiceGroup chips legend={t('qrmaker.level')} value={level} onChange={setLevel} options={['L', 'M', 'Q', 'H'].map((v) => ({ value: v, label: t(`qrmaker.level.${v}`) }))} />
      <ChoiceGroup chips legend={t('qrmaker.colour')} value={colour} onChange={setColour} options={Object.keys(COLOURS).map((v) => ({ value: v, label: t(`qrmaker.c.${v}`) }))} />
      {made?.errorKey ? <StatusMessage title={t('error.heading')}>{t(made.errorKey)}</StatusMessage> : null}
      {made?.grid ? (
        <>
          <canvas ref={canvas} className="picker-canvas qr-canvas" role="img" aria-label={t('qrmaker.alt')} />
          <div className="editor-actions">
            <Button onClick={png}>{t('qrmaker.png')}</Button>
            <Button variant="secondary" onClick={() => saveBlob(new Blob([qrToSvg(made.grid, { dark: COLOURS[colour] })], { type: 'image/svg+xml' }), 'qr-code.svg')}>{t('qrmaker.svg')}</Button>
          </div>
          <p className="field-hint">{t('qrmaker.test')}</p>
        </>
      ) : null}
    </TextToolShell>
  );
}
