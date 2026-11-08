// Controls for the selected thing: change text, size and colour, nudge it, or delete it.
import { useId } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { Button } from '../../../shared/ui/Button.jsx';
import { TextField } from '../../../shared/ui/TextField.jsx';
import { ColorPicker } from './ColorPicker.jsx';
import { moveWithin, resizeItem } from './overlayModel.js';

const NUDGE = 0.01;

export function ItemPanel({ item, height, onChange, onRemove }) {
  const { t } = useI18n();
  const sliderId = useId();
  const isText = item.type === 'text';
  const sized = ['text', 'image', 'rect', 'ellipse'].includes(item.type);
  const value = isText ? item.size : item.w;
  const nudge = (dx, dy) => onChange(moveWithin(item, dx, dy, height));

  return (
    <section className="item-panel" aria-label={t('overlay.selected')}>
      <h3>{t('overlay.selected')}</h3>
      {isText ? (
        <TextField multiline label={t('overlay.textLabel')} value={item.text} onChange={(event) => onChange({ ...item, text: event.target.value })} />
      ) : null}
      {isText || item.type === 'path' || item.type === 'line' ? (
        <ColorPicker value={item.color} onChange={(color) => onChange({ ...item, color })} />
      ) : null}
      {sized ? (
        <div className="field">
          <label className="field-label" htmlFor={sliderId}>{t(isText ? 'overlay.textSize' : 'overlay.width')}</label>
          <input
            id={sliderId}
            className="crop-slider"
            type="range"
            min={isText ? 0.015 : 0.03}
            max={isText ? 0.15 : 1}
            step="0.005"
            value={value}
            onChange={(event) => onChange(resizeItem(item, Number(event.target.value), item.type === 'image' ? item.h / item.w : 1))}
          />
        </div>
      ) : null}
      <div className="nudge" role="group" aria-label={t('overlay.move')}>
        <Button variant="secondary" aria-label={t('overlay.up')} onClick={() => nudge(0, -NUDGE)}>↑</Button>
        <Button variant="secondary" aria-label={t('overlay.left')} onClick={() => nudge(-NUDGE, 0)}>←</Button>
        <Button variant="secondary" aria-label={t('overlay.down')} onClick={() => nudge(0, NUDGE)}>↓</Button>
        <Button variant="secondary" aria-label={t('overlay.right')} onClick={() => nudge(NUDGE, 0)}>→</Button>
      </div>
      <Button variant="secondary" onClick={onRemove}>{t('overlay.remove')}</Button>
    </section>
  );
}
