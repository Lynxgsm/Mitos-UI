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
    borderRadius: radii["--omni-radius-md"],
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
    outlineColor: colors["--omni-ring"],
    // same as shadcn: no hover/click feedback once disabled
    pointerEvents: { default: null, ":disabled": "none" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
});

const variants = stylex.create({
  default: {
    backgroundColor: {
      default: colors["--omni-primary"],
      ":hover": `color-mix(in oklab, ${colors["--omni-primary"]} 90%, transparent)`,
    },
    color: colors["--omni-primary-foreground"],
  },
  secondary: {
    backgroundColor: {
      default: colors["--omni-secondary"],
      ":hover": `color-mix(in oklab, ${colors["--omni-secondary"]} 80%, transparent)`,
    },
    color: colors["--omni-secondary-foreground"],
  },
  outline: {
    backgroundColor: { default: colors["--omni-background"], ":hover": colors["--omni-accent"] },
    color: { default: colors["--omni-foreground"], ":hover": colors["--omni-accent-foreground"] },
    borderColor: colors["--omni-border"],
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": colors["--omni-accent"] },
    color: { default: colors["--omni-foreground"], ":hover": colors["--omni-accent-foreground"] },
  },
  link: {
    backgroundColor: "transparent",
    color: colors["--omni-primary"],
    textDecorationLine: { default: "none", ":hover": "underline" },
    textUnderlineOffset: 4,
  },
  destructive: {
    backgroundColor: {
      default: colors["--omni-destructive"],
      ":hover": `color-mix(in oklab, ${colors["--omni-destructive"]} 90%, transparent)`,
    },
    color: colors["--omni-destructive-foreground"],
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
  "4xl": { height: "4rem", paddingInline: "2.5rem", fontSize: "1.5rem", borderRadius: radii["--omni-radius-lg"] },
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
