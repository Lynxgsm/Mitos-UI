import { For, onMount, onUpdate, useRef, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <fieldset>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "legend", "hideLegend", "options", "name", "value", "defaultValue", "onValueChange", "disabled", "id", "class",
];

export type SegmentedOption = {
  value: string;
  label: string;
  // decorative icon before the label
  icon?: any;
  // shows only the icon; the label still names the option and becomes its tooltip
  hideLabel?: boolean;
  disabled?: boolean;
};

export type SegmentedControlProps = {
  // names the group, such as Show or View
  legend: any;
  // keeps the legend as the name of the group but out of sight
  hideLegend?: boolean;
  options: SegmentedOption[];
  // shared by the radios: groups them for the arrow keys and the form data
  name: string;
  // controlled selection: update it from onValueChange; without it the control keeps its own state
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <fieldset>
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  group: {
    display: "inline-flex",
    flexWrap: "wrap",
    gap: "0.125rem",
    minWidth: 0,
    margin: 0,
    padding: "0.1875rem",
    borderStyle: "none",
    borderRadius: radii["--mitos-radius-md"],
    backgroundColor: colors["--mitos-secondary"],
  },
  legend: { padding: 0, marginBottom: "0.25rem" },
  // a radio in each segment: native keyboard, form data and states; the segment is its visible face
  segment: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    minWidth: "1.875rem",
    height: "1.875rem",
    paddingInline: "0.625rem",
    borderRadius: radii["--mitos-radius-sm"],
    fontSize: "0.8125rem",
    fontWeight: 500,
    color: {
      default: colors["--mitos-muted-foreground"],
      ":hover": colors["--mitos-foreground"],
      ":has(:checked)": colors["--mitos-foreground"],
    },
    backgroundColor: { default: "transparent", ":has(:checked)": colors["--mitos-background"] },
    boxShadow: { default: "none", ":has(:checked)": `0 0 0 1px ${colors["--mitos-border"]}` },
    cursor: { default: "pointer", ":has(:disabled)": "not-allowed" },
    opacity: { default: 1, ":has(:disabled)": 0.5 },
    // the ring of the focused radio, drawn on its segment (WCAG 2.4.7)
    outlineStyle: { default: "none", ":has(:focus-visible)": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--mitos-ring"],
  },
  iconOnly: { paddingInline: 0 },
  // invisible but focusable and clickable over the whole segment
  radio: {
    appearance: "none",
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    margin: 0,
    opacity: 0,
    cursor: "inherit",
  },
  icon: { display: "flex" },
});

export default function SegmentedControl(props: SegmentedControlProps) {
  const groupRef = useRef<HTMLFieldSetElement>(null);

  const state = useStore({
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
    // checks the radio of the given value, unchecks the others
    sync(value: string) {
      if (!groupRef) return;
      for (const radio of Array.from(groupRef.querySelectorAll("input"))) radio.checked = radio.value === value;
    },
    change(event: any) {
      props.onValueChange?.(event.target.value);
      // controlled: undo the click until the parent passes the new value
      if (props.value !== undefined) state.sync(props.value);
    },
  });

  onMount(() => {
    if (props.value !== undefined) state.sync(props.value);
  });

  onUpdate(() => {
    if (props.value !== undefined) state.sync(props.value);
  }, [props.value]);

  // radiogroup role on the fieldset: it keeps the legend as name
  return (
    <fieldset
      {...state.attributes}
      ref={groupRef}
      id={props.id}
      role="radiogroup"
      disabled={props.disabled}
      class={clsx(stylex.props(styles.group).className, props.class)}
      onChange={(event) => state.change(event)}
    >
      <legend class={stylex.props(field.label, styles.legend, props.hideLegend && field.srOnly).className}>
        {props.legend}
      </legend>
      <For each={props.options}>
        {(option) => (
          <label
            key={option.value}
            title={option.hideLabel ? option.label : undefined}
            class={stylex.props(styles.segment, option.hideLabel && styles.iconOnly).className}
          >
            <input
              type="radio"
              name={props.name}
              value={option.value}
              aria-label={option.hideLabel ? option.label : undefined}
              defaultChecked={option.value === (props.value ?? props.defaultValue)}
              disabled={option.disabled}
              class={stylex.props(styles.radio).className}
            />
            {option.icon && (
              <span aria-hidden="true" class={stylex.props(styles.icon).className}>
                {option.icon}
              </span>
            )}
            {!option.hideLabel && <span>{option.label}</span>}
          </label>
        )}
      </For>
    </fieldset>
  );
}
