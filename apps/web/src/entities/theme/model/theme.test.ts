// Every preset the /create page can produce must meet WCAG AA, in light and dark mode.
import { describe, expect, it } from "bun:test";
import { ACCENTS, BASES, colorTokens, parsePreset, RADII, schemeAwareCss, themeCss, type Preset } from "./theme";

function rgb(hex: string) {
  const h = hex.slice(1);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function over(color: string, alpha: number, backdrop: string) {
  const [a, b] = [rgb(color), rgb(backdrop)];
  return "#" + a.map((c, i) => Math.round(c * alpha + b[i]! * (1 - alpha)).toString(16).padStart(2, "0")).join("");
}

function contrast(fg: string, bg: string) {
  const luminance = (hex: string) => {
    const [r, g, b] = rgb(hex).map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  };
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

const presets: Preset[] = Object.keys(BASES).flatMap((base) =>
  Object.keys(ACCENTS).map((accent) => ({ base, accent, radius: "default" }) as Preset),
);

describe.each(["light", "dark"] as const)("%s mode", (mode) => {
  it.each(presets.map((p) => [`${p.base} + ${p.accent}`, p] as const))("%s meets WCAG AA", (_, preset) => {
    const t = colorTokens(preset, mode);
    const text: [string, string, string][] = [
      ["default", t["primary-foreground"]!, t.primary!],
      ["default:hover", t["primary-foreground"]!, over(t.primary!, 0.9, t.background!)],
      ["secondary", t["secondary-foreground"]!, t.secondary!],
      ["secondary:hover", t["secondary-foreground"]!, over(t.secondary!, 0.8, t.background!)],
      ["outline / ghost", t.foreground!, t.background!],
      ["outline / ghost:hover", t["accent-foreground"]!, t.accent!],
      ["link", t.primary!, t.background!],
      ["muted text", t["muted-foreground"]!, t.background!],
      ["field error message", t.destructive!, t.background!],
      ["destructive", t["destructive-foreground"]!, t.destructive!],
    ];
    for (const [name, fg, bg] of text) expect({ name, ratio: contrast(fg, bg) >= 4.5 }).toEqual({ name, ratio: true });
    expect(contrast(t.ring!, t.background!)).toBeGreaterThanOrEqual(3);
    expect(contrast(t.input!, t.background!)).toBeGreaterThanOrEqual(3);
  });
});

describe("themeCss", () => {
  const preset: Preset = { base: "slate", accent: "blue", radius: "large" };

  it("declares every token in light, and colors again under the dark media query", () => {
    const css = themeCss(preset);
    const [light, dark] = css.split("@media (prefers-color-scheme: dark)");
    for (const name of Object.keys(colorTokens(preset, "light"))) {
      expect(light).toContain(`--omni-${name}:`);
      expect(dark).toContain(`--omni-${name}:`);
    }
    expect(light).toContain("--omni-radius-lg: 0.75rem;");
    expect(dark).not.toContain("radius");
  });

  it("forces a single scheme on a custom selector", () => {
    const css = themeCss(preset, ".preview", "dark");
    expect(css.startsWith(".preview {")).toBe(true);
    expect(css).not.toContain("@media");
    expect(css).toContain(`--omni-background: ${BASES.slate.scale[950]};`);
  });

  it("never produces a negative radius", () => {
    expect(themeCss({ ...preset, radius: "none" })).toContain("max(0px, calc(0rem - 4px))");
    expect(Object.keys(RADII)).toContain("none");
  });
});

describe("schemeAwareCss", () => {
  it("follows the system unless the site forces a scheme", () => {
    const css = schemeAwareCss({ base: "stone", accent: "ember", radius: "default" }, ".preview");
    expect(css).toContain(".preview {");
    expect(css).toContain('@media (prefers-color-scheme: dark) {\n:root:not([data-theme="light"]) .preview {');
    expect(css).toContain(':root[data-theme="dark"] .preview {');
  });
});

describe("parsePreset", () => {
  it("reads valid values and falls back on unknown ones", () => {
    expect(parsePreset({ base: "zinc", accent: "rose", radius: "xl" })).toEqual({ base: "zinc", accent: "rose", radius: "xl" });
    expect(parsePreset({ base: "pink", accent: 3, radius: "__proto__" })).toEqual({
      base: "neutral",
      accent: "default",
      radius: "default",
    });
  });
});
