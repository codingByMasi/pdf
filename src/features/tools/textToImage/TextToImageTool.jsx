// Text to Image screen: type or paste text and save it as a PNG picture (good for sharing a quote or note).
import { usePref } from '../../../shared/lib/usePref.js';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { ChoiceGroup } from '../../../shared/ui/ChoiceGroup.jsx';
import TextConvertScreen from '../textConvert/TextConvertScreen.jsx';
import { renderTextImage } from './renderTextImage.js';

const WIDTHS = { small: 720, medium: 1080, large: 1600 };

export default function TextToImageTool({ tool }) {
  const { t } = useI18n();
  const [theme, setTheme] = usePref('textimage.theme', 'white');
  const [width, setWidth] = usePref('textimage.width', 'medium');

  const prepare = async (text) => {
    const { canvas, cut } = renderTextImage(text, { width: WIDTHS[width], size: Math.round(WIDTHS[width] / 27), theme });
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw Object.assign(new Error('too big'), { errorKey: 'error.tooBig' });
    return { result: { blob, fileName: 'text.png', ...(cut ? { noteKey: 'textImage.cut' } : {}) } };
  };

  return (
    <TextConvertScreen tool={tool} prepare={prepare}>
      <ChoiceGroup legend={t('textImage.width')} value={width} onChange={setWidth} options={['small', 'medium', 'large'].map((v) => ({ value: v, label: t(`textImage.${v}`) }))} />
      <ChoiceGroup legend={t('textImage.theme')} value={theme} onChange={setTheme} options={['white', 'dark', 'note'].map((v) => ({ value: v, label: t(`textImage.${v}`) }))} />
    </TextConvertScreen>
  );
}
