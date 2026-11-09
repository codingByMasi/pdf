// Blur or Hide Parts screen: drag boxes over faces or numbers and cover them with blocks or black.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage, formatOf } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import { rectToPixels } from '../imageCrop/cropRect.js';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { RegionPicker } from '../imageKit/RegionPicker.jsx';
import { imageResult, keepFormat } from '../imageKit/imageResult.js';
import { hideParts } from './pixelate.js';

export default function ImageBlurTool({ tool }) {
  const { t } = useI18n();
  const [rects, setRects] = useState([]);
  const [mode, setMode] = usePref('imgblur.mode', 'pixel');
  const run = async ({ file, image }) => {
    const format = keepFormat(formatOf(file));
    const canvas = drawImage(image, image.width, image.height, format === 'jpg' ? '#ffffff' : null);
    hideParts(canvas, rects.map((r) => rectToPixels(r, image.width, image.height)), mode);
    return imageResult(file, '-hidden', await canvasToFile(canvas, format, 0.92), { noteKey: 'imgblur.done' });
  };
  return (
    <ImageEditScreen tool={tool} run={run} canRun={rects.length > 0}>
      {(image) => (
        <>
          <p className="field-hint">{t('imgblur.hint')}</p>
          <RegionPicker url={image.url} alt={t('image.previewAlt')} rects={rects} onChange={setRects} />
          <ChoiceGroup legend={t('imgblur.mode')} value={mode} onChange={setMode} options={[{ value: 'pixel', label: t('imgblur.pixel') }, { value: 'black', label: t('imgblur.black') }]} />
          <div className="editor-actions">
            <Button variant="secondary" disabled={rects.length === 0} onClick={() => setRects(rects.slice(0, -1))}>{t('overlay.undo')}</Button>
            <Button variant="secondary" disabled={rects.length === 0} onClick={() => setRects([])}>{t('imgcrop.clear')}</Button>
          </div>
        </>
      )}
    </ImageEditScreen>
  );
}
