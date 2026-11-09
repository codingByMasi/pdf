// Signature from a photo screen: makes the paper see-through and saves the signature as a PNG to use in Sign PDF.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { imageResult } from '../imageKit/imageResult.js';
import { cleanSignature } from './cleanSignature.js';

export default function SignaturePhotoTool({ tool }) {
  const { t } = useI18n();
  const [tolerance, setTolerance] = usePref('sigphoto.tolerance', '40');
  const [ink, setInk] = usePref('sigphoto.ink', 'keep');
  const run = async ({ file, image }) => {
    const canvas = drawImage(image, image.width, image.height);
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const box = cleanSignature(pixels.data, canvas.width, canvas.height, { tolerance: Math.max(5, Math.min(120, Number(tolerance) || 40)), ink });
    if (!box) throw Object.assign(new Error('no ink'), { errorKey: 'sigphoto.noInk' });
    context.putImageData(pixels, 0, 0);
    const pad = Math.round(Math.max(box.width, box.height) * 0.04);
    const x = Math.max(0, box.x - pad), y = Math.max(0, box.y - pad);
    const w = Math.min(canvas.width - x, box.width + 2 * pad), h = Math.min(canvas.height - y, box.height + 2 * pad);
    const out = document.createElement('canvas');
    out.width = w;
    out.height = h;
    out.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);
    return imageResult(file, '-signature', await canvasToFile(out, 'png'), { noteKey: 'sigphoto.next' });
  };
  return (
    <ImageEditScreen tool={tool} run={run}>
      {() => (
        <>
          <p className="field-hint">{t('sigphoto.hint')}</p>
          <ChoiceGroup legend={t('sigphoto.ink')} value={ink} onChange={setInk} options={['keep', 'black', 'blue'].map((v) => ({ value: v, label: t(`sigphoto.ink.${v}`) }))} />
          <TextField label={t('imgbg.tolerance')} type="number" inputMode="numeric" min="5" max="120" value={tolerance} onChange={(e) => setTolerance(e.target.value)} />
        </>
      )}
    </ImageEditScreen>
  );
}
