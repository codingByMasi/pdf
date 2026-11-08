// Edit one scanned page: turn it left or right and cut its edges. Shows the page as it will be saved.
import { useEffect, useState } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { CropPreview } from '../crop/CropPreview.jsx';
import { renderScanPage } from './scanPages.js';

export function ScanPageEditor({ file, edit, onChange, position }) {
  const { t } = useI18n();
  const [url, setUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    let made = '';
    renderScanPage(file, { rotation: edit.rotation, maxSide: 800 })
      .then((blob) => {
        if (cancelled) return;
        made = URL.createObjectURL(blob);
        setUrl(made);
      })
      .catch(() => !cancelled && setUrl(''));
    return () => {
      cancelled = true;
      if (made) URL.revokeObjectURL(made);
    };
  }, [file, edit.rotation]);

  const turn = (step) => onChange({ ...edit, rotation: (edit.rotation + step + 360) % 360 });
  return (
    <section className="item-panel" aria-label={t('scan.editing', { n: position })}>
      <h3>{t('scan.editing', { n: position })}</h3>
      <div className="editor-actions">
        <Button variant="secondary" onClick={() => turn(-90)}>{t('scan.turnLeft')}</Button>
        <Button variant="secondary" onClick={() => turn(90)}>{t('scan.turnRight')}</Button>
      </div>
      <CropPreview url={url} cuts={edit.cuts} onChange={(side, value) => onChange({ ...edit, cuts: { ...edit.cuts, [side]: value } })} />
    </section>
  );
}
