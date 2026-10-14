/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import Tabs from "@/tabs/tabs";

afterEach(cleanup);

const ITEMS = [
  { value: "account", label: "Account", content: "Account settings" },
  { value: "billing", label: "Billing", content: "Billing settings" },
  { value: "team", label: "Team", content: "Team settings", disabled: true },
  { value: "danger", label: "Danger zone", content: "Delete the project" },
];

describe("Tabs", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <Tabs id="settings" label="Settings" items={ITEMS} />
        <Tabs id="side" label="Sections" items={ITEMS} orientation="vertical" defaultValue="billing" />
      </>,
    );
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("links each tab to its panel and shows only the selected panel", () => {
    render(<Tabs id="settings" label="Settings" items={ITEMS} />);
    expect(screen.getByRole("tablist", { name: "Settings" })).toBeTruthy();
    const tab = screen.getByRole("tab", { name: "Account", selected: true });
    const panel = screen.getByRole("tabpanel", { name: "Account" });
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.textContent).toBe("Account settings");
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
  });

  it("has a single tab stop on the selected tab", () => {
    render(<Tabs id="settings" label="Settings" items={ITEMS} defaultValue="billing" />);
    const stops = screen.getAllByRole("tab").filter((tab) => tab.tabIndex === 0);
    expect(stops.map((tab) => tab.textContent)).toEqual(["Billing"]);
  });

  it("selects on click, but not a disabled tab", () => {
    const onValueChange = vi.fn();
    render(<Tabs id="settings" label="Settings" items={ITEMS} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: "Billing" }));
    expect(screen.getByRole("tab", { name: "Billing" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toBe("Billing settings");
    fireEvent.click(screen.getByRole("tab", { name: "Team" }));
    expect(screen.getByRole("tab", { name: "Team" }).getAttribute("aria-selected")).toBe("false");
    expect(onValueChange.mock.calls).toEqual([["billing"]]);
  });

  it("moves focus and selection with the arrows, Home and End, wrapping around", () => {
    render(<Tabs id="settings" label="Settings" items={ITEMS} />);
    const tab = (name: string) => screen.getByRole("tab", { name });
    tab("Account").focus();
    fireEvent.keyDown(tab("Account"), { key: "ArrowLeft" });
    expect(document.activeElement).toBe(tab("Danger zone"));
    expect(tab("Danger zone").getAttribute("aria-selected")).toBe("true");
    fireEvent.keyDown(tab("Danger zone"), { key: "ArrowRight" });
    expect(document.activeElement).toBe(tab("Account"));
    fireEvent.keyDown(tab("Account"), { key: "End" });
    expect(document.activeElement).toBe(tab("Danger zone"));
    fireEvent.keyDown(tab("Danger zone"), { key: "Home" });
    expect(document.activeElement).toBe(tab("Account"));
  });

  it("focuses a disabled tab with the keyboard without selecting it", () => {
    render(<Tabs id="settings" label="Settings" items={ITEMS} defaultValue="billing" />);
    fireEvent.keyDown(screen.getByRole("tab", { name: "Billing" }), { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Team" }));
    expect(screen.getByRole("tab", { name: "Team" }).getAttribute("aria-disabled")).toBe("true");
    expect(screen.getByRole("tab", { name: "Billing" }).getAttribute("aria-selected")).toBe("true");
  });

  it("uses the up and down arrows when vertical", () => {
    render(<Tabs id="side" label="Sections" items={ITEMS} orientation="vertical" />);
    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("vertical");
    fireEvent.keyDown(screen.getByRole("tab", { name: "Account" }), { key: "ArrowDown" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Billing" }));
    fireEvent.keyDown(screen.getByRole("tab", { name: "Billing" }), { key: "ArrowRight" });
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Billing" }));
  });

  it("follows a controlled value", () => {
    const { rerender } = render(<Tabs id="settings" label="Settings" items={ITEMS} value="billing" />);
    expect(screen.getByRole("tabpanel").textContent).toBe("Billing settings");
    rerender(<Tabs id="settings" label="Settings" items={ITEMS} value="danger" />);
    expect(screen.getByRole("tabpanel").textContent).toBe("Delete the project");
  });

  it("forwards attributes to the root, without leaking its own props", () => {
    const { container } = render(<Tabs id="settings" label="Settings" items={ITEMS} class="custom" data-section="prefs" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.section).toBe("prefs");
    expect(root.classList.contains("custom")).toBe(true);
    expect(root.hasAttribute("items")).toBe(false);
    expect(root.hasAttribute("label")).toBe(false);
  });
});
