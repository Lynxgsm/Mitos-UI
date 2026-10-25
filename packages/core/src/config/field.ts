import * as stylex from "@stylexjs/stylex";
import { colors, radii } from "@/config/tokens.stylex";

// Shared by the form components so that labels, help texts, errors and focus rings read the same everywhere.
export const field = stylex.create({
  // align-content start: stretched by a taller neighbour in a grid row, the label and the control stay at the
  // top instead of sharing the extra height (the control would move down)
  stack: { display: "grid", gap: "0.375rem", alignContent: "start" },
  label: { fontSize: "0.875rem", fontWeight: 500, color: colors["--mitos-foreground"] },
  // the <label> around a text, select or range control. No grid gap: password managers and autofill extensions
  // insert elements next to the control, and each one would add a gap (the fields below would move down).
  // The space under the label text is its margin instead (labelText).
  labelBox: { display: "grid", alignContent: "start" },
  labelText: { marginBottom: "0.375rem" },
  required: { color: colors["--mitos-destructive"] },
  description: { margin: 0, fontSize: "0.8125rem", color: colors["--mitos-muted-foreground"] },
  error: { margin: 0, fontSize: "0.8125rem", fontWeight: 500, color: colors["--mitos-destructive"] },
  // label next to a checkbox, switch or radio: the whole row is the click target
  inline: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    minHeight: "1.5rem",
    fontSize: "0.875rem",
    color: colors["--mitos-foreground"],
    cursor: "pointer",
    // a disabled option dims as a whole row, control and text
    opacity: { default: 1, ":has(:disabled)": 0.5 },
  },
  focusRing: {
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineOffset: 2,
    outlineColor: colors["--mitos-ring"],
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
    color: colors["--mitos-foreground"],
    backgroundColor: colors["--mitos-background"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors["--mitos-input"],
    borderRadius: radii["--mitos-radius-md"],
  },
  invalid: {
    borderColor: colors["--mitos-destructive"],
    outlineColor: colors["--mitos-destructive"],
  },
  // hideLabel: still the accessible name of the control, out of sight (and without the space under it)
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  // the control with its optional start icon and end slot drawn over its padding
  adorned: { position: "relative", display: "grid" },
  startIcon: {
    position: "absolute",
    insetInlineStart: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    color: colors["--mitos-muted-foreground"],
    pointerEvents: "none",
  },
  endSlot: {
    position: "absolute",
    insetInlineEnd: "0.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    color: colors["--mitos-muted-foreground"],
    pointerEvents: "none",
  },
  withStartIcon: { paddingInlineStart: "2.25rem" },
  withEndSlot: { paddingInlineEnd: "2.75rem" },
});
