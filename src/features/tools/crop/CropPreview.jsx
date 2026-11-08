// Shows page 1 with the parts that will be cut shaded, and four sliders to choose how much to cut.
import { useId } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { MAX_CUT } from './cropPdf.js';

const SIDES = ['top', 'bottom', 'left', 'right'];

function Slider({ side, value, onChange }) {
  const { t } = useI18n();
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{t(`crop.${side}`, { value })}</label>
      <input id={id} className="crop-slider" type="range" min="0" max={MAX_CUT} step="1" value={value} onChange={(event) => onChange(side, Number(event.target.value))} />
    </div>
  );
}

export function CropPreview({ url, cuts, onChange }) {
  const { t } = useI18n();
  return (
    <div className="crop-area">
      <div className="crop-preview">
        {url ? <img className="crop-image" src={url} alt={t('crop.previewAlt')} /> : <p className="crop-wait">{t('progress.wait')}</p>}
        <div className="crop-shade" style={{ top: 0, left: 0, right: 0, height: `${cuts.top}%` }} />
        <div className="crop-shade" style={{ bottom: 0, left: 0, right: 0, height: `${cuts.bottom}%` }} />
        <div className="crop-shade" style={{ top: `${cuts.top}%`, bottom: `${cuts.bottom}%`, left: 0, width: `${cuts.left}%` }} />
        <div className="crop-shade" style={{ top: `${cuts.top}%`, bottom: `${cuts.bottom}%`, right: 0, width: `${cuts.right}%` }} />
      </div>
      <div className="crop-sliders">
        {SIDES.map((side) => <Slider key={side} side={side} value={cuts[side]} onChange={onChange} />)}
      </div>
    </div>
  );
}
