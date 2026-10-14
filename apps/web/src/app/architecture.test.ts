// Guards the FSD rules of ARCHITECTURE.md: imports only go down the layers, slices of one layer don't
// import each other, and other slices are reached through their public API (index.ts).
import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";

const SRC = join(import.meta.dir, "..");
const LAYERS = ["shared", "entities", "features", "widgets", "pages", "app"] as const;
type Layer = (typeof LAYERS)[number];

// `shared/ui/tabs`, `pages/docs/button`: one level deeper for shared segments and the docs slice group
function sliceOf(path: string) {
  const parts = path.split("/");
  const depth = parts[0] === "shared" || path.startsWith("pages/docs/") ? 3 : 2;
  return parts.slice(0, depth).join("/");
}

const transpiler = new Bun.Transpiler({ loader: "tsx" });
const files = readdirSync(SRC, { recursive: true, encoding: "utf8" }).filter(
  (path) => /\.tsx?$/.test(path) && !path.endsWith("routeTree.gen.ts"),
);

function violations(path: string, source = readFileSync(join(SRC, path), "utf8")) {
  const layer = path.split("/")[0] as Layer;
  const found: string[] = [];
  // the transpiler sees real imports only, not `import` lines inside code samples shown on the site
  for (const { path: specifier } of transpiler.scanImports(source)) {
    if (specifier.startsWith("@/")) {
      const target = specifier.slice(2).split("?")[0]!;
      const targetLayer = target.split("/")[0] as Layer;
      if (LAYERS.indexOf(targetLayer) > LAYERS.indexOf(layer)) found.push(`${specifier}: higher layer`);
      else if (targetLayer === layer && layer !== "shared" && sliceOf(target) !== sliceOf(path))
        found.push(`${specifier}: same-layer slice`);
      if (target !== sliceOf(target)) found.push(`${specifier}: not the public API`);
    } else if (specifier.startsWith(".") && layer !== "app") {
      const target = relative(SRC, normalize(join(SRC, dirname(path), specifier.split("?")[0]!)));
      if (sliceOf(target) !== sliceOf(path)) found.push(`${specifier}: relative import out of the slice`);
    }
  }
  return found;
}

describe("FSD boundaries", () => {
  it("has files in every layer", () => {
    for (const layer of LAYERS) expect(files.some((path) => path.startsWith(`${layer}/`))).toBe(true);
  });

  it.each(files)("%s respects the dependency rules", (path) => {
    expect(violations(path)).toEqual([]);
  });

  it("reports each kind of violation", () => {
    const check = (path: string, specifier: string) => violations(path, `import { x } from "${specifier}";\nx;`);
    expect(check("entities/theme/model/theme.ts", "@/features/select-framework")).toEqual([
      "@/features/select-framework: higher layer",
    ]);
    expect(check("widgets/docs-layout/ui/docs-layout.tsx", "@/widgets/site-header")).toEqual([
      "@/widgets/site-header: same-layer slice",
    ]);
    expect(check("pages/landing/ui/landing-page.tsx", "@/entities/framework/model/selected-framework")).toEqual([
      "@/entities/framework/model/selected-framework: not the public API",
    ]);
    expect(check("pages/docs/button/ui/button-page.tsx", "../../input/examples/input-demo")).toEqual([
      "../../input/examples/input-demo: relative import out of the slice",
    ]);
    // allowed: inside a slice, between shared segments, down the layers, code samples in strings
    expect(check("pages/docs/button/ui/button-page.tsx", "../examples/button-demo?raw")).toEqual([]);
    expect(check("shared/ui/install-command/install-command.tsx", "@/shared/ui/tabs")).toEqual([]);
    expect(check("features/select-framework/ui/framework-code.tsx", "@/entities/framework")).toEqual([]);
    expect(violations("pages/landing/ui/landing-page.tsx", 'const code = `\nimport { x } from "@/app/router";\n`;')).toEqual([]);
  });
});
