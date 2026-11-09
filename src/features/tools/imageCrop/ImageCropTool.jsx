// Crop Image screen: drag a box on the picture (or type margins), then save just that part.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, formatOf, makeCanvas } from '../../../shared/lib/imageIO.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { RegionPicker } from '../imageKit/RegionPicker.jsx';
import { imageResult, keepFormat } from '../imageKit/imageResult.js';
import { marginsToRect, rectToMargins, rectToPixels } from './cropRect.js';

const SHAPES = { free: null, square: 1, '4:3': 4 / 3, '3:4': 3 / 4, '16:9': 16 / 9 };

export default function ImageCropTool({ tool }) {
  const { t } = useI18n();
  const [rects, setRects] = useState([]);
  const [shape, setShape] = useState('free');
  const rect = rects[0];
  const margins = rect ? rectToMargins(rect) : { left: 0, top: 0, right: 0, bottom: 0 };
  const setMargin = (name, value) => {
    const next = marginsToRect({ ...margins, [name]: Math.max(0, Math.min(99, Number(value) || 0)) });
    if (next) setRects([next]);
  };
  const run = async ({ file, image }) => {
    const box = rectToPixels(rect, image.width, image.height);
    const canvas = makeCanvas(box.w, box.h);
    const context = canvas.getContext('2d');
    const format = keepFormat(formatOf(file));
    if (format === 'jpg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, box.w, box.h);
    }
    context.drawImage(image.element, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h);
    return imageResult(file, '-cropped', await canvasToFile(canvas, format, 0.92), { noteKey: 'image.resized', noteVars: { width: box.w, height: box.h } });
  };
  return (
    <ImageEditScreen tool={tool} run={run} canRun={Boolean(rect)}>
      {(image) => (
        <>
          <p className="field-hint">{t('imgcrop.hint')}</p>
          <ChoiceGroup chips legend={t('imgcrop.shape')} value={shape} onChange={(v) => { setShape(v); setRects([]); }} options={Object.keys(SHAPES).map((v) => ({ value: v, label: t(`imgcrop.${v}`) }))} />
          <RegionPicker url={image.url} alt={t('image.previewAlt')} rects={rects} onChange={setRects} single aspect={SHAPES[shape]} imageWidth={image.width} imageHeight={image.height} />
          <div className="form-fields">
            {['left', 'top', 'right', 'bottom'].map((name) => (
              <TextField key={name} label={t(`imgcrop.m.${name}`)} type="number" inputMode="numeric" min="0" max="99" value={String(margins[name])} onChange={(e) => setMargin(name, e.target.value)} />
            ))}
          </div>
          <Button variant="secondary" disabled={!rect} onClick={() => setRects([])}>{t('imgcrop.clear')}</Button>
        </>
      )}
    </ImageEditScreen>
  );
}
