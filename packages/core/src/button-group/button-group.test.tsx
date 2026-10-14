/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import ButtonGroup from "@/button-group/button-group";
import Button from "@/button/button";

afterEach(cleanup);

describe("ButtonGroup", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <ButtonGroup aria-label="Text alignment">
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
        <ButtonGroup aria-label="Zoom" orientation="vertical">
          <Button variant="outline" aria-label="Zoom in">+</Button>
          <Button variant="outline" aria-label="Zoom out">−</Button>
        </ButtonGroup>
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a named group containing its buttons, each one still a tab stop", () => {
    const onClick = vi.fn();
    render(
      <ButtonGroup aria-label="Text alignment">
        <Button onClick={onClick}>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group", { name: "Text alignment" });
    expect(group.querySelectorAll("button").length).toBe(2);
    expect(screen.getByRole("button", { name: "Right" }).tabIndex).toBe(0);
    fireEvent.click(screen.getByRole("button", { name: "Left" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies distinct styles per orientation and defaults to horizontal", () => {
    render(
      <>
        <ButtonGroup aria-label="implicit" />
        <ButtonGroup aria-label="horizontal" orientation="horizontal" />
        <ButtonGroup aria-label="vertical" orientation="vertical" />
      </>,
    );
    const [implicit, horizontal, vertical] = screen.getAllByRole("group").map((group) => group.className);
    expect(implicit).toBe(horizontal);
    expect(vertical).not.toBe(horizontal);
  });

  it("forwards attributes, without leaking its own props or a role override", () => {
    render(<ButtonGroup aria-label="Actions" orientation="vertical" class="custom" id="actions" data-size="sm" />);
    const group = screen.getByRole("group", { name: "Actions" });
    expect(group.id).toBe("actions");
    expect(group.dataset.size).toBe("sm");
    expect(group.classList.contains("custom")).toBe(true);
    expect(group.hasAttribute("orientation")).toBe(false);
  });
});
