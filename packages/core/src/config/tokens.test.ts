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

// Top-level statements and blocks of a stylesheet (brace matching; the generated CSS has no braces in strings).
function topLevelChunks(source: string) {
  const chunks: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === "{") depth++;
    else if (char === "}" && --depth === 0) {
      chunks.push(source.slice(start, i + 1).trim());
      start = i + 1;
    } else if (char === ";" && depth === 0) {
      chunks.push(source.slice(start, i + 1).trim());
      start = i + 1;
    }
  }
  return chunks.filter(Boolean);
}

// Overrides rely on this: unlayered consumer CSS beats every library rule, whatever the load order.
it("ships every rule inside a cascade layer", () => {
  const unlayered = topLevelChunks(css).filter((chunk) => !chunk.startsWith("@layer"));
  expect(unlayered.map((chunk) => chunk.slice(0, 60))).toEqual([]);
});

describe.each([
  ["light", readTokens(lightCss!)],
  ["dark", readTokens(darkCss!)],
])("default theme (%s)", (_, t) => {
  const TEXT = 4.5; // WCAG 1.4.3
  const NON_TEXT = 3; // WCAG 1.4.11

  it.each([
    ["default (button, badge)", t["primary-foreground"], t.primary],
    ["default:hover", t["primary-foreground"], over(t.primary!, 0.9, t.background!)],
    ["secondary (button, badge)", t["secondary-foreground"], t.secondary],
    ["secondary:hover", t["secondary-foreground"], over(t.secondary!, 0.8, t.background!)],
    ["outline / ghost (button, badge)", t.foreground, t.background],
    ["outline / ghost:hover", t["accent-foreground"], t.accent],
    ["link", t.primary, t.background],
    ["destructive (button, badge)", t["destructive-foreground"], t.destructive],
    ["destructive:hover", t["destructive-foreground"], over(t.destructive!, 0.9, t.background!)],
    ["muted text (dialog description)", t["muted-foreground"], t.background],
    ["field error message", t.destructive, t.background],
    ["avatar initials", t.foreground, t.muted],
  ])("%s text contrast ≥ 4.5:1", (_, fg, bg) => {
    expect(contrast(fg!, bg!)).toBeGreaterThanOrEqual(TEXT);
  });

  it.each([
    ["focus ring", t.ring, t.background],
    ["accordion chevron icon", t["muted-foreground"], t.background],
    ["input / textarea border", t.input, t.background],
  ])("%s contrast against the page ≥ 3:1", (_, fg, bg) => {
    expect(contrast(fg!, bg!)).toBeGreaterThanOrEqual(NON_TEXT);
  });
});
