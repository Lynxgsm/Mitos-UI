import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import stylex from "@stylexjs/unplugin";
import pkg from "./package.json" with { type: "json" };

// "@/…" in the compiled output; StyleX resolves .stylex imports on its own, hence both aliases
const reactOutput = fileURLToPath(new URL("./output/react/src", import.meta.url));

// shortcut: StyleX emits its priority-0 group unlayered when it starts with a rule of priority exactly 0
// (any stylex.keyframes), which drags the --mitos-* tokens out of their layer and breaks the "overrides
// win regardless of load order" guarantee. Move those rules into the layer StyleX already declares for
// them (priority1). Remove once StyleX layers that group itself; tokens.test.ts guards the result.
function layerStrayRules(): Plugin {
  let outDir = "";
  return {
    name: "mitos:layer-stray-rules",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    // closeBundle: the StyleX plugin writes its stylesheet after the bundle itself
    closeBundle() {
      const files = readdirSync(outDir, { recursive: true, encoding: "utf8" }).filter((name) => name.endsWith(".css"));
      for (const file of files) {
        const path = `${outDir}/${file}`;
        const layered: string[] = [];
        const stray: string[] = [];
        let depth = 0;
        let start = 0;
        const source = readFileSync(path, "utf8");
        for (let i = 0; i < source.length; i++) {
          const char = source[i];
          const end = (char === "}" && --depth === 0) || (char === ";" && depth === 0);
          if (char === "{") depth++;
          if (!end) continue;
          const chunk = source.slice(start, i + 1).trim();
          (chunk.startsWith("@layer") ? layered : stray).push(chunk);
          start = i + 1;
        }
        if (stray.length) writeFileSync(path, `${layered.join("\n\n")}\n\n@layer priority1 {\n${stray.join("\n\n")}\n}\n`);
      }
    },
  };
}

// Builds the compiled React output into a framework-agnostic-to-consume package:
// plain JS + one precompiled CSS file, so consumers need no StyleX setup.
export default defineConfig({
  // useCSSLayers keeps defaults (incl. --mitos-* tokens) in @layer, so any unlayered consumer CSS
  // like `:root { --mitos-primary: red }` overrides them regardless of load order. Don't disable.
  plugins: [stylex.vite({ useCSSLayers: true, aliases: { "@/*": [`${reactOutput}/*`] } }), layerStrayRules()],
  resolve: { alias: { "@": reactOutput } },
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
