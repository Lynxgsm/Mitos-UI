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
    Avatar: await html(`<Avatar src="https://example.com/ada.png" alt="Ada Lovelace" /><Avatar alt="Grace Hopper" />`),
    Badge: await html(`<Badge variant="outline" id="status">Passing</Badge>`),
    Card: await html(`<Card title="Plan" description="Billed monthly." headingLevel={2}>Body</Card>`),
    ButtonGroup: await html(`<ButtonGroup aria-label="Alignment"><Button>Left</Button><Button>Right</Button></ButtonGroup>`),
    Skeleton: await html(`<Skeleton class="line" />`),
    Checkbox: await html(`<Checkbox id="terms" label="Terms" error="Required." />`),
    Switch: await html(`<Switch label="Airplane mode" />`),
    RadioGroup: await html(
      `<RadioGroup legend="Plan" name="plan" defaultValue="pro" options={[{ value: "free", label: "Free" }, { value: "pro", label: "Pro" }]} />`,
    ),
    Select: await html(`<Select label="Country" placeholder="Choose" options={[{ value: "fr", label: "France" }]} />`),
    Combobox: await html(
      `<Combobox id="fruit" label="Fruit" name="fruit" defaultValue="apple" options={[{ value: "apple", label: "Apple" }, { value: "pear", label: "Pear" }]} />`,
    ),
    Slider: await html(`<Slider label="Volume" min={0} max={10} />`),
    Fieldset: await html(`<Fieldset legend="Address"><Input label="City" /></Fieldset>`),
    Tabs: await html(
      `<Tabs id="settings" label="Settings" items={[{ value: "a", label: "Account", content: "Account panel" }, { value: "b", label: "Billing", content: "Billing panel" }]} />`,
    ),
    Tooltip: await html(`<Tooltip id="tip" content="Copy to clipboard"><Button>Copy</Button></Tooltip>`),
    Menu: await html(`<Menu id="actions" label="Actions" items={[{ label: "Edit", onSelect: () => {} }]} />`),
    SideNav: await html(
      `<SideNav label="Docs" currentHref="/b" groups={[{ title: "Guides", items: [{ label: "A", href: "/a" }, { label: "B", href: "/b" }] }]} />`,
    ),
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

  it("renders Avatar as an image, or as initials with the same name", () => {
    expect(renders.Avatar).toMatch(/<img[^>]* src="https:\/\/example.com\/ada.png"[^>]* alt="Ada Lovelace"/);
    expect(renders.Avatar).toMatch(/<span role="img" aria-label="Grace Hopper"[^>]*>GH<\/span>/);
  });

  it("renders Badge as a span with forwarded attributes", () => {
    // children may come wrapped in hydration markers (<!---->)
    expect(renders.Badge).toMatch(/<span[^>]* id="status"[^>]*>(<!---->)?Passing(<!---->)?<\/span>/);
  });

  it("renders Card with its title as a heading", () => {
    expect(renders.Card).toMatch(/<div role="heading" aria-level="2"[^>]*>.*Plan/);
    expect(renders.Card).toContain("Billed monthly.");
    expect(renders.Card).toContain("Body");
  });

  it("renders ButtonGroup as a named group of buttons", () => {
    expect(renders.ButtonGroup).toMatch(/<div[^>]* aria-label="Alignment"[^>]* role="group"|<div[^>]* role="group"[^>]* aria-label="Alignment"/);
    expect(renders.ButtonGroup.match(/<button/g)?.length).toBe(2);
  });

  it("renders Skeleton hidden from assistive technologies", () => {
    expect(renders.Skeleton).toMatch(/<div[^>]* aria-hidden="true"[^>]* class="[^"]* line"/);
  });

  it("renders the form controls on their native elements", () => {
    expect(renders.Checkbox).toMatch(/<input[^>]* type="checkbox"[^>]* aria-invalid="true"[^>]* aria-describedby="terms-error"/);
    expect(renders.Switch).toMatch(/<input[^>]* type="checkbox"[^>]* role="switch"|<input[^>]* role="switch"[^>]* type="checkbox"/);
    expect(renders.RadioGroup).toMatch(/<fieldset[^>]* role="radiogroup"/);
    expect(renders.RadioGroup).toMatch(/<input[^>]* value="pro"[^>]* checked/);
    expect(renders.Select).toMatch(/<select[^>]*>.*<option value="">.*Choose.*<option value="fr"/s);
    expect(renders.Combobox).toMatch(/<input[^>]* role="combobox"[^>]* aria-expanded="false"[^>]* aria-controls="fruit-listbox"/);
    expect(renders.Combobox).toMatch(/<input[^>]* value="Apple"/);
    expect(renders.Combobox).toMatch(/<div[^>]* hidden[^>]*>\s*<ul[^>]* role="listbox" id="fruit-listbox"|<div[^>]* hidden[^>]*><ul[^>]* role="listbox"[^>]* id="fruit-listbox"/);
    expect(renders.Combobox).toMatch(/<input type="hidden" name="fruit" value="apple"/);
    expect(renders.Slider).toContain("--mitos-slider-fill:50%");
    expect(renders.Slider).toMatch(/<input[^>]* type="range"[^>]* min="0"|<input[^>]* min="0"[^>]* type="range"/);
    expect(renders.Fieldset).toMatch(/<fieldset[^>]*>.*<legend[^>]*>.*Address.*<\/legend>.*<input/s);
  });

  it("renders Tabs, Tooltip and Menu with their ARIA patterns", () => {
    expect(renders.Tabs).toMatch(/<div role="tablist"[^>]* aria-label="Settings"/);
    expect(renders.Tabs).toMatch(/<button[^>]* role="tab"[^>]* aria-selected="true"[^>]* aria-controls="settings-panel-0"/);
    expect(renders.Tabs).toMatch(/<div role="tabpanel"[^>]* id="settings-panel-1"[^>]* hidden/);
    expect(renders.Tooltip).toMatch(/<span[^>]* role="tooltip" id="tip"[^>]* hidden/);
    expect(renders.Menu).toMatch(/<button[^>]* aria-haspopup="menu"[^>]* aria-expanded="false"/);
    expect(renders.Menu).toMatch(/<div[^>]* role="menu"[^>]* aria-labelledby="actions-trigger"[^>]* hidden/);
  });

  it("renders SideNav as a named nav with the current link marked", () => {
    expect(renders.SideNav).toMatch(/<nav[^>]* aria-label="Docs"/);
    expect(renders.SideNav).toMatch(/<ul aria-label="Guides"/);
    expect(renders.SideNav).toMatch(/<a href="\/b" aria-current="page"/);
    expect(renders.SideNav).not.toMatch(/<a href="\/a" aria-current/);
  });

  const css = readFileSync("dist/react/assets/stylex.css", "utf8");
  it.each(Object.entries(renders))("%s only uses classes shipped in the shared stylesheet", (_, body) => {
    const classes = [...body.matchAll(/class="([^"]*)"/g)].flatMap(([, list]) => list!.split(/\s+/));
    const missing = classes.filter((name) => name.startsWith("x") && !css.includes(`.${name}`));
    expect(missing).toEqual([]);
  });
});

