// Checks the shipped CSS (`bun run build` first): the default theme must meet WCAG AA in light and dark mode.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("dist/react/assets/stylex.css", "utf8");
const [lightCss, darkCss] = css.split("@media (prefers-color-scheme: dark)");

function readTokens(block: string) {
  const tokens: Record<string, string> = {};
  // first match wins: lightningcss writes the hex fallback before its lab() version
  for (const [, name, hex] of block.matchAll(/--omni-([\w-]+):\s*(#[0-9a-f]{3,8})\b/gi)) tokens[name!] ??= hex!;
  return tokens;
}

function rgb(hex: string) {
  const h = hex.slice(1);
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

// `color` painted at `alpha` over `backdrop`, like `color-mix(…, transparent)` on the page
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

describe.each([
  ["light", readTokens(lightCss!)],
  ["dark", readTokens(darkCss!)],
])("default theme (%s)", (_, t) => {
  const TEXT = 4.5; // WCAG 1.4.3
  const NON_TEXT = 3; // WCAG 1.4.11

  it.each([
    ["default", t["primary-foreground"], t.primary],
    ["default:hover", t["primary-foreground"], over(t.primary!, 0.9, t.background!)],
    ["secondary", t["secondary-foreground"], t.secondary],
    ["secondary:hover", t["secondary-foreground"], over(t.secondary!, 0.8, t.background!)],
    ["outline / ghost", t.foreground, t.background],
    ["outline / ghost:hover", t["accent-foreground"], t.accent],
    ["link", t.primary, t.background],
    ["destructive", t["destructive-foreground"], t.destructive],
    ["destructive:hover", t["destructive-foreground"], over(t.destructive!, 0.9, t.background!)],
  ])("%s text contrast ≥ 4.5:1", (_, fg, bg) => {
    expect(contrast(fg!, bg!)).toBeGreaterThanOrEqual(TEXT);
  });

  it("focus ring contrast against the page ≥ 3:1", () => {
    expect(contrast(t.ring!, t.background!)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});
