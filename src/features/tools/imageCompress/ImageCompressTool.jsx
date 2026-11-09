// Compress Image screen: makes a picture file smaller by lowering the quality a little (as JPG or WebP).
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { formatSize } from '../../../shared/lib/formatSize.js';
import { canvasToFile, drawImage } from '../../../shared/lib/imageIO.js';
import { usePref } from '../../../shared/lib/usePref.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { imageResult } from '../imageKit/imageResult.js';

const QUALITY = { high: 0.85, medium: 0.7, low: 0.5 };

export default function ImageCompressTool({ tool }) {
  const { t } = useI18n();
  const [level, setLevel] = usePref('imgcompress.level', 'medium');
  const [format, setFormat] = usePref('imgcompress.format', 'jpg');
  const run = async ({ file, image }) => {
    const saved = await canvasToFile(drawImage(image, image.width, image.height, '#ffffff'), format, QUALITY[level]);
    const better = saved.blob.size < file.size;
    return imageResult(file, '-small', better ? saved : { blob: file, ext: file.name.split('.').pop().toLowerCase() }, { noteKey: better ? 'compress.result' : 'compress.nosmaller', noteVars: { before: formatSize(file.size), after: formatSize(Math.min(file.size, saved.blob.size)) } });
  };
  return (
    <ImageEditScreen tool={tool} run={run}>
      <ChoiceGroup legend={t('compress.levelLabel')} value={level} onChange={setLevel} options={['high', 'medium', 'low'].map((v) => ({ value: v, label: t(`imgcompress.${v}`) }))} />
      <ChoiceGroup legend={t('imgconvert.to')} value={format} onChange={setFormat} options={[{ value: 'jpg', label: 'JPG' }, { value: 'webp', label: 'WebP' }]} />
    </ImageEditScreen>
  );
}
