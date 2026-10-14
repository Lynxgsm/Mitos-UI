import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import stylex from "@stylexjs/unplugin";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  // react's vite plugin must come after start's
  plugins: [stylex.vite({ useCSSLayers: true }), tanstackStart(), viteReact()],
});
