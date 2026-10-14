import { useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <div>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "children", "orientation", "class",
];

export type ButtonGroupProps = {
  children?: any;
  orientation?: "horizontal" | "vertical";
  class?: string;
  // a group needs a name: what do these buttons act on
  "aria-label"?: string;
  "aria-labelledby"?: string;
  // native attributes below are forwarded as-is to the <div>
  id?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const R = radii["--omni-radius-md"];

// StyleX cannot style children from the parent: the group sets these variables and Button reads them
// by position (button.lite.tsx). Outside a group they are unset and Button keeps its own radius.
// shortcut: physical corners, so the joined edges are wrong in right-to-left layouts; use logical
// corner properties if RTL support is added.
const styles = stylex.create({
  group: {
    display: "inline-flex",
    width: "fit-content",
  },
});

const orientations = stylex.create({
  horizontal: {
    flexDirection: "row",
    "--omni-button-group-first": `${R} 0 0 ${R}`,
    "--omni-button-group-last": `0 ${R} ${R} 0`,
    "--omni-button-group-middle": "0",
    // neighbours share one border instead of two
    "--omni-button-group-overlap-x": "-1px",
  },
  vertical: {
    flexDirection: "column",
    "--omni-button-group-first": `${R} ${R} 0 0`,
    "--omni-button-group-last": `0 0 ${R} ${R}`,
    "--omni-button-group-middle": "0",
    "--omni-button-group-overlap-y": "-1px",
  },
});

export default function ButtonGroup(props: ButtonGroupProps) {
  const state = useStore({
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
  });

  return (
    <div
      {...state.attributes}
      role="group"
      class={clsx(
        stylex.props(styles.group, orientations[props.orientation ?? "horizontal"]).className,
        props.class,
      )}
    >
      {props.children}
    </div>
  );
}
