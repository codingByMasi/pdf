// Text box with a label that is always visible.
import { useId } from 'react';

export function TextField({ label, hint, type = 'text', multiline = false, ...rest }) {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} className="field-input field-area" rows={6} aria-describedby={hint ? `${id}-hint` : undefined} {...rest} />
      ) : (
        <input id={id} className="field-input" type={type} aria-describedby={hint ? `${id}-hint` : undefined} {...rest} />
      )}
      {hint ? <p id={`${id}-hint`} className="field-hint">{hint}</p> : null}
    </div>
  );
}
