import * as stylex from "@stylexjs/stylex";

// Default theme, mirroring shadcn/ui's neutral CSS variables (globals.css).
// `--` keys keep their literal name (no hash): consumers can read or override them in plain CSS.
const DARK = "@media (prefers-color-scheme: dark)";

export const colors = stylex.defineVars({
  "--mitos-background": { default: "oklch(1 0 0)", [DARK]: "oklch(0.145 0 0)" },
  "--mitos-foreground": { default: "oklch(0.145 0 0)", [DARK]: "oklch(0.985 0 0)" },
  "--mitos-primary": { default: "oklch(0.205 0 0)", [DARK]: "oklch(0.922 0 0)" },
  "--mitos-primary-foreground": { default: "oklch(0.985 0 0)", [DARK]: "oklch(0.205 0 0)" },
  "--mitos-secondary": { default: "oklch(0.97 0 0)", [DARK]: "oklch(0.269 0 0)" },
  "--mitos-secondary-foreground": { default: "oklch(0.205 0 0)", [DARK]: "oklch(0.985 0 0)" },
  "--mitos-muted": { default: "oklch(0.97 0 0)", [DARK]: "oklch(0.269 0 0)" },
  "--mitos-muted-foreground": { default: "oklch(0.556 0 0)", [DARK]: "oklch(0.708 0 0)" },
  "--mitos-accent": { default: "oklch(0.97 0 0)", [DARK]: "oklch(0.269 0 0)" },
  "--mitos-accent-foreground": { default: "oklch(0.205 0 0)", [DARK]: "oklch(0.985 0 0)" },
  "--mitos-destructive": { default: "oklch(0.577 0.245 27.325)", [DARK]: "oklch(0.704 0.191 22.216)" },
  // not in shadcn (white text there): white fails WCAG AA on the light red used in dark mode
  "--mitos-destructive-foreground": { default: "oklch(1 0 0)", [DARK]: "oklch(0.145 0 0)" },
  // scrim behind modals and shadow color: decorative, no contrast requirement
  "--mitos-overlay": { default: "oklch(0 0 0 / 50%)", [DARK]: "oklch(0 0 0 / 70%)" },
  "--mitos-border": { default: "oklch(0.922 0 0)", [DARK]: "oklch(1 0 0 / 10%)" },
  // darker than shadcn: a field's border identifies it, so it needs 3:1 against the page (WCAG 1.4.11)
  "--mitos-input": { default: "oklch(0.64 0 0)", [DARK]: "oklch(0.48 0 0)" },
  // darker than shadcn (values swapped) so the focus ring reaches 3:1 against the page (WCAG 1.4.11)
  "--mitos-ring": { default: "oklch(0.556 0 0)", [DARK]: "oklch(0.708 0 0)" },
});

// shadcn derives sm/md/lg/xl from --radius: 0.625rem
export const radii = stylex.defineVars({
  "--mitos-radius-sm": "calc(0.625rem - 4px)",
  "--mitos-radius-md": "calc(0.625rem - 2px)",
  "--mitos-radius-lg": "0.625rem",
  "--mitos-radius-xl": "calc(0.625rem + 4px)",
});
