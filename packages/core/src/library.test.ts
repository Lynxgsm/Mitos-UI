// @vitest-environment node
// Library-wide guards that grow with the number of components (`bun run build` first):
// - every component is wired everywhere it must be (test, story, export, Svelte tests, changelog);
// - the React and Svelte entry points export the same API;
// - Mitosis sources avoid the comments that make the compiler silently drop code.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parse } from "@babel/core";
import typescript from "@babel/plugin-syntax-typescript";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname);
const read = (path: string) => readFileSync(join(SRC, path), "utf8");

const sources = readdirSync(SRC, { recursive: true, encoding: "utf8" }).filter((path) => path.endsWith(".lite.tsx"));
const components = sources.map((source) => ({
  source,
  dir: dirname(source),
  name: read(source).match(/export default function (\w+)/)![1]!,
}));

describe("component inventory", () => {
  const index = read("index.ts");
  const svelteFixture = read("svelte.test.helpers.ts");
  const svelteRenders = read("svelte.server.test.ts");
  const changelog = readFileSync(join(SRC, "../../../CHANGELOG.md"), "utf8");

  it("finds the components", () => {
    expect(components.length).toBeGreaterThan(0);
  });

  it.each(components)("$name is tested, documented in Storybook, exported and in the changelog", ({ source, dir, name }) => {
    const files = readdirSync(join(SRC, dir));
    const missing = [
      !files.some((file) => file.endsWith(".test.tsx")) && `a test in src/${dir}`,
      !files.some((file) => file.endsWith(".stories.tsx")) && `a story in src/${dir}`,
      !index.includes(`export { default as ${name} } from "./${source.replace(/\.tsx$/, "")}"`) && "an export in src/index.ts",
      !index.includes(`export type { ${name}Props`) && `an export of ${name}Props in src/index.ts`,
      !new RegExp(`import \\{[^}]*\\b${name}\\b[^}]*\\} from "\\./index\\.js"`).test(svelteFixture) &&
        "an import in the fixture of svelte.test.helpers.ts",
      !new RegExp(`^\\s+${name}: await html\\(`, "m").test(svelteRenders) && "an entry in renders of svelte.server.test.ts",
      !changelog.includes(`\`${name}\``) && "an entry in CHANGELOG.md",
    ].filter(Boolean);
    expect(missing, `${name} is missing`).toEqual([]);
  });
});

describe("public API", () => {
  const exportsOf = (path: string) =>
    [...readFileSync(join(SRC, path), "utf8").matchAll(/export \{([^}]*)\}/g)]
      .flatMap(([, names]) => names!.split(","))
      .map((name) => name.trim().split(/\s+as\s+/).pop()!)
      .filter((name) => name && !name.startsWith("type "))
      .sort();

  it("is the same for React and Svelte", () => {
    expect(exportsOf("../dist/svelte/index.js")).toEqual(exportsOf("../dist/react/index.js"));
  });

  // a change here is a public API change: record it in CHANGELOG.md (removals are breaking)
  it("matches the recorded list", () => {
    expect(exportsOf("../dist/react/index.js")).toMatchInlineSnapshot(`
      [
        "Accordion",
        "Avatar",
        "Badge",
        "Button",
        "ButtonGroup",
        "Card",
        "Checkbox",
        "Dialog",
        "Fieldset",
        "Input",
        "Menu",
        "RadioGroup",
        "Select",
        "SideNav",
        "Skeleton",
        "Slider",
        "Switch",
        "Tabs",
        "Textarea",
        "Toaster",
        "Tooltip",
        "dismissAllToasts",
        "dismissToast",
        "toast",
      ]
    `);
  });
});

describe("Mitosis sources", () => {
  // An apostrophe or a quote in a comment makes Mitosis join the following code onto the comment line:
  // the build fails, or worse, the code (e.g. a StyleX rule) is silently commented out.
  it.each(sources)("%s has no quotes in comments", (source) => {
    const ast = parse(read(source), { filename: source, babelrc: false, configFile: false, plugins: [[typescript, { isTSX: true }]] });
    const quoted = (ast!.comments ?? []).filter((comment) => /['"]/.test(comment.value)).map((comment) => `line ${comment.loc!.start.line}: ${comment.value.trim()}`);
    expect(quoted).toEqual([]);
  });
});
