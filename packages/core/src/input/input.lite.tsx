import { onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <input>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "description", "error", "id", "class",
];

export type InputProps = {
  label: any;
  description?: any;
  error?: any;
  type?: "text" | "email" | "password" | "search" | "tel" | "url" | "number";
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
  onInput?: (event: any) => void;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  field: { display: "grid", gap: "0.375rem" },
  label: { display: "grid", gap: "0.375rem" },
  labelText: { fontSize: "0.875rem", fontWeight: 500, color: colors["--omni-foreground"] },
  required: { color: colors["--omni-destructive"] },
  control: {
    boxSizing: "border-box",
    width: "100%",
    minHeight: "2.25rem",
    paddingBlock: "0.375rem",
    paddingInline: "0.75rem",
    font: "inherit",
    fontSize: "0.875rem",
    color: colors["--omni-foreground"],
    backgroundColor: colors["--omni-background"],
    borderWidth: 1,
    borderStyle: "solid",
    // --omni-input reaches 3:1 against the background: the border identifies the field (WCAG 1.4.11)
    borderColor: colors["--omni-input"],
    borderRadius: radii["--omni-radius-md"],
    transitionProperty: "border-color",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--omni-ring"],
    "::placeholder": { color: colors["--omni-muted-foreground"], opacity: 1 },
    cursor: { default: "text", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
  invalid: {
    borderColor: colors["--omni-destructive"],
    outlineColor: colors["--omni-destructive"],
  },
  description: { margin: 0, fontSize: "0.8125rem", color: colors["--omni-muted-foreground"] },
  error: { margin: 0, fontSize: "0.8125rem", fontWeight: 500, color: colors["--omni-destructive"] },
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
    if (!props.id) state.generatedId = `omni-input-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div class={clsx(stylex.props(styles.field).className, props.class)}>
      {/* wrapping label: the field is named from the server render on, no id needed */}
      <label class={stylex.props(styles.label).className}>
        <span class={stylex.props(styles.labelText).className}>
          {props.label}
          {props.required && (
            <span aria-hidden="true" class={stylex.props(styles.required).className}>
              {" *"}
            </span>
          )}
        </span>
        <input
          {...state.attributes}
          id={props.id}
          type={props.type ?? "text"}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={state.describedBy}
          class={stylex.props(styles.control, props.error && styles.invalid).className}
        />
      </label>
      {props.description && (
        <p id={state.partId("description")} class={stylex.props(styles.description).className}>
          {props.description}
        </p>
      )}
      {props.error && (
        <p id={state.partId("error")} class={stylex.props(styles.error).className}>
          {props.error}
        </p>
      )}
    </div>
  );
}
