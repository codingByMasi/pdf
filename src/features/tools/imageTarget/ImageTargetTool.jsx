// Image to Size screen: makes a picture file no bigger than a size you type (for example 50 KB), as JPG.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { formatSize } from '../../../shared/lib/formatSize.js';
import { canvasToFile, drawImage } from '../../../shared/lib/imageIO.js';
import { TextField } from '../../../shared/ui/TextField.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { fitToSize } from '../imageKit/fitToSize.js';
import { imageResult } from '../imageKit/imageResult.js';

export default function ImageTargetTool({ tool }) {
  const { t } = useI18n();
  const [kb, setKb] = useState('50');
  const wanted = Math.round(Number(kb) * 1024);
  const run = async ({ file, image, onProgress }) => {
    const encode = async (scale, quality) => (await canvasToFile(drawImage(image, image.width * scale, image.height * scale, '#ffffff'), 'jpg', quality)).blob;
    const result = await fitToSize(encode, wanted, onProgress);
    const vars = { after: formatSize(result.blob.size), target: formatSize(wanted) };
    return imageResult(file, '-small', { blob: result.blob, ext: 'jpg' }, { noteKey: result.met ? 'imgtarget.met' : 'imgtarget.notMet', noteVars: vars });
  };
  return (
    <ImageEditScreen tool={tool} run={run} canRun={wanted >= 2048}>
      <TextField label={t('imgtarget.size')} hint={t('imgtarget.hint')} type="number" inputMode="numeric" min="2" value={kb} onChange={(e) => setKb(e.target.value)} />
    </ImageEditScreen>
  );
}
