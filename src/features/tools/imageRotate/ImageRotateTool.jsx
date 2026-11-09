// Rotate and Flip Image screen: turn a picture left or right, or mirror it, with a live preview.
import { useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { canvasToFile, formatOf, makeCanvas } from '../../../shared/lib/imageIO.js';
import { Button } from '../../../shared/ui/Button.jsx';
import ImageEditScreen from '../imageKit/ImageEditScreen.jsx';
import { imageResult, keepFormat } from '../imageKit/imageResult.js';

export default function ImageRotateTool({ tool }) {
  const { t } = useI18n();
  const [turn, setTurn] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const run = async ({ file, image }) => {
    const sideways = turn % 180 !== 0;
    const canvas = makeCanvas(sideways ? image.height : image.width, sideways ? image.width : image.height);
    const context = canvas.getContext('2d');
    const format = keepFormat(formatOf(file));
    if (format === 'jpg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((turn * Math.PI) / 180);
    context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    context.drawImage(image.element, -image.width / 2, -image.height / 2);
    return imageResult(file, '-turned', await canvasToFile(canvas, format, 0.92));
  };
  return (
    <ImageEditScreen tool={tool} run={run} canRun={turn !== 0 || flipX || flipY}>
      {(image) => (
        <>
          <div className="image-preview"><img src={image.url} alt={t('image.previewAlt')} style={{ transform: `rotate(${turn}deg) scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`, maxHeight: turn % 180 ? '14rem' : '20rem' }} /></div>
          <div className="editor-actions">
            <Button variant="secondary" onClick={() => setTurn((turn + 270) % 360)}>⟲ {t('imgrotate.left')}</Button>
            <Button variant="secondary" onClick={() => setTurn((turn + 90) % 360)}>⟳ {t('imgrotate.right')}</Button>
            <Button variant="secondary" onClick={() => setFlipX(!flipX)}>↔ {t('imgrotate.flipX')}</Button>
            <Button variant="secondary" onClick={() => setFlipY(!flipY)}>↕ {t('imgrotate.flipY')}</Button>
          </div>
        </>
      )}
    </ImageEditScreen>
  );
}
