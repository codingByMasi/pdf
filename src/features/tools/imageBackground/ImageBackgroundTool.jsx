// Remove Background screen: pick the background colour on the picture, then make that colour see-through (PNG).
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { toHex } from '../imageKit/palette.js';
import { imageResult } from '../imageKit/imageResult.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { removeColour } from './removeColour.js';

const MAX_SIDE = 900;

function Picker({ image, colour, onPick }) {
  const { t } = useI18n();
  const canvas = useRef(null);
  useEffect(() => {
    const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
    const drawn = drawImage(image, image.width * scale, image.height * scale);
    canvas.current.width = drawn.width;
    canvas.current.height = drawn.height;
    const context = canvas.current.getContext('2d', { willReadFrequently: true });
    context.drawImage(drawn, 0, 0);
    onPick([...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]);
  }, [image]); // eslint-disable-line react-hooks/exhaustive-deps
  function pick(event) {
    const box = canvas.current.getBoundingClientRect();
    const x = Math.floor(((event.clientX - box.left) / box.width) * canvas.current.width);
    const y = Math.floor(((event.clientY - box.top) / box.height) * canvas.current.height);
    onPick([...canvas.current.getContext('2d', { willReadFrequently: true }).getImageData(x, y, 1, 1).data.slice(0, 3)]);
  }
  return (
    <>
      <canvas ref={canvas} className="picker-canvas" onClick={pick} role="img" aria-label={t('image.previewAlt')} />
      <div className="swatch"><span className="swatch-colour" style={{ background: toHex(colour) }} aria-hidden="true" /><span className="swatch-text"><strong>{t('imgbg.colour')}</strong> {toHex(colour)}</span></div>
    </>
  );
}

export default function ImageBackgroundTool({ tool }) {
  const { t } = useI18n();
  const [colour, setColour] = useState([255, 255, 255]);
  const [tolerance, setTolerance] = usePref('imgbg.tolerance', '40');
  const [edgeOnly, setEdgeOnly] = usePref('imgbg.edge', '1');
  const run = async ({ file, image }) => {
    const canvas = drawImage(image, image.width, image.height);
    const context = canvas.getContext('2d');
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    removeColour(pixels.data, canvas.width, canvas.height, { colour, tolerance: Math.max(1, Math.min(120, Number(tolerance) || 40)), edgeOnly: edgeOnly === '1' });
    context.putImageData(pixels, 0, 0);
    return imageResult(file, '-no-background', await canvasToFile(canvas, 'png'));
  };
  return (
    <ImageEditScreen tool={tool} run={run}>
      {(image) => (
        <>
          <p className="field-hint">{t('imgbg.hint')}</p>
          <Picker image={image} colour={colour} onPick={setColour} />
          <TextField label={t('imgbg.tolerance')} type="number" inputMode="numeric" min="1" max="120" value={tolerance} onChange={(e) => setTolerance(e.target.value)} />
          <label className="choice"><input type="checkbox" checked={edgeOnly === '1'} onChange={(e) => setEdgeOnly(e.target.checked ? '1' : '0')} /><span>{t('imgbg.edge')}</span></label>
          <p className="field-hint">{t('imgbg.weak')}</p>
        </>
      )}
    </ImageEditScreen>
  );
}
