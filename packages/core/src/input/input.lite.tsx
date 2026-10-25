import { onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <input>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "hideLabel", "startIcon", "endSlot", "description", "error", "id", "class",
];

export type InputProps = {
  label: any;
  // keeps the label as the accessible name but out of sight, for a field whose purpose is obvious from its icon
  hideLabel?: boolean;
  // decorative icon drawn inside the field, before the text
  startIcon?: any;
  // decorative hint drawn inside the field, after the text, such as a keyboard shortcut; never a control
  endSlot?: any;
  description?: any;
  error?: any;
  type?: "text" | "email" | "password" | "search" | "tel" | "url" | "number" | "date" | "time" | "datetime-local" | "file" | "color";
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <input>
  name?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric" | "decimal" | "search" | "none";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  // date and time types
  min?: string | number;
  max?: string | number;
  step?: string | number;
  // file type
  accept?: string;
  multiple?: boolean;
  onInput?: (event: any) => void;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  // the box, focus ring and invalid state come from config/field.ts; only what differs is here
  control: {
    transitionProperty: "border-color",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    "::placeholder": { color: colors["--mitos-muted-foreground"], opacity: 1 },
    cursor: { default: "text", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
  // the browser button inside a file input, styled like a secondary Button
  file: {
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    "::file-selector-button": {
      marginInlineEnd: "0.75rem",
      paddingBlock: "0.125rem",
      paddingInline: "0.625rem",
      font: "inherit",
      fontWeight: 500,
      color: colors["--mitos-secondary-foreground"],
      backgroundColor: colors["--mitos-secondary"],
      borderStyle: "none",
      borderRadius: radii["--mitos-radius-sm"],
      cursor: "pointer",
    },
  },
  // a compact swatch instead of a full-width bar
  color: {
    width: "3.5rem",
    paddingBlock: "0.25rem",
    paddingInline: "0.25rem",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
  },
});

export default function Input(props: InputProps) {
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
    // error first: it is the most important thing to hear after the label
    get describedBy() {
      const ids = [props.error && state.partId("error"), props.description && state.partId("description")];
      return ids.filter(Boolean).join(" ") || undefined;
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `mitos-input-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)}>
      {/* wrapping label: the field is named from the server render on, no id needed */}
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
          <input
            {...state.attributes}
            id={props.id}
            type={props.type ?? "text"}
            aria-invalid={props.error ? true : undefined}
            aria-describedby={state.describedBy}
            class={stylex.props(
              field.box,
              field.focusRing,
              styles.control,
              props.type === "file" && styles.file,
              props.type === "color" && styles.color,
              props.error && field.invalid,
              props.startIcon && field.withStartIcon,
              props.endSlot && field.withEndSlot,
            ).className}
          />
          {props.endSlot && (
            <span aria-hidden="true" class={stylex.props(field.endSlot).className}>
              {props.endSlot}
            </span>
          )}
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
