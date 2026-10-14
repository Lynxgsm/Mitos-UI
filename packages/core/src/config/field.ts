import * as stylex from "@stylexjs/stylex";
import { colors, radii } from "@/config/tokens.stylex";

// Shared by the form components so that labels, help texts, errors and focus rings read the same everywhere.
export const field = stylex.create({
  stack: { display: "grid", gap: "0.375rem" },
  label: { fontSize: "0.875rem", fontWeight: 500, color: colors["--omni-foreground"] },
  required: { color: colors["--omni-destructive"] },
  description: { margin: 0, fontSize: "0.8125rem", color: colors["--omni-muted-foreground"] },
  error: { margin: 0, fontSize: "0.8125rem", fontWeight: 500, color: colors["--omni-destructive"] },
  // label next to a checkbox, switch or radio: the whole row is the click target
  inline: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    minHeight: "1.5rem",
    fontSize: "0.875rem",
    color: colors["--omni-foreground"],
    cursor: "pointer",
    // a disabled option dims as a whole row, control and text
    opacity: { default: 1, ":has(:disabled)": 0.5 },
  },
  focusRing: {
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--omni-ring"],
  },
  disabled: {
    opacity: { default: 1, ":disabled": 0.5 },
    cursor: { default: "pointer", ":disabled": "not-allowed" },
  },
  // the box of a text-like control (select): same as Input
  box: {
    boxSizing: "border-box",
    width: "100%",
    minHeight: "2.25rem",
    paddingBlock: "0.375rem",
    paddingInline: "0.75rem",
    font: "inherit",
    fontSize: "0.875rem",
    color: colors["--omni-foreground"],
    backgroundColor: colors["--omni-background"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--omni-input"],
    borderRadius: radii["--omni-radius-md"],
  },
  invalid: {
    borderColor: colors["--omni-destructive"],
    outlineColor: colors["--omni-destructive"],
  },
});
