import { defineConfig } from "vite";
import stylex from "@stylexjs/unplugin";
import pkg from "./package.json" with { type: "json" };

// Builds the compiled React output into a framework-agnostic-to-consume package:
// plain JS + one precompiled CSS file, so consumers need no StyleX setup.
export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: true })],
  build: {
    outDir: "dist/react",
    lib: { entry: "output/react/src/index.ts", formats: ["es"], fileName: "index" },
    rolldownOptions: {
      external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies),
        /^react\//,
      ],
      // the bundler drops per-module directives; keep components usable from RSC apps (Next.js)
      output: { banner: '"use client";' },
      onwarn: (warning, warn) => warning.code !== "MODULE_LEVEL_DIRECTIVE" && warn(warning),
    },
  },
});
