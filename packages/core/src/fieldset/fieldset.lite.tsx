import { onMount, useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors } from "@/config/tokens.stylex";
import { field } from "@/config/field";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <fieldset>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "children", "legend", "description", "id", "class",
];

export type FieldsetProps = {
  // names the group; screen readers announce it when focus enters a field of the group
  legend: any;
  description?: any;
  children?: any;
  id?: string;
  class?: string;
  // native attributes below are forwarded as-is to the <fieldset>; disabled disables every field inside
  disabled?: boolean;
  name?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  fieldset: {
    display: "grid",
    gap: "1rem",
    minWidth: 0,
    margin: 0,
    padding: 0,
    borderStyle: "none",
  },
  // the legend is rendered above the grid, outside its gap: its own margin spaces it from the content
  legend: { padding: 0, marginBottom: "0.5rem", fontSize: "1rem", fontWeight: 600, color: colors["--mitos-foreground"] },
});

export default function Fieldset(props: FieldsetProps) {
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
    if (!props.id) state.generatedId = `mitos-fieldset-${Math.random().toString(36).slice(2, 10)}`;
  });

  return (
    <fieldset
      {...state.attributes}
      id={props.id}
      aria-describedby={state.descriptionId}
      class={clsx(stylex.props(styles.fieldset).className, props.class)}
    >
      <legend class={stylex.props(styles.legend).className}>{props.legend}</legend>
      {props.description && (
        <p id={state.descriptionId} class={stylex.props(field.description).className}>
          {props.description}
        </p>
      )}
      {props.children}
    </fieldset>
  );
}
