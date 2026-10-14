/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Card from "@/card/card";
import Button from "@/button/button";

afterEach(cleanup);

describe("Card", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Card title="Plan" description="Billed monthly." footer={<Button>Upgrade</Button>}>
          <p>3 seats</p>
        </Card>
        <Card>
          <p>Content only</p>
        </Card>
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("exposes its title as a level 3 heading by default", () => {
    render(<Card title="Plan" />);
    expect(screen.getByRole("heading", { name: "Plan", level: 3 })).toBeTruthy();
  });

  it("uses the given heading level", () => {
    render(<Card title="Plan" headingLevel={2} />);
    expect(screen.getByRole("heading", { name: "Plan", level: 2 })).toBeTruthy();
  });

  it("renders description, content and footer", () => {
    render(
      <Card title="Plan" description="Billed monthly." footer={<Button>Upgrade</Button>}>
        <p>3 seats</p>
      </Card>,
    );
    expect(screen.getByText("Billed monthly.").tagName).toBe("P");
    expect(screen.getByText("3 seats")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeTruthy();
  });

  it("renders no heading or empty wrappers when they are not given", () => {
    const { container } = render(<Card>Body</Card>);
    expect(screen.queryByRole("heading")).toBeNull();
    expect(container.firstElementChild!.children.length).toBe(1);
  });

  it("forwards ARIA, data and native attributes, without leaking its own props", () => {
    const { container } = render(
      <Card title="Plan" headingLevel={4} class="custom" id="plan" data-state="active" aria-describedby="note" />,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.id).toBe("plan");
    expect(card.dataset.state).toBe("active");
    expect(card.getAttribute("aria-describedby")).toBe("note");
    expect(card.classList.contains("custom")).toBe(true);
    // `title` is the heading, not the native tooltip attribute
    expect(card.hasAttribute("title")).toBe(false);
    expect(card.hasAttribute("headingLevel")).toBe(false);
  });
});
