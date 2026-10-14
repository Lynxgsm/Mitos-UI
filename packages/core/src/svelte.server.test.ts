// @vitest-environment node
// The Svelte build renders on the server (no warnings from the Svelte 5 compiler) and only uses classes that
// exist in the stylesheet it shares with React.
import { readFileSync } from "node:fs";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import { fixture } from "./svelte.test.helpers";

describe("Svelte build: server", async () => {
  const html = async (markup: string) => render(await fixture("server", markup)).body;
  const renders = {
    Button: await html(`<Button variant="outline" class="custom" aria-label="Close">×</Button>`),
    Accordion: await html(`<Accordion id="faq" items={[{ title: "Question", content: "Answer" }]} defaultOpen={[0]} />`),
    Dialog: await html(`<Dialog id="confirm" open={false} title="Delete file?" description="This cannot be undone.">Body</Dialog>`),
    Input: await html(`<Input id="email" label="Email" error="Required" required />`),
    Textarea: await html(`<Textarea label="Message" />`),
    Toaster: await html(`<Toaster />`),
  };

  it("renders Button with its defaults, forwarded attributes and merged class", () => {
    expect(renders.Button).toMatch(/<button[^>]* aria-label="Close"/);
    expect(renders.Button).toMatch(/<button[^>]* type="button"/);
    expect(renders.Button).toMatch(/class="[^"]* custom"/);
    expect(renders.Button).toMatch(/<button[^>]*>.*×.*<\/button>/);
  });

  it("renders Accordion items with their open state", () => {
    expect(renders.Accordion).toMatch(/<button[^>]* id="faq-trigger-0"[^>]* aria-expanded="true"/);
    expect(renders.Accordion).toContain("Answer");
  });

  it("labels Dialog with its title and description", () => {
    expect(renders.Dialog).toMatch(/<dialog[^>]* aria-labelledby="confirm-title"[^>]* aria-describedby="confirm-description"/);
    expect(renders.Dialog).toContain("Delete file?");
    expect(renders.Dialog).toContain("Body");
  });

  it("links Input to its error message", () => {
    expect(renders.Input).toMatch(/<input[^>]* aria-invalid="true"[^>]* aria-describedby="email-error"/);
    // declared for the asterisk, still forwarded to the field
    expect(renders.Input).toMatch(/<input[^>]* required/);
  });

  it("renders Textarea and Toaster", () => {
    expect(renders.Textarea).toContain("<textarea");
    expect(renders.Toaster).toContain('aria-label="Notifications"');
  });

  const css = readFileSync("dist/react/assets/stylex.css", "utf8");
  it.each(Object.entries(renders))("%s only uses classes shipped in the shared stylesheet", (_, body) => {
    const classes = [...body.matchAll(/class="([^"]*)"/g)].flatMap(([, list]) => list!.split(/\s+/));
    const missing = classes.filter((name) => name.startsWith("x") && !css.includes(`.${name}`));
    expect(missing).toEqual([]);
  });
});

