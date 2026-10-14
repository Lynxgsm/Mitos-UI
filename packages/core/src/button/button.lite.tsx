import * as stylex from "@stylexjs/stylex";
import clsx from "clsx";
import { colors, radii } from "../tokens.stylex";

export type ButtonProps = {
  children?: any;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  class?: string;
  onClick?: (event: any) => void;
};

const styles = stylex.create({
  base: {
    font: "inherit",
    paddingBlock: "0.5rem",
    paddingInline: "1rem",
    borderRadius: radii.md,
    borderStyle: "none",
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
  },
  primary: { backgroundColor: colors.primary, color: colors.primaryForeground },
  secondary: { backgroundColor: colors.secondary, color: colors.secondaryForeground },
});

export default function Button(props: ButtonProps) {
  return (
    <button
      class={clsx(stylex.props(styles.base, styles[props.variant ?? "primary"]).className, props.class)}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={(event) => props.onClick?.(event)}
    >
      {props.children}
    </button>
  );
}
