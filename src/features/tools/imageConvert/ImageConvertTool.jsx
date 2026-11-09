// Convert Image screen: save a picture as PNG, JPG or WebP.
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, drawImage } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { imageResult } from '../imageKit/imageResult.js';

export default function ImageConvertTool({ tool }) {
  const { t } = useI18n();
  const [format, setFormat] = usePref('imgconvert.to', 'png');
  const run = async ({ file, image }) => {
    const saved = await canvasToFile(drawImage(image, image.width, image.height, format === 'jpg' ? '#ffffff' : null), format, 0.92);
    return imageResult(file, '', saved, saved.format !== format ? { noteKey: 'image.noWebp' } : {});
  };
  return (
    <ImageEditScreen tool={tool} run={run}>
      <ChoiceGroup legend={t('imgconvert.to')} value={format} onChange={setFormat} options={[{ value: 'png', label: 'PNG' }, { value: 'jpg', label: 'JPG' }, { value: 'webp', label: 'WebP' }]} />
      {format === 'jpg' ? <p className="field-hint">{t('imgconvert.jpgNote')}</p> : null}
    </ImageEditScreen>
  );
}
