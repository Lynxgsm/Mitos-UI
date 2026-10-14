import { describe, expect, it } from "bun:test";
import { propsFor } from "./props-for";

const ROWS = [
  { prop: "label", type: "ReactNode", description: "Visible label." },
  { prop: "children", type: "ReactNode", description: "Body content." },
  { prop: "options", type: "{ value, label: ReactNode }[]", description: "The choices." },
  { prop: "checked / defaultChecked", type: "boolean", description: "Controlled or initial state.", svelte: { prop: "checked", description: "Checked state." } },
  { prop: "aria-* / data-* / native attributes", type: "—", description: "Forwarded to the <fieldset> (onChange included)." },
];

describe("propsFor", () => {
  it("keeps the React rows as written, without the Svelte overrides", () => {
    expect(propsFor("react", ROWS)).toEqual(ROWS.map(({ svelte, ...row }) => row));
  });

  it("translates the React-only types and handlers for Svelte, then applies the overrides", () => {
    const [label, children, options, checked, forwarded] = propsFor("svelte", ROWS);
    expect(label!.type).toBe("string");
    expect(children).toEqual({ prop: "children", type: "Snippet", description: "Body content. Content between the tags." });
    expect(options!.type).toBe("{ value, label: string }[]");
    expect(checked).toEqual({ prop: "checked", type: "boolean", description: "Checked state." });
    expect(forwarded!.description).toBe(
      "Forwarded to the <fieldset> (onchange included). Event handlers are lowercase (oninput, onchange).",
    );
  });
});
