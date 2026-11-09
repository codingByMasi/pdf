// A small bar with zoom out, current percent, and zoom in buttons for the page editor.
import { useI18n } from '../i18n/useI18n.js';

export const ZOOM_STEPS = [50, 75, 100, 150, 200, 300];

export function ZoomBar({ zoom, onChange }) {
  const { t } = useI18n();
  const at = ZOOM_STEPS.indexOf(zoom);
  return (
    <div className="zoom-bar" role="group" aria-label={t('reader.zoom')}>
      <button type="button" className="zoom-button" disabled={at <= 0} aria-label={t('zoom.out')} onClick={() => onChange(ZOOM_STEPS[at - 1])}>−</button>
      <button type="button" className="zoom-value" aria-label={t('zoom.reset')} onClick={() => onChange(100)}>{zoom}%</button>
      <button type="button" className="zoom-button" disabled={at >= ZOOM_STEPS.length - 1} aria-label={t('zoom.in')} onClick={() => onChange(ZOOM_STEPS[at + 1])}>+</button>
    </div>
  );
}
