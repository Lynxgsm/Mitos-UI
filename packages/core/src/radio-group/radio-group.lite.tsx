import { For, onMount, onUpdate, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <fieldset>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "legend", "options", "name", "value", "defaultValue", "description", "error", "required", "disabled", "id", "class",
];

export type RadioOption = { value: string; label: any; disabled?: boolean };

export type RadioGroupProps = {
  legend: any;
  options: RadioOption[];
  // shared by the radios: groups them for the arrow keys and the form data
  name: string;
  // controlled selection: update it from onChange; without it the group keeps its own state from defaultValue
  value?: string;
  defaultValue?: string;
  description?: any;
  error?: any;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <fieldset>; change events bubble up from the radios
  onChange?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  group: {
    display: "grid",
    gap: "0.5rem",
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderStyle: "none",
  },
  legend: { padding: 0, marginBottom: "0.25rem" },
  // drawn the same in every browser; forced colors mode gets the native radio back
  radio: {
    appearance: { default: "none", "@media (forced-colors: active)": "auto" },
    flexShrink: 0,
    boxSizing: "border-box",
    width: "1rem",
    height: "1rem",
    margin: 0,
    borderWidth: 1,
    borderStyle: "solid",
    // --omni-input reaches 3:1 against the page: the empty circle stays visible (WCAG 1.4.11)
    borderColor: { default: colors["--omni-input"], ":checked": colors["--omni-primary"] },
    borderRadius: "9999px",
    backgroundColor: colors["--omni-background"],
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    backgroundImage: {
      default: "none",
      ":checked": `radial-gradient(circle, ${colors["--omni-primary"]} 0 calc(0.25rem - 0.5px), transparent 0.25rem)`,
      "@media (forced-colors: active)": "none",
    },
  },
});

export default function RadioGroup(props: RadioGroupProps) {
  const groupRef = useRef<HTMLFieldSetElement>(null);

  const state = useStore({
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    partId(part: string) {
      const base = props.id ?? state.generatedId;
      return base ? `${base}-${part}` : undefined;
    },
    // checks the radio of the given value, unchecks the others
    sync(value: string) {
      if (!groupRef) return;
      for (const radio of Array.from(groupRef.querySelectorAll("input"))) radio.checked = radio.value === value;
    },
    get describedBy() {
      const ids = [props.error && state.partId("error"), props.description && state.partId("description")];
      return ids.filter(Boolean).join(" ") || undefined;
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `omni-radio-group-${Math.random().toString(36).slice(2, 10)}`;
  });

  // controlled: the checked radio follows value (the first render already does, through defaultChecked)
  onUpdate(() => {
    if (props.value !== undefined) state.sync(props.value);
  }, [props.value]);

  // radiogroup role on the fieldset: it keeps the legend as name and allows aria-invalid and aria-required
  return (
    <fieldset
      {...state.attributes}
      ref={groupRef}
      id={props.id}
      role="radiogroup"
      disabled={props.disabled}
      aria-invalid={props.error ? true : undefined}
      aria-required={props.required ? true : undefined}
      aria-describedby={state.describedBy}
      class={clsx(stylex.props(styles.group).className, props.class)}
      onChange={(event) => {
        props.onChange?.(event);
        // controlled: undo the click until the parent passes the new value (a refused change stays undone)
        if (props.value !== undefined) state.sync(props.value);
      }}
    >
      <legend class={stylex.props(field.label, styles.legend).className}>
        {props.legend}
        {props.required && (
          <span aria-hidden="true" class={stylex.props(field.required).className}>
            {" *"}
          </span>
        )}
      </legend>
      {props.description && (
        <p id={state.partId("description")} class={stylex.props(field.description).className}>
          {props.description}
        </p>
      )}
      <For each={props.options}>
        {(option) => (
          <label key={option.value} class={stylex.props(field.inline).className}>
            <input
              type="radio"
              name={props.name}
              value={option.value}
              defaultChecked={option.value === (props.value ?? props.defaultValue)}
              required={props.required}
              disabled={option.disabled}
              class={stylex.props(styles.radio, field.focusRing).className}
            />
            <span>{option.label}</span>
          </label>
        )}
      </For>
      {props.error && (
        <p id={state.partId("error")} class={stylex.props(field.error).className}>
          {props.error}
        </p>
      )}
    </fieldset>
  );
}
