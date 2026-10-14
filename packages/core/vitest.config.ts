import { defineConfig } from "vitest/config";
import stylex from "@stylexjs/unplugin";

export default defineConfig({
  plugins: [
    // stylex.create throws at runtime unless compiled away.
    // shortcut: drop configureServer, its CSS-update interval is only cleared on HTTP close
    // and keeps Vitest from exiting; revisit when @stylexjs/unplugin fixes it.
    { ...stylex.vite(), configureServer: undefined },
  ],
  test: { environment: "jsdom" },
});
