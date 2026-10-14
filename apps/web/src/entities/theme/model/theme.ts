// Theme presets for the /create page. Hex values (Tailwind scales) so contrast can be computed;
// theme.test.ts checks every base x accent pair against WCAG AA in light and dark mode.

type Scale = Record<50 | 100 | 200 | 400 | 500 | 800 | 900 | 950, string>;

export const BASES = {
  neutral: { label: "Neutral", scale: { 50: "#fafafa", 100: "#f5f5f5", 200: "#e5e5e5", 400: "#a3a3a3", 500: "#737373", 800: "#262626", 900: "#171717", 950: "#0a0a0a" } },
  stone: { label: "Stone", scale: { 50: "#fafaf9", 100: "#f5f5f4", 200: "#e7e5e4", 400: "#a8a29e", 500: "#78716c", 800: "#292524", 900: "#1c1917", 950: "#0c0a09" } },
  zinc: { label: "Zinc", scale: { 50: "#fafafa", 100: "#f4f4f5", 200: "#e4e4e7", 400: "#a1a1aa", 500: "#71717a", 800: "#27272a", 900: "#18181b", 950: "#09090b" } },
  slate: { label: "Slate", scale: { 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 400: "#94a3b8", 500: "#64748b", 800: "#1e293b", 900: "#0f172a", 950: "#020617" } },
  gray: { label: "Gray", scale: { 50: "#f9fafb", 100: "#f3f4f6", 200: "#e5e7eb", 400: "#9ca3af", 500: "#6b7280", 800: "#1f2937", 900: "#111827", 950: "#030712" } },
} satisfies Record<string, { label: string; scale: Scale }>;

// light: dark enough for white text; dark: light enough for near-black text
export const ACCENTS = {
  default: { label: "Default", light: null, dark: null },
  blue: { label: "Blue", light: "#1d4ed8", dark: "#60a5fa" },
  emerald: { label: "Emerald", light: "#047857", dark: "#34d399" },
  rose: { label: "Rose", light: "#be123c", dark: "#fb7185" },
  orange: { label: "Orange", light: "#9a3412", dark: "#fb923c" },
  violet: { label: "Violet", light: "#7c3aed", dark: "#a78bfa" },
  // the site's brand: #c45c26 shifted darker/lighter just enough for AA text contrast
  ember: { label: "Ember", light: "#a94f21", dark: "#ca6c3c" },
} satisfies Record<string, { label: string; light: string | null; dark: string | null }>;

export const RADII = {
  none: { label: "None", value: "0rem" },
  small: { label: "Small", value: "0.3rem" },
  default: { label: "Default", value: "0.625rem" },
  large: { label: "Large", value: "0.75rem" },
  xl: { label: "XL", value: "1rem" },
} satisfies Record<string, { label: string; value: string }>;

export type BaseName = keyof typeof BASES;
export type AccentName = keyof typeof ACCENTS;
export type RadiusName = keyof typeof RADII;
export type Preset = { base: BaseName; accent: AccentName; radius: RadiusName };
export type Mode = "light" | "dark";

export const DEFAULT_PRESET: Preset = { base: "neutral", accent: "default", radius: "default" };
export const SITE_PRESET: Preset = { base: "stone", accent: "ember", radius: "default" };

// Destructive stays the library default: it is a semantic color, not part of the brand.
const DESTRUCTIVE = {
  light: { destructive: "#e40014", "destructive-foreground": "#ffffff" },
  dark: { destructive: "#ff6568", "destructive-foreground": "#0a0a0a" },
};

export function colorTokens(preset: Preset, mode: Mode): Record<string, string> {
  const s = BASES[preset.base].scale;
  const accent = ACCENTS[preset.accent][mode];
  if (mode === "light") {
    return {
      background: "#ffffff",
      foreground: s[950],
      primary: accent ?? s[900],
      "primary-foreground": accent ? "#ffffff" : s[50],
      secondary: s[100],
      "secondary-foreground": s[900],
      muted: s[100],
      "muted-foreground": s[500],
      accent: s[100],
      "accent-foreground": s[900],
      border: s[200],
      // field borders need 3:1 against the page (WCAG 1.4.11)
      input: s[500],
      ring: s[500],
      ...DESTRUCTIVE.light,
    };
  }
  return {
    background: s[950],
    foreground: s[50],
    primary: accent ?? s[200],
    "primary-foreground": accent ? s[950] : s[900],
    secondary: s[800],
    "secondary-foreground": s[50],
    muted: s[800],
    "muted-foreground": s[400],
    accent: s[800],
    "accent-foreground": s[50],
    border: s[800],
    input: s[500],
    ring: s[400],
    ...DESTRUCTIVE.dark,
  };
}

export function radiusTokens(preset: Preset): Record<string, string> {
  const r = RADII[preset.radius].value;
  return {
    "radius-sm": `max(0px, calc(${r} - 4px))`,
    "radius-md": `max(0px, calc(${r} - 2px))`,
    "radius-lg": r,
    "radius-xl": `calc(${r} + 4px)`,
  };
}

function declarations(tokens: Record<string, string>, indent: string) {
  return Object.entries(tokens)
    .map(([name, value]) => `${indent}--omni-${name}: ${value};`)
    .join("\n");
}

/** Theme stylesheet for `selector`; `mode` forces one scheme, otherwise it follows the system. */
export function themeCss(preset: Preset, selector = ":root", mode?: Mode) {
  if (mode) return `${selector} {\n${declarations({ ...colorTokens(preset, mode), ...radiusTokens(preset) }, "  ")}\n}`;
  return [
    `${selector} {\n${declarations({ ...colorTokens(preset, "light"), ...radiusTokens(preset) }, "  ")}\n}`,
    `@media (prefers-color-scheme: dark) {\n  ${selector} {\n${declarations(colorTokens(preset, "dark"), "    ")}\n  }\n}`,
  ].join("\n\n");
}

/**
 * Theme that follows the site: `<html data-theme>` when the toggle was used, otherwise
 * prefers-color-scheme. `scope` limits it to a subtree (e.g. a preview).
 */
export function schemeAwareCss(preset: Preset, scope?: string) {
  const within = (root: string) => (scope ? `${root} ${scope}` : root);
  return [
    themeCss(preset, scope ?? ":root", "light"),
    `@media (prefers-color-scheme: dark) {\n${themeCss(preset, within(':root:not([data-theme="light"])'), "dark")}\n}`,
    themeCss(preset, within(':root[data-theme="dark"]'), "dark"),
  ].join("\n\n");
}

function pick<T extends string>(keys: T[]) {
  return keys[Math.floor(Math.random() * keys.length)]!;
}

export function randomPreset(): Preset {
  return {
    base: pick(Object.keys(BASES) as BaseName[]),
    accent: pick(Object.keys(ACCENTS) as AccentName[]),
    radius: pick(Object.keys(RADII) as RadiusName[]),
  };
}

/** Reads a preset from URL search params, falling back to defaults for anything unknown. */
export function parsePreset(search: Record<string, unknown>): Preset {
  const valid = <T extends string>(value: unknown, options: Record<T, unknown>, fallback: T): T =>
    typeof value === "string" && Object.hasOwn(options, value) ? (value as T) : fallback;
  return {
    base: valid(search.base, BASES, DEFAULT_PRESET.base),
    accent: valid(search.accent, ACCENTS, DEFAULT_PRESET.accent),
    radius: valid(search.radius, RADII, DEFAULT_PRESET.radius),
  };
}
