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

export type SliderProps = {
  label: any;
  description?: any;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <input type=range>
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  // spoken instead of the raw number, e.g. 40 percent or Medium
  "aria-valuetext"?: string;
  onInput?: (event: any) => void;
  onChange?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// Native range input: arrow keys, Page Up and Down, Home and End and the spoken value come from the browser.
// Track and thumb are drawn the same in every engine; the filled part follows --omni-slider-fill, set from the
// value. Forced colors mode gets the native slider back.
const TRACK = {
  height: "0.375rem",
  borderRadius: "9999px",
  // filled part in primary, the rest in --omni-input: both reach 3:1 against the page (WCAG 1.4.11)
  backgroundImage: `linear-gradient(to right, ${colors["--omni-primary"]} var(--omni-slider-fill, 50%), ${colors["--omni-input"]} var(--omni-slider-fill, 50%))`,
};
const THUMB = {
  boxSizing: "border-box",
  width: "1rem",
  height: "1rem",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: colors["--omni-primary"],
  borderRadius: "9999px",
  backgroundColor: colors["--omni-background"],
  cursor: "pointer",
};

const styles = stylex.create({
  range: {
    appearance: { default: "none", "@media (forced-colors: active)": "auto" },
    width: "100%",
    // a 24px tall hit area (WCAG 2.5.8)
    height: "1.5rem",
    margin: 0,
    backgroundColor: "transparent",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    "::-webkit-slider-runnable-track": TRACK,
    "::-moz-range-track": TRACK,
    "::-webkit-slider-thumb": { ...THUMB, appearance: "none", marginTop: "-0.3125rem" },
    "::-moz-range-thumb": THUMB,
  },
});

export default function Slider(props: SliderProps) {
  const state = useStore({
    // value of an uncontrolled slider, followed from its input events (the native default is the middle)
    current: props.defaultValue ?? ((props.min ?? 0) + (props.max ?? 100)) / 2,
    // locals must not share a prop name: in Svelte props.min becomes min
    get fill() {
      const low = props.min ?? 0;
      const high = props.max ?? 100;
      const position = props.value ?? state.current;
      return `${high > low ? ((position - low) / (high - low)) * 100 : 0}%`;
    },
    // any: custom properties are not in the CSS typings of React
    get fillStyle() {
      return { "--omni-slider-fill": state.fill } as any;
    },
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
    if (!props.id) state.generatedId = `omni-slider-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <div class={clsx(stylex.props(field.stack).className, props.class)}>
      <label class={stylex.props(field.labelBox).className}>
        <span class={stylex.props(field.label, field.labelText).className}>{props.label}</span>
        <input
          {...state.attributes}
          type="range"
          id={props.id}
          aria-describedby={state.descriptionId}
          style={state.fillStyle}
          class={stylex.props(styles.range, field.focusRing, field.disabled).className}
          onInput={(event) => {
            state.current = Number(event.currentTarget.value);
            props.onInput?.(event);
          }}
        />
      </label>
      {props.description && (
        <p id={state.descriptionId} class={stylex.props(field.description).className}>
          {props.description}
        </p>
      )}
    </div>
  );
}
