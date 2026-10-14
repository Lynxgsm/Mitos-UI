import { useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <div>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "class",
];

export type SkeletonProps = {
  // size and shape come from the consumer, e.g. a class setting width, height and border-radius
  class?: string;
  // native attributes below are forwarded as-is to the <div>
  // style: an object in React, a string in Svelte, as each framework expects
  style?: any;
  id?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const pulse = stylex.keyframes({
  "50%": { opacity: 0.5 },
});

// Decorative placeholder: hidden from assistive technologies. Announce the loading state on the
// container instead (aria-busy=true), then render the real content in its place.
const styles = stylex.create({
  skeleton: {
    display: "block",
    borderRadius: radii["--mitos-radius-md"],
    backgroundColor: colors["--mitos-muted"],
    animationName: { default: pulse, "@media (prefers-reduced-motion: reduce)": "none" },
    animationDuration: "2s",
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
    animationIterationCount: "infinite",
  },
});

export default function Skeleton(props: SkeletonProps) {
  const state = useStore({
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
  });

  return <div {...state.attributes} aria-hidden="true" class={clsx(stylex.props(styles.skeleton).className, props.class)} />;
}
