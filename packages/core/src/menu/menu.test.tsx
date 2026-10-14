/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import axe from "axe-core";
import Menu from "@/menu/menu";

afterEach(cleanup);

const items = (onSelect = vi.fn()) => [
  { label: "Edit", onSelect: () => onSelect("edit") },
  { label: "Duplicate", onSelect: () => onSelect("duplicate") },
  { label: "Archive", onSelect: () => onSelect("archive"), disabled: true },
  { label: "Delete", onSelect: () => onSelect("delete") },
];
const trigger = () => screen.getByRole("button", { name: "Actions" });
const item = (name: string) => screen.getByRole("menuitem", { name });

// jsdom has no layout: stub the viewport, the rect of the trigger wrapper and the size of the popup
function stubLayout(anchor: { top: number; left: number; width: number; height: number }, popup: { width: number; height: number }) {
  const restore = [
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(800),
    vi.spyOn(window, "innerHeight", "get").mockReturnValue(600),
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      ...anchor,
      right: anchor.left + anchor.width,
      bottom: anchor.top + anchor.height,
      x: anchor.left,
      y: anchor.top,
      toJSON: () => ({}),
    }),
    vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(popup.width),
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(popup.height),
  ];
  return () => restore.forEach((spy) => spy.mockRestore());
}


describe("Menu", () => {
  it("has no axe violations, closed and open", async () => {
    const { container } = render(<Menu id="actions" label="Actions" items={items()} />);
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const options = { rules: { "color-contrast": { enabled: false } } };
    expect((await axe.run(container, options)).violations).toEqual([]);
    fireEvent.click(trigger());
    expect((await axe.run(container, options)).violations).toEqual([]);
  });

  it("is a menu button whose menu is named by it", async () => {
    render(<Menu id="actions" label="Actions" items={items()} />);
    expect(trigger().getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger());
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    // shown once placed, on the next frame
    const menu = await screen.findByRole("menu", { name: "Actions" });
    expect(trigger().getAttribute("aria-controls")).toBe(menu.id);
    expect(screen.getAllByRole("menuitem")).toHaveLength(4);
  });

  it("opens on ArrowDown on the first item and on ArrowUp on the last", async () => {
    render(<Menu id="actions" label="Actions" items={items()} />);
    fireEvent.keyDown(trigger(), { key: "ArrowDown" });
    await waitFor(() => expect(document.activeElement).toBe(item("Edit")));
    fireEvent.keyDown(item("Edit"), { key: "Escape" });
    fireEvent.keyDown(trigger(), { key: "ArrowUp" });
    await waitFor(() => expect(document.activeElement).toBe(item("Delete")));
  });

  it("moves with the arrows (wrapping), Home, End and the first letter", async () => {
    render(<Menu id="actions" label="Actions" items={items()} />);
    fireEvent.keyDown(trigger(), { key: "Enter" });
    await waitFor(() => expect(document.activeElement).toBe(item("Edit")));
    fireEvent.keyDown(item("Edit"), { key: "ArrowUp" });
    expect(document.activeElement).toBe(item("Delete"));
    fireEvent.keyDown(item("Delete"), { key: "ArrowDown" });
    expect(document.activeElement).toBe(item("Edit"));
    fireEvent.keyDown(item("Edit"), { key: "End" });
    expect(document.activeElement).toBe(item("Delete"));
    fireEvent.keyDown(item("Delete"), { key: "Home" });
    expect(document.activeElement).toBe(item("Edit"));
    fireEvent.keyDown(item("Edit"), { key: "d" });
    expect(document.activeElement).toBe(item("Duplicate"));
    fireEvent.keyDown(item("Duplicate"), { key: "d" });
    expect(document.activeElement).toBe(item("Delete"));
  });

  it("closes on Escape and gives the focus back to the button", async () => {
    render(<Menu id="actions" label="Actions" items={items()} />);
    fireEvent.keyDown(trigger(), { key: "ArrowDown" });
    await waitFor(() => expect(document.activeElement).toBe(item("Edit")));
    fireEvent.keyDown(item("Edit"), { key: "Escape" });
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger());
  });

  it("runs the chosen action, closes, and ignores a disabled item", async () => {
    const onSelect = vi.fn();
    render(<Menu id="actions" label="Actions" items={items(onSelect)} />);
    fireEvent.click(trigger());
    fireEvent.click(await screen.findByRole("menuitem", { name: "Archive" }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(item("Archive").getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(item("Duplicate"));
    expect(onSelect).toHaveBeenCalledWith("duplicate");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger());
  });

  it("closes when the focus leaves it", () => {
    render(
      <>
        <Menu id="actions" label="Actions" items={items()} />
        <button type="button">Elsewhere</button>
      </>,
    );
    fireEvent.click(trigger());
    fireEvent.blur(trigger(), { relatedTarget: screen.getByRole("button", { name: "Elsewhere" }) });
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
  });

  it("forwards attributes to the trigger, without leaking its own props", () => {
    render(<Menu id="actions" label="Actions" items={items()} disabled data-menu="row" class="custom" />);
    expect((trigger() as HTMLButtonElement).disabled).toBe(true);
    expect(trigger().dataset.menu).toBe("row");
    expect(trigger().hasAttribute("items")).toBe(false);
  });

  it("opens above and on the other edge when it would leave the viewport", async () => {
    const restore = stubLayout({ top: 560, left: 760, width: 100, height: 36 }, { width: 160, height: 140 });
    try {
      render(<Menu id="actions" label="Actions" items={items()} />);
      fireEvent.click(trigger());
      const menu = await screen.findByRole("menu", { name: "Actions" });
      expect(menu.dataset.side).toBe("top");
      expect(menu.dataset.align).toBe("end");
    } finally {
      restore();
    }
  });

  it("opens below on its preferred edge when it fits", async () => {
    const restore = stubLayout({ top: 100, left: 100, width: 100, height: 36 }, { width: 160, height: 140 });
    try {
      render(<Menu id="actions" label="Actions" items={items()} />);
      fireEvent.click(trigger());
      const menu = await screen.findByRole("menu", { name: "Actions" });
      expect(menu.dataset.side).toBe("bottom");
      expect(menu.dataset.align).toBe("start");
    } finally {
      restore();
    }
  });
});
