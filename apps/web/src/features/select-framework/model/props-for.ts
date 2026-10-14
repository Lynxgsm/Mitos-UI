import type { Framework } from "@/entities/framework";
import type { PropRow } from "@/shared/ui/props-table";

// A row written for React, with what differs in Svelte when the generic translation is not enough.
export type FrameworkPropRow = PropRow & { svelte?: Partial<PropRow> };

const FORWARDED = "aria-* / data-* / native attributes";

// Rows are written in React terms. In Svelte, content props take text, children is the content between
// the tags, and native event handlers are lowercase: translate those, then apply the overrides of the row.
export function propsFor(framework: Framework, rows: FrameworkPropRow[]): PropRow[] {
  return rows.map(({ svelte, ...row }) => {
    if (framework === "react") return row;
    const translated: PropRow = {
      ...row,
      type: row.type.replace(/\bReactNode\b/g, row.prop === "children" ? "Snippet" : "string"),
      description: row.prop === "children" ? `${row.description} Content between the tags.` : row.description,
    };
    if (row.prop === FORWARDED) {
      translated.description = `${translated.description.replace(/\bon([A-Z])(\w*)/g, (_, first, rest) => `on${first.toLowerCase()}${rest.toLowerCase()}`)} Event handlers are lowercase (oninput, onchange).`;
    }
    return { ...translated, ...svelte };
  });
}
