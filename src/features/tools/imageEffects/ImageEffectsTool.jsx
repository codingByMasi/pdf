// Image Look screen: black and white, grey or sepia, plus an optional coloured border.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage, formatOf, makeCanvas } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { grayInPlace } from '../grayscale/grayPixels.js';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { imageResult, keepFormat } from '../imageKit/imageResult.js';

const COLOURS = { white: '#ffffff', black: '#000000', grey: '#9ca3af', red: '#b91c1c', blue: '#1d4ed8' };

function sepiaInPlace(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i] = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
    data[i + 1] = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
    data[i + 2] = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);
  }
}

export default function ImageEffectsTool({ tool }) {
  const { t } = useI18n();
  const [effect, setEffect] = usePref('imgfx.effect', 'gray');
  const [border, setBorder] = usePref('imgfx.border', '0');
  const [colour, setColour] = usePref('imgfx.colour', 'white');
  const run = async ({ file, image }) => {
    const format = keepFormat(formatOf(file));
    const base = drawImage(image, image.width, image.height, format === 'jpg' ? '#ffffff' : null);
    if (effect !== 'none') {
      const context = base.getContext('2d');
      const pixels = context.getImageData(0, 0, base.width, base.height);
      if (effect === 'sepia') sepiaInPlace(pixels.data);
      else grayInPlace(pixels.data, effect === 'bw' ? 140 : null);
      context.putImageData(pixels, 0, 0);
    }
    const width = Math.round((Number(border) / 100) * Math.max(image.width, image.height));
    let out = base;
    if (width > 0) {
      out = makeCanvas(base.width + width * 2, base.height + width * 2);
      const context = out.getContext('2d');
      context.fillStyle = COLOURS[colour];
      context.fillRect(0, 0, out.width, out.height);
      context.drawImage(base, width, width);
    }
    return imageResult(file, '-look', await canvasToFile(out, format, 0.92));
  };
  return (
    <ImageEditScreen tool={tool} run={run} canRun={effect !== 'none' || Number(border) > 0}>
      <ChoiceGroup legend={t('imgfx.effect')} value={effect} onChange={setEffect} options={['none', 'gray', 'bw', 'sepia'].map((v) => ({ value: v, label: t(`imgfx.${v}`) }))} />
      <ChoiceGroup legend={t('imgfx.border')} value={border} onChange={setBorder} options={['0', '2', '5', '10'].map((v) => ({ value: v, label: v === '0' ? t('imgfx.noBorder') : `${v}%` }))} />
      {Number(border) > 0 ? <ChoiceGroup chips legend={t('imgfx.colour')} value={colour} onChange={setColour} options={Object.keys(COLOURS).map((v) => ({ value: v, label: t(`imgfx.c.${v}`) }))} /> : null}
    </ImageEditScreen>
  );
}
