import { onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <textarea>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "description", "error", "id", "class",
];

export type TextareaProps = {
  label: any;
  description?: any;
  error?: any;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <textarea>
  name?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
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
    minHeight: "4.5rem",
    resize: "vertical",
    transitionProperty: "border-color",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    "::placeholder": { color: colors["--omni-muted-foreground"], opacity: 1 },
    cursor: { default: "text", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
});

export default function Textarea(props: TextareaProps) {
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
    if (!props.id) state.generatedId = `omni-textarea-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)}>
      {/* wrapping label: the field is named from the server render on, no id needed */}
      <label class={stylex.props(field.stack).className}>
        <span class={stylex.props(field.label).className}>
          {props.label}
          {props.required && (
            <span aria-hidden="true" class={stylex.props(field.required).className}>
              {" *"}
            </span>
          )}
        </span>
        <textarea
          {...state.attributes}
          id={props.id}
          rows={props.rows ?? 3}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={state.describedBy}
          class={stylex.props(field.box, field.focusRing, styles.control, props.error && field.invalid).className}
        />
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
