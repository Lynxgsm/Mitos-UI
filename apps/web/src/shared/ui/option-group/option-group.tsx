export type OptionItem = { id: string; label: string; swatch?: string };

// Native radio group styled as chips: arrow keys, focus and form semantics come from the browser.
export function OptionGroup(props: {
  legend: string;
  name: string;
  options: OptionItem[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="option-group">
      <legend>{props.legend}</legend>
      <div className="option-group-options">
        {props.options.map((option) => (
          <label key={option.id} className="option-group-option">
            <input
              type="radio"
              name={props.name}
              value={option.id}
              className="visually-hidden"
              checked={option.id === props.value}
              onChange={() => props.onChange(option.id)}
            />
            {option.swatch && (
              <span aria-hidden="true" className="option-group-swatch" style={{ background: option.swatch }} />
            )}
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
