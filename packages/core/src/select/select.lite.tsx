import { For, onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <select>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "hideLabel", "startIcon", "options", "placeholder", "description", "error", "id", "class",
];

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = {
  label: any;
  // keeps the label as the accessible name but out of sight, for a field whose purpose is obvious from its icon
  hideLabel?: boolean;
  // decorative icon drawn inside the field, before the selected option
  startIcon?: any;
  options: SelectOption[];
  // first option with an empty value; with required, the form refuses it
  placeholder?: string;
  description?: any;
  error?: any;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <select>
  name?: string;
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// chevron drawn with two gradients so it follows the theme colors
const CHEVRON = `linear-gradient(45deg, transparent 50%, ${colors["--mitos-muted-foreground"]} 50%), linear-gradient(135deg, ${colors["--mitos-muted-foreground"]} 50%, transparent 50%)`;

const styles = stylex.create({
  select: {
    appearance: { default: "none", "@media (forced-colors: active)": "auto" },
    paddingInlineEnd: "2rem",
    backgroundImage: { default: CHEVRON, "@media (forced-colors: active)": "none" },
    backgroundSize: "0.3125rem 0.3125rem, 0.3125rem 0.3125rem",
    backgroundPosition: "calc(100% - 1.0625rem) 50%, calc(100% - 0.75rem) 50%",
    backgroundRepeat: "no-repeat",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
});

export default function Select(props: SelectProps) {
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
    get describedBy() {
      const ids = [props.error && state.partId("error"), props.description && state.partId("description")];
      return ids.filter(Boolean).join(" ") || undefined;
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `mitos-select-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)}>
      <label class={stylex.props(field.labelBox).className}>
        <span class={stylex.props(field.label, field.labelText, props.hideLabel && field.srOnly).className}>
          {props.label}
          {props.required && (
            <span aria-hidden="true" class={stylex.props(field.required).className}>
              {" *"}
            </span>
          )}
        </span>
        <span class={stylex.props(field.adorned).className}>
          {props.startIcon && (
            <span aria-hidden="true" class={stylex.props(field.startIcon).className}>
              {props.startIcon}
            </span>
          )}
          <select
            {...state.attributes}
            id={props.id}
            aria-invalid={props.error ? true : undefined}
            aria-describedby={state.describedBy}
            class={stylex.props(
              field.box,
              field.focusRing,
              styles.select,
              props.error && field.invalid,
              props.startIcon && field.withStartIcon,
            ).className}
          >
            {props.placeholder && <option value="">{props.placeholder}</option>}
            <For each={props.options}>
              {(option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              )}
            </For>
          </select>
        </span>
      </label>
      {props.description && (
        <p id={state.partId("description")} class={stylex.props(field.description).className}>
          {props.description}
        </p>
      )}
      {props.error && (
        <p id={state.partId("error")} class={stylex.props(field.error).className}>
          {props.error}
        </p>
      )}
    </div>
  );
}
