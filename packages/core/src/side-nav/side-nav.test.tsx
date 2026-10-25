/** @jsxImportSource react */
// Runs against the compiled React output (`mitosis build` first), not the .lite source.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import SideNav from "@/side-nav/side-nav";

afterEach(cleanup);

const GROUPS = [
  { title: "Getting started", items: [{ label: "Introduction", href: "/docs" }, { label: "Installation", href: "/docs/installation" }] },
  { title: "Components", items: [{ label: "Button", href: "/docs/button" }, { label: "Card", href: "/docs/card" }] },
  { items: [{ label: "Changelog", href: "/changelog" }] },
];

describe("SideNav", () => {
  it("has no axe violations", async () => {
    const { container } = render(<SideNav label="Docs" groups={GROUPS} currentHref="/docs/button" />);
    // jsdom has no layout: color-contrast is covered by tokens.test.ts instead
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });

  it("is a named navigation landmark with one named list per group", () => {
    render(<SideNav label="Docs" groups={GROUPS} />);
    const nav = screen.getByRole("navigation", { name: "Docs" });
    const components = within(nav).getByRole("list", { name: "Components" });
    expect(within(components).getAllByRole("link").map((link) => link.textContent)).toEqual(["Button", "Card"]);
    expect(within(nav).getAllByRole("list")).toHaveLength(3);
  });

  it("marks the current page, and only it", () => {
    render(<SideNav label="Docs" groups={GROUPS} currentHref="/docs/button" />);
    expect(screen.getByRole("link", { name: "Button" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getAllByRole("link").filter((link) => link.hasAttribute("aria-current"))).toHaveLength(1);
  });

  it("follows plain links without onNavigate", () => {
    render(<SideNav label="Docs" groups={GROUPS} />);
    const link = screen.getByRole("link", { name: "Card" });
    expect(link.getAttribute("href")).toBe("/docs/card");
    // not prevented: the browser follows it
    expect(fireEvent.click(link)).toBe(true);
  });

  it("hands plain clicks to onNavigate, but keeps new-tab clicks for the browser", () => {
    const onNavigate = vi.fn();
    render(<SideNav label="Docs" groups={GROUPS} onNavigate={onNavigate} />);
    const link = screen.getByRole("link", { name: "Card" });
    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate).toHaveBeenCalledWith("/docs/card", expect.anything());
    expect(fireEvent.click(link, { metaKey: true })).toBe(true);
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("forwards attributes to the nav, without leaking its own props", () => {
    render(<SideNav label="Docs" groups={GROUPS} class="custom" id="docs-nav" data-section="docs" />);
    const nav = screen.getByRole("navigation");
    expect(nav.id).toBe("docs-nav");
    expect(nav.dataset.section).toBe("docs");
    expect(nav.classList.contains("custom")).toBe(true);
    expect(nav.hasAttribute("groups")).toBe(false);
  });

  it("shows icons and counts, names links with their count and hides the icons", async () => {
    const { container } = render(
      <SideNav
        label="Main"
        currentHref="/"
        groups={[
          {
            title: "Library",
            items: [
              { label: "Knowledge base", href: "/", icon: <svg data-testid="library" />, count: 9 },
              { label: "Alerts", href: "/alerts", count: 2, countLabel: "unread", highlightCount: true },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Knowledge base 9" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Alerts 2 unread" })).toBeTruthy();
    expect(screen.getByTestId("library").closest("[aria-hidden=true]")).not.toBeNull();
    expect(screen.getByText("2").className).not.toBe(screen.getByText("9").className);
    const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(violations).toEqual([]);
  });
});
