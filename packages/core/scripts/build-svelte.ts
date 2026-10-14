// Ships the Svelte target as .svelte sources in runes syntax (consumers compile them: SSR works) with StyleX
// already compiled away, so consumers need no StyleX setup. Svelte 5 strips `lang="ts"` itself; the .ts
// files are compiled by tsconfig.svelte.json afterwards. The class names match the React build's, which
// is why both entry points share one stylesheet (svelte.server.test.ts guards that).
// No svelte-package: it relies on the TypeScript JS API, which TypeScript 7 no longer has.
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { transformAsync } from "@babel/core";
import typescript from "@babel/plugin-syntax-typescript";
import stylex from "@stylexjs/babel-plugin";

const source = resolve("output/svelte/src");
const staged = resolve("output/svelte-staged");
const dist = resolve("dist/svelte");

async function compileStylex(code: string, filename: string) {
  if (!code.includes("@stylexjs/stylex")) return code;
  // styles only read in the markup look unused to StyleX, which would drop them: reference them for the compile
  const styles = [...code.matchAll(/const (\w+) = stylex\.create\(/g)].map(([, name]) => name);
  const result = await transformAsync(`${code}\n__omniKeep(${styles.join(", ")});`, {
    babelrc: false,
    configFile: false,
    filename,
    plugins: [
      typescript,
      [
        stylex,
        {
          dev: false,
          runtimeInjection: false,
          treeshakeCompensation: true,
          unstable_moduleResolution: { type: "commonJS", rootDir: process.cwd() },
          aliases: { "@/*": [`${source}/*`] },
        },
      ],
    ],
  });
  return result!.code!.replace(/\n__omniKeep\([^)]*\);/, "");
}

// published files can rely neither on the "@/" alias nor on extensionless imports
function fixImports(code: string, file: string) {
  return code.replace(/((?:from|import)\s+["'])(@\/|\.\.?\/)([^"']+)(["'])/g, (_, start, prefix, path, end) => {
    let target = prefix === "@/" ? relative(dirname(file), join(staged, path)) : prefix + path;
    if (!target.startsWith(".")) target = `./${target}`;
    if (!/\.(svelte|js)$/.test(target)) target += ".js";
    return start + target + end;
  });
}

// the types live in the module script; consumers' native on* handlers fall through to the element
function declaration(code: string) {
  const types = code.match(/<script module lang="ts">([\s\S]*?)<\/script>/)![1]!;
  const props = types.match(/export type (\w+Props)\b/)![1]!;
  const component = props.replace(/Props$/, "");
  return [
    'import type { Component } from "svelte";',
    'import type { HTMLAttributes } from "svelte/elements";',
    types.trim(),
    `declare const ${component}: Component<${props} & Omit<HTMLAttributes<HTMLElement>, keyof ${props}>>;`,
    `export default ${component};`,
    "",
  ].join("\n");
}

rmSync(staged, { recursive: true, force: true });
cpSync(source, staged, { recursive: true });

for (const name of readdirSync(staged, { recursive: true, encoding: "utf8" })) {
  if (!/\.(svelte|ts)$/.test(name)) continue;
  const file = join(staged, name);
  let code = readFileSync(file, "utf8");
  if (name.endsWith(".svelte")) {
    writeFileSync(`${file}.d.ts`, declaration(code));
    const scripts = [...code.matchAll(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/g)];
    for (const [block, open, body, close] of scripts) {
      const compiled = `${open}\n${await compileStylex(body!, `${file}.ts`)}\n${close}`;
      code = code.replace(block, () => compiled);
    }
  } else {
    code = await compileStylex(code, file);
  }
  writeFileSync(file, fixImports(code, file));
}

rmSync(dist, { recursive: true, force: true });
for (const name of readdirSync(staged, { recursive: true, encoding: "utf8" })) {
  if (!/\.svelte(\.d\.ts)?$/.test(name)) continue;
  mkdirSync(dirname(join(dist, name)), { recursive: true });
  cpSync(join(staged, name), join(dist, name));
}
