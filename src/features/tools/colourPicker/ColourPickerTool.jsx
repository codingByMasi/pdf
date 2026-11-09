// Colour Picker screen: tap a picture to get the colour's code, and see the main colours of the picture.
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { drawImage } from '../../../shared/lib/imageIO.js';
import { useImage } from '../../../shared/lib/useImage.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ToolWorkspace } from '../ToolWorkspace.jsx';
import { useFileSelection } from '../useFileSelection.js';
import { dominantColours, toHex, toHsl } from '../imageKit/palette.js';
import { usePdfJob } from '../../../shared/lib/usePdfJob.js';

const MAX_SIDE = 900;

function Swatch({ colour, label }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const hex = toHex(colour);
  async function copy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className="swatch">
      <span className="swatch-colour" style={{ background: hex }} aria-hidden="true" />
      <span className="swatch-text"><strong>{label ?? hex}</strong><br />rgb({colour.join(', ')}) · hsl({toHsl(colour)[0]}, {toHsl(colour)[1]}%, {toHsl(colour)[2]}%)</span>
      <Button variant="secondary" onClick={copy}>{copied ? t('base64.copied') : t('picker.copy', { hex })}</Button>
    </div>
  );
}

export default function ColourPickerTool({ tool }) {
  const { t } = useI18n();
  const selection = useFileSelection(tool);
  const job = usePdfJob();
  const file = selection.items[0]?.file;
  const image = useImage(file);
  const canvas = useRef(null);
  const [picked, setPicked] = useState(null);
  const [main, setMain] = useState([]);

  useEffect(() => {
    if (image.status !== 'ready' || !canvas.current) return;
    const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
    const drawn = drawImage(image, image.width * scale, image.height * scale);
    canvas.current.width = drawn.width;
    canvas.current.height = drawn.height;
    const context = canvas.current.getContext('2d', { willReadFrequently: true });
    context.drawImage(drawn, 0, 0);
    setMain(dominantColours(context.getImageData(0, 0, drawn.width, drawn.height).data, 6));
    setPicked(null);
  }, [image]);

  function pick(event) {
    const box = canvas.current.getBoundingClientRect();
    const x = Math.floor(((event.clientX - box.left) / box.width) * canvas.current.width);
    const y = Math.floor(((event.clientY - box.top) / box.height) * canvas.current.height);
    const [r, g, b, a] = canvas.current.getContext('2d', { willReadFrequently: true }).getImageData(x, y, 1, 1).data;
    if (a > 0) setPicked([r, g, b]);
  }

  return (
    <ToolWorkspace tool={tool} selection={selection} job={job} error={{ key: image.errorKey }} hasFiles={Boolean(file) && image.status !== 'error'}>
      <p className="field-hint">{t('picker.hint')}</p>
      <canvas ref={canvas} className="picker-canvas" onClick={pick} role="img" aria-label={t('image.previewAlt')} />
      {picked ? <Swatch colour={picked} label={t('picker.chosen')} /> : null}
      {main.length ? <h3>{t('picker.main')}</h3> : null}
      {main.map((colour) => <Swatch key={toHex(colour)} colour={colour} />)}
    </ToolWorkspace>
  );
}
