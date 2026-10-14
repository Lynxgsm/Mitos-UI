import { DEFAULT_PRESET, SITE_PRESET, schemeAwareCss, themeCss } from "../create/themes";

export const THEME_STORAGE_KEY = "omni-theme";

// Runs in <head> before first paint, so a stored choice never flashes the system scheme.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

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

${themeCss(DEFAULT_PRESET, ".docs-code", "dark")}
}`;
