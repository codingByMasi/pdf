// A row of colour choices, each a big round button with a name for screen readers.
import { useId } from 'react';
import { useI18n } from '../../../shared/i18n/useI18n.js';
import { COLORS } from './overlayModel.js';

export function ColorPicker({ value, onChange, names = Object.keys(COLORS) }) {
  const { t } = useI18n();
  const group = useId();
  return (
    <fieldset className="choice-group">
      <legend className="field-label">{t('overlay.color')}</legend>
      <div className="color-row">
        {names.map((name) => (
          <label key={name} className="color-choice">
            <input type="radio" name={group} checked={value === COLORS[name]} onChange={() => onChange(COLORS[name])} />
            <span className="color-dot" style={{ background: COLORS[name] }} />
            <span className="visually-hidden">{t(`overlay.color.${name}`)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
