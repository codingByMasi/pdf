// GIF Maker screen: turn several pictures into one animated GIF, with a speed and a size.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { loadImage, makeCanvas } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { coverBox } from '../collage/collageLayout.js';
import { encodeGif } from './encodeGif.js';

export default function GifMakerTool({ tool }) {
  const { t } = useI18n();
  const [delay, setDelay] = usePref('gif.delay', '500');
  const [width, setWidth] = usePref('gif.width', '480');
  const run = async ({ files, onProgress }) => {
    const w = Math.max(40, Math.min(800, Number(width) || 480));
    const first = await loadImage(files[0]);
    const h = Math.round((w * first.height) / first.width);
    URL.revokeObjectURL(first.url);
    const frames = [];
    for (let i = 0; i < files.length; i += 1) {
      const image = await loadImage(files[i]);
      try {
        const canvas = makeCanvas(w, h);
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, w, h);
        const box = coverBox(image.width, image.height, w, h);
        context.drawImage(image.element, box.sx, box.sy, box.sw, box.sh, 0, 0, w, h);
        frames.push(context.getImageData(0, 0, w, h).data);
      } finally {
        URL.revokeObjectURL(image.url);
      }
      onProgress?.((i + 1) / (files.length + 1));
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const bytes = encodeGif(frames, w, h, Math.max(20, Number(delay) || 500));
    return { blob: new Blob([bytes], { type: 'image/gif' }), fileName: 'animation.gif', noteKey: 'gif.done', noteVars: { count: files.length } };
  };
  return (
    <ImageEditScreen tool={tool} run={run} many reorderable canRun>
      <p className="field-hint">{t('gif.hint')}</p>
      <div className="form-fields">
        <TextField label={t('gif.delay')} type="number" inputMode="numeric" min="20" max="5000" value={delay} onChange={(e) => setDelay(e.target.value)} />
        <TextField label={t('gif.width')} type="number" inputMode="numeric" min="40" max="800" value={width} onChange={(e) => setWidth(e.target.value)} />
      </div>
    </ImageEditScreen>
  );
}
