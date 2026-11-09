// Collage screen: put several pictures side by side or in a grid, with a gap and a background colour.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, loadImage, makeCanvas } from '../../../shared/lib/imageIO.js';
import { outputName } from '../../../shared/lib/outputName.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { LAYOUTS, collageLayout, coverBox } from './collageLayout.js';

const BACKGROUNDS = { white: '#ffffff', black: '#000000', grey: '#e5e7eb' };
const MAX_SIDE = 6000;

export default function CollageTool({ tool }) {
  const { t } = useI18n();
  const [layout, setLayout] = usePref('collage.layout', 'grid2');
  const [gap, setGap] = usePref('collage.gap', '20');
  const [background, setBackground] = usePref('collage.bg', 'white');
  const run = async ({ files, onProgress }) => {
    const gapPx = Math.max(0, Math.min(200, Number(gap) || 0));
    const plan = collageLayout(layout, files.length, gapPx);
    const scale = Math.min(1, MAX_SIDE / Math.max(plan.width, plan.height));
    const canvas = makeCanvas(plan.width * scale, plan.height * scale);
    const context = canvas.getContext('2d');
    context.fillStyle = BACKGROUNDS[background];
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingQuality = 'high';
    for (let i = 0; i < files.length; i += 1) {
      const image = await loadImage(files[i]);
      try {
        const cell = plan.cells[i];
        const box = coverBox(image.width, image.height, cell.w, cell.h);
        context.drawImage(image.element, box.sx, box.sy, box.sw, box.sh, cell.x * scale, cell.y * scale, cell.w * scale, cell.h * scale);
      } finally {
        URL.revokeObjectURL(image.url);
      }
      onProgress?.((i + 1) / files.length);
    }
    const saved = await canvasToFile(canvas, 'jpg', 0.92);
    return { blob: saved.blob, fileName: outputName('collage', '', saved.ext), noteKey: 'collage.done', noteVars: { count: files.length } };
  };
  return (
    <ImageEditScreen tool={tool} run={run} many reorderable canRun>
      <ChoiceGroup chips legend={t('collage.layout')} value={layout} onChange={setLayout} options={LAYOUTS.map((v) => ({ value: v, label: t(`collage.${v}`) }))} />
      <ChoiceGroup chips legend={t('collage.bg')} value={background} onChange={setBackground} options={Object.keys(BACKGROUNDS).map((v) => ({ value: v, label: t(`imgfx.c.${v}`, {}) }))} />
      <TextField label={t('collage.gap')} type="number" inputMode="numeric" min="0" max="200" value={gap} onChange={(e) => setGap(e.target.value)} />
      <p className="field-hint">{t('collage.hint')}</p>
    </ImageEditScreen>
  );
}
