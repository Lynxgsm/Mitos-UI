// Every component the library exports has its docs: a page slice, a route and an entry in the docs nav.
import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as library from "@lynxgsm/omni-ui/react";

const SRC = join(import.meta.dir, "..");
// docs pages named after the feature rather than the component
const PAGE_OF: Record<string, string> = { Toaster: "toast" };

const components = Object.keys(library).filter((name) => /^[A-Z]/.test(name));
const slug = (name: string) => PAGE_OF[name] ?? name.replace(/(?<!^)([A-Z])/g, "-$1").toLowerCase();
const nav = readFileSync(join(SRC, "widgets/docs-layout/model/nav.ts"), "utf8");

describe("component docs", () => {
  it("finds the exported components", () => {
    expect(components).toContain("ButtonGroup");
    expect(slug("ButtonGroup")).toBe("button-group");
  });

  it.each(components)("%s has a docs page, a route and a nav entry", (name) => {
    const page = slug(name);
    const missing = [
      !existsSync(join(SRC, `pages/docs/${page}/index.ts`)) && `src/pages/docs/${page}`,
      !existsSync(join(SRC, `app/routes/docs/components/${page}.tsx`)) && `src/app/routes/docs/components/${page}.tsx`,
      !nav.includes(`href: "/docs/components/${page}"`) && "an entry in widgets/docs-layout/model/nav.ts",
    ].filter(Boolean);
    expect(missing).toEqual([]);
  });
});
