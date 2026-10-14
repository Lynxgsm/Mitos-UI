import { DEFAULT_PRESET, SITE_PRESET, schemeAwareCss, themeCss } from "@/entities/theme";

// In a layer declared after the library's: beats its defaults, while unlayered app CSS still wins.
// - the site wears its brand theme (Stone + Ember);
// - .omni-default-theme previews show what the package really ships (Neutral, no accent);
// - code blocks are always VS Code dark, so their controls use dark tokens.
export const SITE_THEME_CSS = `@layer site-theme {
:root { color-scheme: light dark; }
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }

${schemeAwareCss(SITE_PRESET)}

${schemeAwareCss(DEFAULT_PRESET, ".omni-default-theme")}

${themeCss(DEFAULT_PRESET, ".code-block", "dark")}
}`;
