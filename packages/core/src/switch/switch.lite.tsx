import { onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <input>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "label", "description", "id", "class",
];

export type SwitchProps = {
  // names the setting; it does not change with the state (no On and Off labels)
  label: any;
  description?: any;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <input>
  name?: string;
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// the thumb is a 1rem disc painted on the track (no pseudo-element on inputs)
const THUMB_OFF = `radial-gradient(circle, ${colors["--mitos-background"]} 0 calc(0.5rem - 1px), transparent 0.5rem)`;
const THUMB_ON = `radial-gradient(circle, ${colors["--mitos-primary-foreground"]} 0 calc(0.5rem - 1px), transparent 0.5rem)`;

// A native checkbox with role=switch, drawn as a track and a thumb. Track colors reach 3:1 against the page
// (input and primary tokens) and the thumb 3:1 against the track (WCAG 1.4.11).
const styles = stylex.create({
  track: {
    appearance: { default: "none", "@media (forced-colors: active)": "auto" },
    flexShrink: 0,
    boxSizing: "border-box",
    width: "2.25rem",
    height: "1.25rem",
    margin: 0,
    padding: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: "9999px",
    backgroundColor: { default: colors["--mitos-input"], ":checked": colors["--mitos-primary"] },
    backgroundImage: {
      default: THUMB_OFF,
      ":checked": THUMB_ON,
      "@media (forced-colors: active)": "none",
    },
    backgroundSize: "1rem 1rem",
    backgroundRepeat: "no-repeat",
    backgroundPosition: { default: "0.0625rem center", ":checked": "calc(100% - 0.0625rem) center" },
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    transitionProperty: "background-position, background-color",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" },
  },
  indent: { paddingInlineStart: "2.75rem" },
});

export default function Switch(props: SwitchProps) {
  const state = useStore({
    // a random id would differ between server and client: without an `id` prop it is set after mount
    generatedId: "",
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    get descriptionId() {
      const base = props.id ?? state.generatedId;
      return props.description && base ? `${base}-description` : undefined;
    },
  });

  onMount(() => {
    if (!props.id) state.generatedId = `mitos-switch-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)}>
      <label class={stylex.props(field.inline).className}>
        <input
          {...state.attributes}
          type="checkbox"
          role="switch"
          id={props.id}
          aria-describedby={state.descriptionId}
          class={stylex.props(styles.track, field.focusRing).className}
        />
        <span>{props.label}</span>
      </label>
      {props.description && (
        <p id={state.descriptionId} class={stylex.props(field.description, styles.indent).className}>
          {props.description}
        </p>
      )}
    </div>
  );
}
