import { onMount, onUpdate, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <input>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "description", "error", "indeterminate", "id", "class",
];

export type CheckboxProps = {
  label: any;
  description?: any;
  error?: any;
  // mixed state, e.g. a select-all box when only some items are checked
  indeterminate?: boolean;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <input>
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  disabled?: boolean;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// Drawn the same in every browser: a native input without its own look, and two decorative icons (check
// and dash) shown from the state of the input through :has(). Forced colors mode gets the native box back.
const styles = stylex.create({
  control: {
    display: "inline-grid",
    flexShrink: 0,
    "--omni-checkbox-check": { default: "0", ":has(:checked:not(:indeterminate))": "1" },
    "--omni-checkbox-dash": { default: "0", ":has(:indeterminate)": "1" },
  },
  box: {
    appearance: { default: "none", "@media (forced-colors: active)": "auto" },
    gridArea: "1 / 1",
    boxSizing: "border-box",
    width: "1rem",
    height: "1rem",
    margin: 0,
    borderWidth: 1,
    borderStyle: "solid",
    // --omni-input reaches 3:1 against the page: the empty box stays visible (WCAG 1.4.11)
    borderColor: { default: colors["--omni-input"], ":checked": colors["--omni-primary"], ":indeterminate": colors["--omni-primary"] },
    borderRadius: radii["--omni-radius-sm"],
    backgroundColor: { default: colors["--omni-background"], ":checked": colors["--omni-primary"], ":indeterminate": colors["--omni-primary"] },
    cursor: { default: "pointer", ":disabled": "not-allowed" },
  },
  icon: {
    gridArea: "1 / 1",
    placeSelf: "center",
    width: "0.75rem",
    height: "0.75rem",
    pointerEvents: "none",
    color: colors["--omni-primary-foreground"],
    strokeWidth: 2.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    display: { default: "block", "@media (forced-colors: active)": "none" },
  },
  check: { opacity: "var(--omni-checkbox-check)" },
  dash: { opacity: "var(--omni-checkbox-dash)" },
  // aligns the help texts with the label text, after the box
  indent: { paddingInlineStart: "1.5rem" },
});

export default function Checkbox(props: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!props.id) state.generatedId = `omni-checkbox-${Math.random().toString(36).slice(2, 10)}`;
  });

  // indeterminate is a DOM property, not an attribute: set it on the element
  onUpdate(() => {
    if (inputRef) inputRef.indeterminate = Boolean(props.indeterminate);
  }, [props.indeterminate]);

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)}>
      <label class={stylex.props(field.inline).className}>
        <span class={stylex.props(styles.control).className}>
          <input
            {...state.attributes}
            ref={inputRef}
            type="checkbox"
            id={props.id}
            aria-invalid={props.error ? true : undefined}
            aria-describedby={state.describedBy}
            class={stylex.props(styles.box, field.focusRing).className}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            class={stylex.props(styles.icon, styles.check).className}
          >
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            class={stylex.props(styles.icon, styles.dash).className}
          >
            <path d="M4 8h8" />
          </svg>
        </span>
        <span>
          {props.label}
          {props.required && (
            <span aria-hidden="true" class={stylex.props(field.required).className}>
              {" *"}
            </span>
          )}
        </span>
      </label>
      {props.description && (
        <p id={state.partId("description")} class={stylex.props(field.description, styles.indent).className}>
          {props.description}
        </p>
      )}
      {props.error && (
        <p id={state.partId("error")} class={stylex.props(field.error, styles.indent).className}>
          {props.error}
        </p>
      )}
    </div>
  );
}
