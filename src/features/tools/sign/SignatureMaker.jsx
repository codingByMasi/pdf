// Lets a person make a signature: draw it, type it, or upload a picture. Calls onReady with the picture.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { StatusMessage } from '../../../shared/ui/StatusMessage.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ColorPicker } from '../overlay/ColorPicker.jsx';
import { COLORS } from '../overlay/overlayModel.js';
import { prepareImage } from '../jpgToPdf/prepareImage.js';
import { SignaturePad } from './SignaturePad.jsx';
import { canvasToSignature, typedSignatureCanvas } from './signatureImage.js';

export function SignatureMaker({ onReady }) {
  const { t } = useI18n();
  const [how, setHow] = useState('draw');
  const [color, setColor] = useState(COLORS.black);
  const [typed, setTyped] = useState('');
  const [canvas, setCanvas] = useState(null);
  const [errorKey, setErrorKey] = useState('');
  const [made, setMade] = useState('');

  async function use() {
    setErrorKey('');
    const source = how === 'type' ? typedSignatureCanvas(typed.trim(), color) : canvas;
    const signature = source ? await canvasToSignature(source) : null;
    if (!signature) {
      setErrorKey('sign.empty');
      return;
    }
    setMade(signature.url);
    onReady(signature);
  }

  async function upload(event) {
    const chosen = event.target.files[0];
    event.target.value = '';
    if (!chosen) return;
    try {
      const { bytes, type } = await prepareImage(chosen);
      const mime = type === 'png' ? 'image/png' : 'image/jpeg';
      const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      const probe = new Image();
      probe.src = url;
      await probe.decode();
      setErrorKey('');
      setMade(url);
      onReady({ bytes, mime, url, aspect: probe.naturalHeight / probe.naturalWidth });
    } catch {
      setErrorKey('error.imageBad');
    }
  }

  return (
    <section className="signature-maker" aria-label={t('sign.heading')}>
      <h3>{t('sign.heading')}</h3>
      <ChoiceGroup
        legend={t('sign.how')}
        value={how}
        onChange={(value) => { setHow(value); setErrorKey(''); }}
        options={[
          { value: 'draw', label: t('sign.draw') },
          { value: 'type', label: t('sign.type') },
          { value: 'upload', label: t('sign.upload') },
        ]}
      />
      {how !== 'upload' ? <ColorPicker value={color} onChange={setColor} names={['black', 'blue']} /> : null}
      {how === 'draw' ? <SignaturePad color={color} onChange={setCanvas} /> : null}
      {how === 'type' ? <TextField label={t('sign.typeLabel')} value={typed} maxLength={40} autoComplete="off" onChange={(event) => setTyped(event.target.value)} /> : null}
      {how === 'upload' ? (
        <label className="field">
          <span className="field-label">{t('sign.uploadLabel')}</span>
          <input className="field-input" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={upload} />
        </label>
      ) : (
        <Button onClick={use}>{t('sign.use')}</Button>
      )}
      {errorKey ? <StatusMessage title={t('error.heading')}>{t(errorKey)}</StatusMessage> : null}
      {made ? (
        <div className="signature-preview">
          <p>{t('sign.ready')}</p>
          <img src={made} alt={t('sign.previewAlt')} />
        </div>
      ) : null}
    </section>
  );
}
