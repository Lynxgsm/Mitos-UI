import * as stylex from "@stylexjs/stylex";

// Default theme, mirroring shadcn/ui's neutral CSS variables (globals.css).
const DARK = "@media (prefers-color-scheme: dark)";

export const colors = stylex.defineVars({
  background: { default: "oklch(1 0 0)", [DARK]: "oklch(0.145 0 0)" },
  foreground: { default: "oklch(0.145 0 0)", [DARK]: "oklch(0.985 0 0)" },
  primary: { default: "oklch(0.205 0 0)", [DARK]: "oklch(0.922 0 0)" },
  primaryForeground: { default: "oklch(0.985 0 0)", [DARK]: "oklch(0.205 0 0)" },
  secondary: { default: "oklch(0.97 0 0)", [DARK]: "oklch(0.269 0 0)" },
  secondaryForeground: { default: "oklch(0.205 0 0)", [DARK]: "oklch(0.985 0 0)" },
  muted: { default: "oklch(0.97 0 0)", [DARK]: "oklch(0.269 0 0)" },
  mutedForeground: { default: "oklch(0.556 0 0)", [DARK]: "oklch(0.708 0 0)" },
  accent: { default: "oklch(0.97 0 0)", [DARK]: "oklch(0.269 0 0)" },
  accentForeground: { default: "oklch(0.205 0 0)", [DARK]: "oklch(0.985 0 0)" },
  destructive: { default: "oklch(0.577 0.245 27.325)", [DARK]: "oklch(0.704 0.191 22.216)" },
  border: { default: "oklch(0.922 0 0)", [DARK]: "oklch(1 0 0 / 10%)" },
  input: { default: "oklch(0.922 0 0)", [DARK]: "oklch(1 0 0 / 15%)" },
  ring: { default: "oklch(0.708 0 0)", [DARK]: "oklch(0.556 0 0)" },
});

// shadcn derives sm/md/lg/xl from --radius: 0.625rem
export const radii = stylex.defineVars({
  sm: "calc(0.625rem - 4px)",
  md: "calc(0.625rem - 2px)",
  lg: "0.625rem",
  xl: "calc(0.625rem + 4px)",
});
