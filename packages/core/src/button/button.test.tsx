/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Button from "@/button/button";

afterEach(cleanup);

describe("Button", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Button>Save</Button>
        <Button aria-label="Close">×</Button>
        <Button disabled>Save</Button>
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("renders its children as an accessible button", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
  });

  it("defaults to type=button so it never submits a form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("forwards an explicit type", () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button") as HTMLButtonElement;
    fireEvent.click(button);
    expect(button.disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges a custom class with its own styles", () => {
    render(<Button class="custom">Save</Button>);
    const classes = screen.getByRole("button").classList;
    expect(classes.contains("custom")).toBe(true);
    expect(classes.length).toBeGreaterThan(1);
  });

  const VARIANTS = ["default", "secondary", "outline", "ghost", "link", "destructive"] as const;
  const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;

  it("applies distinct styles to every variant", () => {
    render(<>{VARIANTS.map((v) => <Button key={v} variant={v}>{v}</Button>)}</>);
    const classNames = screen.getAllByRole("button").map((b) => b.className);
    expect(new Set(classNames).size).toBe(VARIANTS.length);
  });

  it("applies distinct styles to every size", () => {
    render(<>{SIZES.map((s) => <Button key={s} size={s}>{s}</Button>)}</>);
    const classNames = screen.getAllByRole("button").map((b) => b.className);
    expect(new Set(classNames).size).toBe(SIZES.length);
  });

  it("defaults to the default variant and md size", () => {
    render(
      <>
        <Button>implicit</Button>
        <Button variant="default" size="md">explicit</Button>
      </>,
    );
    const [implicit, explicit] = screen.getAllByRole("button");
    expect(implicit!.className).toBe(explicit!.className);
  });

  it("forwards ARIA, data and native attributes to the <button>", () => {
    render(
      <Button aria-label="Close" aria-expanded={false} data-state="closed" id="close" name="action" title="Close dialog">
        ×
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Close" });
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.dataset.state).toBe("closed");
    expect(button.id).toBe("close");
    expect(button.getAttribute("name")).toBe("action");
    expect(button.title).toBe("Close dialog");
  });

  it("forwards extra event handlers", () => {
    const onKeyDown = vi.fn();
    render(<Button onKeyDown={onKeyDown}>Save</Button>);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("does not leak its own props as DOM attributes", () => {
    render(
      <Button variant="outline" size="lg" class="custom">
        Save
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.hasAttribute("variant")).toBe(false);
    expect(button.hasAttribute("size")).toBe(false);
    expect(button.classList.contains("custom")).toBe(true);
  });
});
