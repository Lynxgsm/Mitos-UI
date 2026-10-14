import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import tsx from "shiki/langs/tsx.mjs";
import css from "shiki/langs/css.mjs";
import bash from "shiki/langs/bash.mjs";
import svelte from "shiki/langs/svelte.mjs";
import darkPlus from "shiki/themes/dark-plus.mjs";

export type CodeLanguage = "tsx" | "css" | "bash" | "svelte" | "text";

// VS Code's own grammars and Dark+ theme. Synchronous, so server and client render the same colors.
const highlighter = createHighlighterCoreSync({
  themes: [darkPlus],
  langs: [tsx, css, bash, svelte],
  engine: createJavaScriptRegexEngine(),
});

export function highlight(code: string, lang: CodeLanguage) {
  if (lang === "text") return code.split("\n").map((line) => [{ content: line, color: undefined }]);
  return highlighter.codeToTokens(code, { lang, theme: "dark-plus" }).tokens;
}
