// Group of big radio buttons with a visible question above them. chips: show them as a row of tool chips.
import { useId } from 'react';

export function ChoiceGroup({ legend, options, value, onChange, chips = false }) {
  const name = useId();
  return (
    <fieldset className={`choice-group${chips ? ' choice-chips' : ''}`}>
      <legend className="field-label">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} className="choice">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
