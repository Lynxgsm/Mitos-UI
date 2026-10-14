import { useStore } from "@builder.io/mitosis";
import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "@/config/tokens.stylex";

const OWN_PROPS = [
  // Props the component consumes itself; everything else is forwarded to the <button>.
  // iterating props only compiles correctly for React: mitosis.config.cjs maps props to the
  // Svelte $props() object. shortcut: a Vue target will need the same with $attrs.
  "children", "variant", "size", "type", "disabled", "class", "onClick",
];

export type ButtonProps = {
  children?: any;
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  class?: string;
  onClick?: (event: any) => void;
  // native attributes below are forwarded as-is to the <button>
  id?: string;
  name?: string;
  value?: string;
  form?: string;
  title?: string;
  tabIndex?: number;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: any) => void;
  [attribute: `aria-${string}` | `data-${string}`]: string | number | boolean | undefined;
};

const styles = stylex.create({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    whiteSpace: "nowrap",
    font: "inherit",
    fontWeight: 500,
    // inside a ButtonGroup, the variables of the group join neighbouring buttons (button-group.lite.tsx)
    borderRadius: {
      default: radii["--mitos-radius-md"],
      ":first-child:not(:last-child)": `var(--mitos-button-group-first, ${radii["--mitos-radius-md"]})`,
      ":last-child:not(:first-child)": `var(--mitos-button-group-last, ${radii["--mitos-radius-md"]})`,
      ":not(:first-child):not(:last-child)": `var(--mitos-button-group-middle, ${radii["--mitos-radius-md"]})`,
    },
    marginInlineStart: { default: null, ":not(:first-child)": "var(--mitos-button-group-overlap-x, 0px)" },
    marginBlockStart: { default: null, ":not(:first-child)": "var(--mitos-button-group-overlap-y, 0px)" },
    // the ring of the focused button stays above its overlapping neighbours
    zIndex: { default: null, ":focus-visible": 1 },
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    cursor: "pointer",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    // opaque + offset: contrast is measured against the page, not the button (WCAG 1.4.11)
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--mitos-ring"],
    // same as shadcn: no hover/click feedback once disabled
    pointerEvents: { default: null, ":disabled": "none" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
});

const variants = stylex.create({
  default: {
    backgroundColor: {
      default: colors["--mitos-primary"],
      ":hover": `color-mix(in oklab, ${colors["--mitos-primary"]} 90%, transparent)`,
    },
    color: colors["--mitos-primary-foreground"],
  },
  secondary: {
    backgroundColor: {
      default: colors["--mitos-secondary"],
      ":hover": `color-mix(in oklab, ${colors["--mitos-secondary"]} 80%, transparent)`,
    },
    color: colors["--mitos-secondary-foreground"],
  },
  outline: {
    backgroundColor: { default: colors["--mitos-background"], ":hover": colors["--mitos-accent"] },
    color: { default: colors["--mitos-foreground"], ":hover": colors["--mitos-accent-foreground"] },
    borderColor: colors["--mitos-border"],
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": colors["--mitos-accent"] },
    color: { default: colors["--mitos-foreground"], ":hover": colors["--mitos-accent-foreground"] },
  },
  link: {
    backgroundColor: "transparent",
    color: colors["--mitos-primary"],
    textDecorationLine: { default: "none", ":hover": "underline" },
    textUnderlineOffset: 4,
  },
  destructive: {
    backgroundColor: {
      default: colors["--mitos-destructive"],
      ":hover": `color-mix(in oklab, ${colors["--mitos-destructive"]} 90%, transparent)`,
    },
    color: colors["--mitos-destructive-foreground"],
  },
});

const sizes = stylex.create({
  xs: { height: "1.5rem", paddingInline: "0.5rem", fontSize: "0.75rem", gap: "0.25rem" },
  sm: { height: "2rem", paddingInline: "0.75rem", fontSize: "0.875rem" },
  md: { height: "2.25rem", paddingInline: "1rem", fontSize: "0.875rem" },
  lg: { height: "2.5rem", paddingInline: "1.5rem", fontSize: "1rem" },
  xl: { height: "2.75rem", paddingInline: "1.75rem", fontSize: "1rem" },
  "2xl": { height: "3rem", paddingInline: "2rem", fontSize: "1.125rem" },
  "3xl": { height: "3.5rem", paddingInline: "2.25rem", fontSize: "1.25rem" },
  "4xl": {
    height: "4rem",
    paddingInline: "2.5rem",
    fontSize: "1.5rem",
    // same group conditions as base, with lg as the radius outside a group
    borderRadius: {
      default: radii["--mitos-radius-lg"],
      ":first-child:not(:last-child)": `var(--mitos-button-group-first, ${radii["--mitos-radius-lg"]})`,
      ":last-child:not(:first-child)": `var(--mitos-button-group-last, ${radii["--mitos-radius-lg"]})`,
      ":not(:first-child):not(:last-child)": `var(--mitos-button-group-middle, ${radii["--mitos-radius-lg"]})`,
    },
  },
});

export default function Button(props: ButtonProps) {
  const state = useStore({
    get attributes() {
      return Object.fromEntries(Object.entries(props).filter(([key]) => !OWN_PROPS.includes(key)));
    },
  });

  return (
    <button
      {...state.attributes}
      class={clsx(
        stylex.props(styles.base, variants[props.variant ?? "default"], sizes[props.size ?? "md"]).className,
        props.class,
      )}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={(event) => props.onClick?.(event)}
    >
      {props.children}
    </button>
  );
}
