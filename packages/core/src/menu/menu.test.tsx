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

  it("moves the focus to the item under the pointer, but not to a disabled one", async () => {
    render(<Menu id="actions" label="Actions" items={items()} />);
    fireEvent.keyDown(trigger(), { key: "ArrowDown" });
    await waitFor(() => expect(document.activeElement).toBe(item("Edit")));
    fireEvent.mouseEnter(item("Duplicate"));
    expect(document.activeElement).toBe(item("Duplicate"));
    fireEvent.mouseEnter(item("Archive"));
    expect(document.activeElement).toBe(item("Duplicate"));
    // the keys go on from the hovered item
    fireEvent.keyDown(item("Duplicate"), { key: "ArrowDown" });
    expect(document.activeElement).toBe(item("Archive"));
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
    // wait until the menu is placed and focused, as a user would: no focus can land after the choice
    await waitFor(() => expect(document.activeElement).toBe(item("Edit")));
    fireEvent.click(item("Archive"));
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

  describe("with icons, groups and a destructive item", () => {
    const grouped = (onSelect = vi.fn()) => [
      { label: "Watch", icon: <svg data-testid="eye" />, onSelect: () => onSelect("watch") },
      {
        title: "Collections",
        items: [
          { label: "Add to Reading list", onSelect: () => onSelect("add") },
          { label: "Remove from API toolkit", onSelect: () => onSelect("remove-from") },
        ],
      },
      { label: "Remove", destructive: true, onSelect: () => onSelect("remove") },
    ];

    it("has no axe violations when open", async () => {
      const { container } = render(<Menu id="actions" label="Actions" items={grouped()} />);
      fireEvent.click(trigger());
      await screen.findByRole("menu", { name: "Actions" });
      const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
      expect(violations).toEqual([]);
    });

    it("names each group by its title and separates it from the items around it", async () => {
      render(<Menu id="actions" label="Actions" items={grouped()} />);
      fireEvent.click(trigger());
      const group = await screen.findByRole("group", { name: "Collections" });
      expect(group.querySelectorAll("[role=menuitem]")).toHaveLength(2);
      expect(screen.getAllByRole("separator", { hidden: true })).toHaveLength(2);
    });

    it("moves through the groups with the arrows and selects a grouped item", async () => {
      const onSelect = vi.fn();
      render(<Menu id="actions" label="Actions" items={grouped(onSelect)} />);
      fireEvent.keyDown(trigger(), { key: "ArrowDown" });
      await waitFor(() => expect(document.activeElement).toBe(item("Watch")));
      fireEvent.keyDown(item("Watch"), { key: "ArrowDown" });
      expect(document.activeElement).toBe(item("Add to Reading list"));
      fireEvent.keyDown(item("Add to Reading list"), { key: "End" });
      expect(document.activeElement).toBe(item("Remove"));
      fireEvent.click(item("Remove from API toolkit"));
      expect(onSelect).toHaveBeenCalledWith("remove-from");
    });

    it("hides item icons from assistive technology and styles destructive items apart", async () => {
      render(<Menu id="actions" label="Actions" items={grouped()} />);
      fireEvent.click(trigger());
      await screen.findByRole("menu");
      expect(item("Watch").textContent).toBe("Watch");
      expect(screen.getByTestId("eye").closest("[aria-hidden=true]")).not.toBeNull();
      expect(item("Remove").className).not.toBe(item("Add to Reading list").className);
    });
  });

  it("can be an icon-only ghost trigger, named by aria-label and without the chevron", () => {
    render(
      <>
        <Menu id="plain" label="Actions" items={items()} />
        <Menu id="more" icon variant="ghost" aria-label="Actions for Zod" label="⋯" items={items()} />
      </>,
    );
    const icon = screen.getByRole("button", { name: "Actions for Zod" });
    expect(icon.querySelector("svg")).toBeNull();
    expect(icon.className).not.toBe(trigger().className);
    expect(icon.hasAttribute("variant")).toBe(false);
    expect(icon.hasAttribute("icon")).toBe(false);
  });

  it("renders mixed items and groups without React key warnings", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <Menu
        id="mixed"
        label="Actions"
        items={[
          { label: "Watch", onSelect: () => {} },
          { title: "Collections", items: [{ label: "Add", onSelect: () => {} }] },
          { label: "Remove", onSelect: () => {} },
        ]}
      />,
    );
    fireEvent.click(trigger());
    const warnings = spy.mock.calls.filter((call) => String(call[0]).includes("key"));
    spy.mockRestore();
    expect(warnings).toEqual([]);
  });
});
