import { useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <span>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "children", "variant", "class",
];

export type BadgeProps = {
  children?: any;
  variant?: "default" | "secondary" | "outline" | "destructive";
  class?: string;
  // native attributes below are forwarded as-is to the <span>
  id?: string;
  title?: string;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

// A label, not a control: plain inline text, no role. The color never carries the meaning alone,
// the text does (WCAG 1.4.1).
const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    width: "fit-content",
    whiteSpace: "nowrap",
    paddingBlock: "0.125rem",
    paddingInline: "0.5rem",
    borderRadius: radii["--mitos-radius-md"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.33,
  },
});

const variants = stylex.create({
  default: {
    backgroundColor: colors["--mitos-primary"],
    color: colors["--mitos-primary-foreground"],
  },
  secondary: {
    backgroundColor: colors["--mitos-secondary"],
    color: colors["--mitos-secondary-foreground"],
  },
  outline: {
    backgroundColor: "transparent",
    color: colors["--mitos-foreground"],
    borderColor: colors["--mitos-border"],
  },
  destructive: {
    backgroundColor: colors["--mitos-destructive"],
    color: colors["--mitos-destructive-foreground"],
  },
});

export default function Badge(props: BadgeProps) {
  const state = useStore({
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
  });

  return (
    <span
      {...state.attributes}
      class={clsx(stylex.props(styles.base, variants[props.variant ?? "default"]).className, props.class)}
    >
      {props.children}
    </span>
  );
}
