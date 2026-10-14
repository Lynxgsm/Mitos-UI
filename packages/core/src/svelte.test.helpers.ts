// Shared by svelte.server.test.ts and svelte.client.test.ts: the published Svelte build (`bun run build` first)
// compiled the way an app's bundler would, and fixtures that use it from a real Svelte template.
import { cpSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { compile } from "svelte/compiler";
import { expect } from "vitest";

export type Generate = "server" | "client";

// the package compiled the way an app's bundler would, once per target
function compilePackage(generate: Generate) {
  const out = resolve(`output/svelte-${generate}`);
  rmSync(out, { recursive: true, force: true });
  cpSync("dist/svelte", out, { recursive: true });
  for (const file of readdirSync(out, { recursive: true, encoding: "utf8" }).filter((name) => name.endsWith(".svelte"))) {
    const { js, warnings } = compile(readFileSync(`${out}/${file}`, "utf8"), { generate, filename: file });
    expect(warnings.map((warning) => warning.code), file).toEqual([]);
    writeFileSync(`${out}/${file}.js`, js.code);
  }
  writeFileSync(`${out}/index.js`, readFileSync(`${out}/index.js`, "utf8").replaceAll('.svelte"', '.svelte.js"'));
  return out;
}

const outputs: Partial<Record<Generate, string>> = {};

// used the way an app would: from a compiled Svelte template, so snippets and events go through the real path
export async function fixture(generate: Generate, markup: string) {
  const source = `<script>
  import { Accordion, Button, Dialog, Input, Textarea, Toaster, toast } from "./index.js";
  let { spy = () => {}, spy2 = () => {} } = $props();
  let open = $state(false);
</script>
${markup}`;
  outputs[generate] ??= compilePackage(generate);
  const file = `${outputs[generate]}/fixture-${Math.random().toString(36).slice(2)}.svelte.js`;
  writeFileSync(file, compile(source, { generate }).js.code);
  return (await import(file)).default;
}

