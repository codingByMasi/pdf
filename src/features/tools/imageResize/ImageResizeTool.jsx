// Resize Image screen: change the size by percent, width, height, or exact sides.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage, formatOf } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { imageResult, keepFormat } from '../imageKit/imageResult.js';
import { resizeDims } from '../imageKit/resizeDims.js';

export default function ImageResizeTool({ tool }) {
  const { t } = useI18n();
  const [mode, setMode] = usePref('resize.mode', 'percent');
  const [percent, setPercent] = useState('50');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const dims = (image) => resizeDims(image.width, image.height, { mode, percent: Number(percent), newWidth: Number(width), newHeight: Number(height) });
  const run = async ({ file, image }) => {
    const { width: w, height: h } = dims(image);
    const format = keepFormat(formatOf(file));
    const saved = await canvasToFile(drawImage(image, w, h, format === 'jpg' ? '#ffffff' : null), format, 0.92);
    return imageResult(file, `-${w}x${h}`, saved, { noteKey: 'image.resized', noteVars: { width: w, height: h } });
  };
  const valid = mode === 'percent' ? Number(percent) > 0 && Number(percent) <= 400 : mode === 'width' ? Number(width) > 0 : mode === 'height' ? Number(height) > 0 : Number(width) > 0 && Number(height) > 0;
  return (
    <ImageEditScreen tool={tool} run={run} canRun={valid}>
      {(image) => (
        <>
          <ChoiceGroup legend={t('resize.how')} value={mode} onChange={setMode} options={['percent', 'width', 'height', 'exact'].map((v) => ({ value: v, label: t(`imgresize.${v}`) }))} />
          {mode === 'percent' ? <TextField label={t('imgresize.percentLabel')} type="number" inputMode="numeric" min="1" max="400" value={percent} onChange={(e) => setPercent(e.target.value)} /> : null}
          {mode !== 'percent' && mode !== 'height' ? <TextField label={t('imgresize.widthLabel')} type="number" inputMode="numeric" min="1" value={width} onChange={(e) => setWidth(e.target.value)} /> : null}
          {mode === 'height' || mode === 'exact' ? <TextField label={t('imgresize.heightLabel')} type="number" inputMode="numeric" min="1" value={height} onChange={(e) => setHeight(e.target.value)} /> : null}
          {valid ? <p className="field-hint">{t('imgresize.result', dims(image))}</p> : null}
        </>
      )}
    </ImageEditScreen>
  );
}
