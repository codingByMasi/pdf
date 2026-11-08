// Text box with a label that is always visible.
import { useId } from 'react';

export function TextField({ label, hint, type = 'text', ...rest }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <input id={id} className="field-input" type={type} aria-describedby={hint ? `${id}-hint` : undefined} {...rest} />
      {hint ? <p id={`${id}-hint`} className="field-hint">{hint}</p> : null}
    </div>
  );
}
