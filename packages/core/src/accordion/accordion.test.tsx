/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Accordion from "@/accordion/accordion";

afterEach(cleanup);

const ITEMS = [
  { title: "Shipping", content: "Ships in 2 days." },
  { title: "Returns", content: "30 days to return." },
  { title: "Warranty", content: "2 years.", disabled: true },
  { title: "Support", content: "Email us." },
];

const trigger = (name: string) => screen.getByRole("button", { name });
const panelOf = (button: HTMLElement) => document.getElementById(button.getAttribute("aria-controls")!)!;

describe("Accordion", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Accordion items={ITEMS} defaultOpen={[0]} />);
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("renders a definition list: one <dt> header button and one <dd> panel per item", () => {
    const { container } = render(<Accordion items={ITEMS} />);
    const list = container.querySelector("dl")!;
    expect(list.querySelectorAll(":scope > div > dt > button")).toHaveLength(ITEMS.length);
    expect(list.querySelectorAll(":scope > div > dd")).toHaveLength(ITEMS.length);
  });

  it("links each header to its panel and starts collapsed", () => {
    render(<Accordion items={ITEMS} />);
    const button = trigger("Shipping");
    const panel = panelOf(button);
    expect(panel.tagName).toBe("DD");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    // inert: removed from tab order and accessibility tree while collapsed
    expect(panel.hasAttribute("inert")).toBe(true);
  });

  it("expands and collapses on click", () => {
    render(<Accordion items={ITEMS} />);
    const button = trigger("Shipping");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(panelOf(button).hasAttribute("inert")).toBe(false);
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(panelOf(button).hasAttribute("inert")).toBe(true);
  });

  it("keeps a single item open by default", () => {
    render(<Accordion items={ITEMS} />);
    fireEvent.click(trigger("Shipping"));
    fireEvent.click(trigger("Returns"));
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("false");
    expect(trigger("Returns").getAttribute("aria-expanded")).toBe("true");
  });

  it("allows several open items with `multiple`", () => {
    render(<Accordion items={ITEMS} multiple />);
    fireEvent.click(trigger("Shipping"));
    fireEvent.click(trigger("Returns"));
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("true");
    expect(trigger("Returns").getAttribute("aria-expanded")).toBe("true");
  });

  it("opens the items listed in `defaultOpen`", () => {
    render(<Accordion items={ITEMS} multiple defaultOpen={[1, 3]} />);
    expect(trigger("Shipping").getAttribute("aria-expanded")).toBe("false");
    expect(trigger("Returns").getAttribute("aria-expanded")).toBe("true");
    expect(trigger("Support").getAttribute("aria-expanded")).toBe("true");
  });

  it("does not toggle a disabled item", () => {
    render(<Accordion items={ITEMS} />);
    const button = trigger("Warranty") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("moves focus between headers with ArrowDown/ArrowUp/Home/End, wrapping and skipping disabled ones", () => {
    render(<Accordion items={ITEMS} />);
    trigger("Shipping").focus();

    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(trigger("Returns"));
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(trigger("Support")); // Warranty is disabled
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(trigger("Shipping")); // wraps
    fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });
    expect(document.activeElement).toBe(trigger("Support")); // wraps back
    fireEvent.keyDown(document.activeElement!, { key: "Home" });
    expect(document.activeElement).toBe(trigger("Shipping"));
    fireEvent.keyDown(document.activeElement!, { key: "End" });
    expect(document.activeElement).toBe(trigger("Support"));
  });

  it("keeps arrow navigation inside its own accordion when nested", () => {
    render(
      <Accordion
        items={[
          { title: "Outer A", content: <Accordion items={[{ title: "Inner", content: "…" }]} /> },
          { title: "Outer B", content: "…" },
        ]}
        defaultOpen={[0]}
      />,
    );
    trigger("Outer A").focus();
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    expect(document.activeElement).toBe(trigger("Outer B"));
  });

  it("derives stable ids from the `id` prop", () => {
    render(<Accordion id="faq" items={ITEMS} />);
    expect(trigger("Shipping").id).toBe("faq-trigger-0");
    expect(panelOf(trigger("Shipping")).id).toBe("faq-panel-0");
  });

  it("gives each instance unique ids when no `id` is passed", () => {
    render(
      <>
        <Accordion items={ITEMS} />
        <Accordion items={ITEMS} />
      </>,
    );
    const ids = screen.getAllByRole("button", { name: "Shipping" }).map((b) => b.getAttribute("aria-controls"));
    expect(ids[0]).toBeTruthy();
    expect(ids[0]).not.toBe(ids[1]);
  });

  it("forwards ARIA, data and native attributes to the <dl>", () => {
    const { container } = render(<Accordion items={ITEMS} aria-label="FAQ" data-state="ready" title="Questions" />);
    const list = container.querySelector("dl")!;
    expect(list.getAttribute("aria-label")).toBe("FAQ");
    expect(list.dataset.state).toBe("ready");
    expect(list.title).toBe("Questions");
  });

  it("does not leak its own props as DOM attributes", () => {
    const { container } = render(<Accordion items={ITEMS} multiple defaultOpen={[0]} class="custom" />);
    const list = container.querySelector("dl")!;
    for (const prop of ["items", "multiple", "defaultopen"]) expect(list.hasAttribute(prop)).toBe(false);
    expect(list.classList.contains("custom")).toBe(true);
  });
});
