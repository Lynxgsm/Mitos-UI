import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import stylex from "@stylexjs/unplugin";

// "@/…" in the compiled output (and in tests importing it); StyleX resolves .stylex imports on its own
const reactOutput = fileURLToPath(new URL("./output/react/src", import.meta.url));

export default defineConfig({
  plugins: [
    // stylex.create throws at runtime unless compiled away.
    // shortcut: drop configureServer, its CSS-update interval is only cleared on HTTP close
    // and keeps Vitest from exiting; revisit when @stylexjs/unplugin fixes it.
    { ...stylex.vite({ aliases: { "@/*": [`${reactOutput}/*`] } }), configureServer: undefined },
  ],
  // browser builds in jsdom, like an app bundle (Svelte otherwise resolves to its server runtime)
  resolve: { alias: { "@": reactOutput }, conditions: ["browser"] },
  test: { environment: "jsdom" },
});
