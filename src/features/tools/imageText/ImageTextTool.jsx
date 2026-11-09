// Add Text to Image screen: write a caption or watermark, choose where, how big and how see-through.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage, formatOf } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { imageResult, keepFormat } from '../imageKit/imageResult.js';
import { SPOTS, paintText } from './paintText.js';

const COLOURS = { white: '#ffffff', black: '#000000', red: '#dc2626', yellow: '#facc15', blue: '#2563eb' };

export default function ImageTextTool({ tool }) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [spot, setSpot] = usePref('imgtext.spot', 'br');
  const [size, setSize] = usePref('imgtext.size', '6');
  const [opacity, setOpacity] = usePref('imgtext.opacity', '70');
  const [colour, setColour] = usePref('imgtext.colour', 'white');
  const run = async ({ file, image }) => {
    const format = keepFormat(formatOf(file));
    const canvas = drawImage(image, image.width, image.height, format === 'jpg' ? '#ffffff' : null);
    paintText(canvas, { text, sizePercent: Math.max(1, Math.min(40, Number(size) || 6)), colour: COLOURS[colour], opacity: (Number(opacity) || 70) / 100, spot });
    return imageResult(file, '-text', await canvasToFile(canvas, format, 0.92));
  };
  return (
    <ImageEditScreen tool={tool} run={run} canRun={text.trim().length > 0}>
      {() => (
        <>
          <TextField label={t('imgtext.text')} multiline value={text} onChange={(e) => setText(e.target.value)} hint={t('imgtext.hint')} />
          <ChoiceGroup chips legend={t('imgtext.spot')} value={spot} onChange={setSpot} options={SPOTS.map((v) => ({ value: v, label: t(`imgtext.spot.${v}`) }))} />
          <ChoiceGroup chips legend={t('imgtext.colour')} value={colour} onChange={setColour} options={Object.keys(COLOURS).map((v) => ({ value: v, label: t(`imgtext.c.${v}`) }))} />
          <div className="form-fields">
            <TextField label={t('imgtext.size')} type="number" inputMode="numeric" min="1" max="40" value={size} onChange={(e) => setSize(e.target.value)} />
            <TextField label={t('imgtext.opacity')} type="number" inputMode="numeric" min="5" max="100" value={opacity} onChange={(e) => setOpacity(e.target.value)} />
          </div>
        </>
      )}
    </ImageEditScreen>
  );
}
