// Mitosis only emits Svelte 4 syntax; svelteRunes rewrites its (formatted) output to Svelte 5 runes.
const svelteRunes = () => ({
  json: {
    // Svelte reserves `class` as a prop name: Mitosis refuses `props.class`, so it goes through `className`.
    // Mutate in place: Mitosis passes the original json to every pre plugin and keeps only the last result.
    pre: (json) => {
      Object.assign(json, JSON.parse(JSON.stringify(json).replace(/props\.class\b/g, "props.className")));
    },
  },
  code: {
    post: (code, json) => {
      // props: `export let x = d` → one $props() object (the forwarded attributes are read from it, like React's
      // `props`) destructured through $derived so every prop stays reactive
      const props = [];
      code = code.replace(/^ *export let (\w+)(?:: [^=;\n]+)?(?: = ([^;\n]+))?;\n/gm, (_, name, value) => {
        const key = name === "className" ? "class: className" : name;
        props.push(value && value !== "undefined" ? `${key} = ${value}` : key);
        return "";
      });
      const svelteImports = new Set();
      const slotted = /<slot \/>/.test(code);
      if (slotted) props.push("children");

      // state: Mitosis data → $state; refs → $state when bound to an element, plain variables otherwise
      // (Mitosis declares only the bound ones)
      for (const [name, value] of Object.entries(json.state)) {
        if (value.type !== "property") continue;
        code = code.replace(new RegExp(`^( *)let ${name} = ([\\s\\S]*?);$`, "m"), (_, indent, value) => {
          // a prop in the initial value is read once, on purpose (React's useState): say so to Svelte
          const readsProp = props.some((prop) => new RegExp(`\\b${prop.split(/[ =:]/)[0]}\\b`).test(value));
          if (readsProp) svelteImports.add("untrack");
          return `${indent}let ${name} = $state(${readsProp ? `untrack(() => ${value})` : value});`;
        });
      }
      const refs = Object.entries(json.refs).map(([name, ref]) => {
        const nullable = ref.argument === "null" && !/\bnull\b/.test(ref.typeParameter);
        const type = ref.typeParameter ? `: ${nullable ? `(${ref.typeParameter}) | null` : ref.typeParameter}` : "";
        const value = ref.argument || "null";
        code = code.replace(new RegExp(`^ *let ${name};\n`, "m"), "");
        return `let ${name}${type} = ${code.includes(`bind:this={${name}}`) ? `$state(${value})` : value};`;
      });

      code = code
        .replace(
          '<script lang="ts">',
          [
            '<script lang="ts">',
            ...(svelteImports.size ? [`  import { ${[...svelteImports].join(", ")} } from "svelte";`] : []),
            `  let props: ${json.propsTypeRef} = $props();`,
            `  let { ${props.join(", ")} } = $derived(props);`,
            ...refs.map((ref) => `  ${ref}`),
          ].join("\n"),
        )
        .replace(/<script context="module"/, "<script module")
        // Mitosis turns a bare `props` into `$$props`
        .replace(/\$\$props\b/g, "props")
        // getters are plain functions: runes track what they read wherever they are called
        .replace(/^( *)\$: (\w+) = \(\) =>/gm, "$1const $2 = () =>")
        // onUpdate with dependencies
        .replace(/^( *)\$: (onUpdateFn_\d+\(\.\.\.\[[^\]]*\]\));/gm, "$1$effect(() => {\n$1  $2;\n$1});")
        .replace(/\{#if \$\$slots\.default\}/g, "{#if children}")
        .replace(/<slot \/>/g, "{@render children?.()}")
        // Svelte 5 warns on self-closing non-void elements
        .replace(/<textarea\b([^<]*?)\s*\/>/g, "<textarea$1></textarea>");

      // events: `on:x` → `onx`. On the element receiving the forwarded attributes, a consumer's own `onx` would be
      // overridden by the component's, so the component's handler calls it first.
      const lines = code.split("\n");
      let rootIndent = null;
      for (let i = 0; i < lines.length; i++) {
        const indent = lines[i].match(/^ */)[0].length;
        if (lines[i].trim() === "{...attributes()}") rootIndent = indent;
        else if (rootIndent !== null && indent < rootIndent) rootIndent = null;
        lines[i] = lines[i].replace(/\bon:(\w+)=\{\((\w+)\) => \{$/, (_, event, arg) =>
          indent === rootIndent
            ? `on${event}={(${arg}) => {\n${" ".repeat(indent + 2)}attributes().on${event}?.(${arg});`
            : `on${event}={(${arg}) => {`,
        );
      }
      code = lines.join("\n");

      const legacy = code.match(/\bexport let\b|\$:|\$\$\w+|\bon:\w+|<slot\b|\bafterUpdate\b|\bbeforeUpdate\b/);
      if (legacy) throw new Error(`${json.name}: no Svelte 5 rewrite for "${legacy[0]}" (mitosis.config.cjs)`);
      return code;
    },
  },
});

/** @type {import('@builder.io/mitosis').MitosisConfig} */
module.exports = {
  files: "src/**",
  exclude: ["src/**/*.test.*", "src/**/*.stories.*"],
  targets: ["react", "svelte"],
  commonOptions: { typescript: true },
  options: { svelte: { plugins: [svelteRunes] } },
};
