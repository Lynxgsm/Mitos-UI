import { describe, expect, it } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compile } from "svelte/compiler";

// Bun has no import.meta.glob: compare the catalog with the files directly
const catalog = await Bun.file(join(import.meta.dir, "blocks.ts")).text();
const ids = [...catalog.matchAll(/\{ id: "([^"]+)"/g)].map(([, id]) => id);
const all = readdirSync(join(import.meta.dir, "../blocks"));
const files = all.filter((file) => file.endsWith(".tsx")).map((file) => file.replace(/\.tsx$/, ""));
const read = (file: string) => readFileSync(join(import.meta.dir, "../blocks", file), "utf8");

describe("blocks catalog", () => {
  it("lists every block file exactly once", () => {
    expect([...ids].sort()).toEqual([...files].sort());
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only the library in block sources, so they can be copied as they are", () => {
    for (const file of files) {
      const source = read(`${file}.tsx`);
      const imports = [...source.matchAll(/from "([^"]+)"/g)].map(([, from]) => from);
      expect(imports.filter((from) => from !== "@omni/core/react" && from !== "react"), file).toEqual([]);
    }
  });

  it("has a Svelte version of every block, and nothing else", () => {
    expect(all.filter((file) => file.endsWith(".svelte")).map((file) => file.replace(/\.svelte$/, "")).sort()).toEqual([...files].sort());
    expect(all.filter((file) => !/\.(tsx|svelte)$/.test(file))).toEqual([]);
  });

  it.each(files)("%s.svelte compiles for the server and the browser without warnings, importing only the library", (file) => {
    const source = read(`${file}.svelte`);
    for (const generate of ["server", "client"] as const) {
      const { warnings } = compile(source, { generate, filename: `${file}.svelte` });
      expect(warnings.map((warning) => `${warning.code}: ${warning.message}`)).toEqual([]);
    }
    const imports = [...source.matchAll(/from "([^"]+)"/g)].map(([, from]) => from);
    expect(imports.filter((from) => from !== "@omni/core/svelte" && from !== "svelte")).toEqual([]);
  });
});
